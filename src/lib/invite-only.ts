/** Opt-in invite-only registration. Defaults to off. */
export const inviteOnly =
    process.env.NEXT_PUBLIC_INVITE_ONLY === "true"

/** Cookie name passed to `createAuthCookie` by better-invite (prefix applied by Better Auth). */
export const INVITE_TOKEN_COOKIE = "invite_token"

export const INVITE_COOKIE_NAMES = [
    `better-auth.${INVITE_TOKEN_COOKIE}`,
    `__Secure-better-auth.${INVITE_TOKEN_COOKIE}`,
] as const

export function hasInviteTokenCookie(
    cookieStore: { has: (name: string) => boolean },
) {
    return INVITE_COOKIE_NAMES.some((name) => cookieStore.has(name))
}
