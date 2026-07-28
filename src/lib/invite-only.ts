/** Opt-in invite-only registration. Defaults to off. */
export const inviteOnly =
    process.env.NEXT_PUBLIC_INVITE_ONLY === "true"

/** Cookie name passed to `createAuthCookie` by better-invite (prefix applied by Better Auth). */
export const INVITE_TOKEN_COOKIE = "invite_token"

export function hasInviteTokenCookie(
    cookieStore: { has: (name: string) => boolean },
) {
    return (
        cookieStore.has(`better-auth.${INVITE_TOKEN_COOKIE}`) ||
        cookieStore.has(`__Secure-better-auth.${INVITE_TOKEN_COOKIE}`)
    )
}
