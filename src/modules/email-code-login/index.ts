/** Keep the familiar sign-in URL as the preferred email-code flow. */
export const preferredAuthViewPaths = {
    EMAIL_OTP: "sign-in",
    SIGN_IN: "password"
} as const
