import { betterAuth, type BetterAuthPlugin } from "better-auth"
import { dash, sentinel } from "@better-auth/infra"
import { passkey, getAuthenticatorName } from "@better-auth/passkey"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin, jwt, openAPI, organization, twoFactor } from "better-auth/plugins"
import { oauthProvider } from "@better-auth/oauth-provider"; 
import { invite } from "better-invite"
import { nostr } from "better-auth-nostr"
import { dbsc } from "@dbsc-toolkit/better-auth"
import { devtools } from "better-auth-devtools"
import { nostrLink } from "@/lib/plugins/nostr-link"

import { db } from "@/database/db"
import * as schema from "@/database/schema"
import { sendEmail } from "./email"
import { organizationsEnabled } from "./organizations"

/** Bridges better-invite `$ERROR_CODES` to Better Auth’s `RawError` shape. See `docs/typescript-better-invite.md`. */
type FixErrorCodes<T> = Omit<T, "$ERROR_CODES"> & Pick<BetterAuthPlugin, "$ERROR_CODES">

const ALLOWED_SCOPES = ["openid", "profile", "email", "offline_access"] as const

const authOrigin = (
    process.env.BETTER_AUTH_URL || "http://localhost:3000"
).replace(/\/$/, "")

const trustedOrigins = [
    authOrigin,
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean),
]

export const auth = betterAuth({
    // baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    appName: process.env.APPLICATION_NAME || "Better Auth StarterKit",
    trustedOrigins,
    experimental: {
        joins: true,
    },
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
        },
    },
    session: {
        storeSessionInDatabase: true,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            strategy: "jwe",
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            })
        },
    },
    disabledPaths: ["/token"],
    plugins: [
        admin(),
        twoFactor(),
        passkey({
            rpName: process.env.APPLICATION_NAME || "Better Auth StarterKit",
            origin: authOrigin,
            rpID: new URL(authOrigin).hostname,
            registration: {
                afterVerification: async ({ verification }) => ({
                    name: getAuthenticatorName(
                        verification.registrationInfo?.aaguid,
                    ),
                }),
            },
        }),
        ...(organizationsEnabled
            ? [
                  organization({
                      async sendInvitationEmail(data) {
                          const inviteLink = `${authOrigin}/auth/accept-invitation?invitationId=${data.id}`
                          void sendEmail({
                              to: data.email,
                              subject: `Join ${data.organization.name}`,
                              text: `${data.inviter.user.name} invited you to join ${data.organization.name}. Accept the invitation: ${inviteLink}`,
                          })
                      },
                  }),
              ]
            : []),
        invite({
            // Custom UI activation flow — see https://www.better-invite.com/docs/examples
            defaultCustomInviteUrl: `${authOrigin}/invite/activate/{token}`,
            defaultRedirectAfterUpgrade: "/auth/invited",
            defaultRedirectToSignIn: "/auth/sign-in",
            defaultRedirectToSignUp: "/auth/sign-up",
            defaultMaxUses: 1,
            defaultSenderResponse: "url",
            // Keep welcome copy simple unless a private invite opts in
            defaultShareInviterName: false,
            // Cancel/reject removes the invite row instead of leaving a canceled record
            cleanupInvitesOnDecision: true,
            // Only admins can create invites (prevents role escalation)
            canCreateInvite: async ({ inviterUser, invitedUser }) => {
                if (inviterUser.role !== "admin") return false
                // Admins may invite as user or admin only
                return invitedUser.role === "user" || invitedUser.role === "admin"
            },
            async sendUserInvitation({ email, role, url, newAccount }) {
                void sendEmail({
                    to: email,
                    subject: newAccount
                        ? "You've been invited"
                        : "You've been invited to a new role",
                    text: newAccount
                        ? `You've been invited with the role "${role}". Accept the invitation: ${url}`
                        : `You've been invited to upgrade to the role "${role}". Accept: ${url}`,
                })
            },
        }) as unknown as FixErrorCodes<ReturnType<typeof invite>>,
        nostr({
            disableImplicitSignUp: true,
        }),
        nostrLink(),
        dash(), 
        sentinel(),
        openAPI(),
        jwt({
            jwt: {
                issuer: process.env.BETTER_AUTH_URL || process.env.OAUTH_ISSUER || "http://localhost:3000",
            },
        }),
        oauthProvider({
            loginPage: "/auth/sign-in",
            consentPage: "/consent",
            scopes: [...ALLOWED_SCOPES],
            validAudiences: [
                process.env.BETTER_AUTH_URL || process.env.OAUTH_AUDIENCE || "http://localhost:3000",
            ],
            allowDynamicClientRegistration: true,
            allowUnauthenticatedClientRegistration: false,
            allowPublicClientPrelogin: false,
            clientRegistrationAllowedScopes: [...ALLOWED_SCOPES],
            rateLimit: {
                register: { window: 60, max: 3 },
                authorize: { window: 60, max: 20 },
                token: { window: 60, max: 15 },
                revoke: { window: 60, max: 10 },
                introspect: { window: 60, max: 20 },
                userinfo: { window: 60, max: 30 },
            },
            customAccessTokenClaims: async ({ user }) => (
                user?.role ? { roles: [user.role] } : {}
            ),
            customIdTokenClaims: async ({ user }) => (
                user.role ? { roles: [user.role] } : {}
            ),
            customUserInfoClaims: async ({ user }) => (
                user.role ? { roles: [user.role] } : {}
            ),
            advertisedMetadata: {
                claims_supported: [
                    "sub", "iss", "aud", "exp", "iat", "sid", "scope", "azp",
                    "email", "email_verified",
                    "name", "picture", "given_name", "family_name",
                    "roles",
                ],
            },
            silenceWarnings: {
                openidConfig: true,
                oauthConfig: true,
                oauthAuthServerConfig: true,
            },
        }),
        dbsc() as BetterAuthPlugin,
        devtools({
            enabled: true,
            templates: {
                admin: { label: "Admin", user: { role: "admin" } },
                user: { label: "User", user: { role: "user" } },
            },
            editableFields: [
                {
                    key: "role",
                    label: "Role",
                    type: "select",
                    options: ["admin", "user"],
                },
            ],
        }),
        nextCookies(),
    ]
})
