import type { PasskeyOptions } from "@better-auth/passkey"
import type { BetterAuthPlugin } from "better-auth"
import { APIError, createAuthEndpoint } from "better-auth/api"
import { expireCookie } from "better-auth/cookies"

const TWO_FACTOR_COOKIE_NAME = "two_factor"

type AfterPasskeyVerification = NonNullable<
    NonNullable<PasskeyOptions["authentication"]>["afterVerification"]
>

/**
 * When a passkey is used from an active two-factor challenge, require it to
 * belong to the same pending user and consume that challenge on success.
 * Ordinary passkey-first sign-ins have no two-factor cookie and are unchanged.
 */
export const verifyPendingTwoFactorPasskey: AfterPasskeyVerification = async ({
    ctx,
    clientData
}) => {
    const twoFactorCookie = ctx.context.createAuthCookie(TWO_FACTOR_COOKIE_NAME)
    const challengeId = await ctx.getSignedCookie(
        twoFactorCookie.name,
        ctx.context.secret
    )

    if (!challengeId) return

    const pendingChallenge =
        await ctx.context.internalAdapter.findVerificationValue(challengeId)

    if (!pendingChallenge) {
        throw new APIError("UNAUTHORIZED", {
            code: "INVALID_TWO_FACTOR_COOKIE",
            message: "The two-factor challenge is invalid or has expired."
        })
    }

    const credential = await ctx.context.adapter.findOne<{
        userId: string
    }>({
        model: "passkey",
        where: [{ field: "credentialID", value: clientData.id }]
    })

    if (!credential || credential.userId !== pendingChallenge.value) {
        throw new APIError("UNAUTHORIZED", {
            code: "PASSKEY_USER_MISMATCH",
            message:
                "This passkey does not belong to the account being verified."
        })
    }

    await ctx.context.internalAdapter.consumeVerificationValue(challengeId)
    await ctx.context.internalAdapter
        .consumeVerificationValue(`2fa-attempts-${challengeId}`)
        .catch(() => null)
    expireCookie(ctx, twoFactorCookie)
}

/** Exposes only whether the account in the pending 2FA challenge has a passkey. */
export function passkeyTwoFactorAvailability() {
    return {
        id: "passkey-two-factor-availability",
        endpoints: {
            getPasskeyTwoFactorAvailability: createAuthEndpoint(
                "/passkey/two-factor-available",
                { method: "GET" },
                async (ctx) => {
                    const twoFactorCookie = ctx.context.createAuthCookie(
                        TWO_FACTOR_COOKIE_NAME
                    )
                    const challengeId = await ctx.getSignedCookie(
                        twoFactorCookie.name,
                        ctx.context.secret
                    )

                    if (!challengeId) return ctx.json({ available: false })

                    const pendingChallenge =
                        await ctx.context.internalAdapter.findVerificationValue(
                            challengeId
                        )
                    if (!pendingChallenge) {
                        return ctx.json({ available: false })
                    }

                    const credentials = await ctx.context.adapter.findMany({
                        model: "passkey",
                        where: [
                            {
                                field: "userId",
                                value: pendingChallenge.value
                            }
                        ],
                        limit: 1
                    })

                    return ctx.json({ available: credentials.length > 0 })
                }
            )
        }
    } satisfies BetterAuthPlugin
}
