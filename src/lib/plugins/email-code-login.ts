import { emailOTP } from "better-auth/plugins"

import { sendEmail } from "@/lib/email"

const CODE_EXPIRATION_MINUTES = "5"

export function emailCodeLogin() {
    return emailOTP({
        disableSignUp: true,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
            const common = {
                to: email
            }

            if (type === "forget-password") {
                void sendEmail({
                    ...common,
                    template: "reset-password-otp",
                    subject: "Reset your password",
                    text: `Your password reset code is ${otp}. It expires in ${CODE_EXPIRATION_MINUTES} minutes.`,
                    variables: {
                        otpCode: otp,
                        userEmail: email,
                        expirationMinutes: CODE_EXPIRATION_MINUTES
                    }
                })
                return
            }

            if (type === "email-verification" || type === "change-email") {
                void sendEmail({
                    ...common,
                    template: "verify-email-otp",
                    subject: "Verify your email address",
                    text: `Your email verification code is ${otp}. It expires in ${CODE_EXPIRATION_MINUTES} minutes.`,
                    variables: {
                        otpCode: otp,
                        userEmail: email,
                        expirationMinutes: CODE_EXPIRATION_MINUTES
                    }
                })
                return
            }

            void sendEmail({
                ...common,
                template: "sign-in-otp",
                subject: "Your sign-in code",
                text: `Your sign-in code is ${otp}. It expires in ${CODE_EXPIRATION_MINUTES} minutes.`,
                variables: {
                    otpCode: otp,
                    userEmail: email,
                    expirationMinutes: CODE_EXPIRATION_MINUTES
                }
            })
        }
    })
}
