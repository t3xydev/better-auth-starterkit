import { count, eq } from "drizzle-orm"

import { db } from "@/database/db"
import { inviteUses, invites } from "@/database/schema"

/** Opt-in invite-only registration. Defaults to off. */
export const inviteOnly =
    process.env.NEXT_PUBLIC_INVITE_ONLY === "true"

/** Cookie name passed to `createAuthCookie` by better-invite (prefix applied by Better Auth). */
export const INVITE_TOKEN_COOKIE = "invite_token"

const INVITE_COOKIE_NAMES = [
    `better-auth.${INVITE_TOKEN_COOKIE}`,
    `__Secure-better-auth.${INVITE_TOKEN_COOKIE}`,
] as const

export function hasInviteTokenCookie(
    cookieStore: { has: (name: string) => boolean },
) {
    return INVITE_COOKIE_NAMES.some((name) => cookieStore.has(name))
}

async function verifySignedCookieValue(
    raw: string,
    secret: string,
): Promise<string | null> {
    let value = raw
    try {
        value = decodeURIComponent(raw)
    } catch {
        // already decoded
    }
    const signatureStartPos = value.lastIndexOf(".")
    if (signatureStartPos < 1) return null
    const signedValue = value.slice(0, signatureStartPos)
    const signature = value.slice(signatureStartPos + 1)
    if (signature.length !== 44 || !signature.endsWith("=")) return null

    try {
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"],
        )
        const signatureBinStr = atob(signature)
        const signatureBytes = new Uint8Array(signatureBinStr.length)
        for (let i = 0; i < signatureBinStr.length; i++) {
            signatureBytes[i] = signatureBinStr.charCodeAt(i)
        }
        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            signatureBytes,
            new TextEncoder().encode(signedValue),
        )
        return valid ? signedValue : null
    } catch {
        return null
    }
}

/** Reads and verifies the better-invite cookie; returns the plain token or null. */
export async function getInviteTokenFromCookies(
    cookieStore: {
        get: (name: string) => { value: string } | undefined
    },
): Promise<string | null> {
    const secret = process.env.BETTER_AUTH_SECRET
    if (!secret) return null

    for (const name of INVITE_COOKIE_NAMES) {
        const raw = cookieStore.get(name)?.value
        if (!raw) continue
        const token = await verifySignedCookieValue(raw, secret)
        if (token) return token
    }
    return null
}

/**
 * True only when the invite still exists, is pending, unexpired, and has uses left.
 * Deleted / canceled invites (including after `cleanupInvitesOnDecision`) return false.
 */
export async function isUsableInviteToken(token: string): Promise<boolean> {
    const rows = await db
        .select({
            id: invites.id,
            status: invites.status,
            expiresAt: invites.expiresAt,
            maxUses: invites.maxUses,
        })
        .from(invites)
        .where(eq(invites.token, token))
        .limit(1)

    const invite = rows[0]
    if (!invite) return false
    if (invite.status !== "pending") return false
    if (invite.expiresAt.getTime() <= Date.now()) return false

    const [uses] = await db
        .select({ value: count() })
        .from(inviteUses)
        .where(eq(inviteUses.inviteId, invite.id))

    return (uses?.value ?? 0) < invite.maxUses
}
