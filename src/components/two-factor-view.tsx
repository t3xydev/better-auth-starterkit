"use client"

import { AuthView } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { Suspense } from "react"

import { TotpSetupKey } from "@/components/totp-setup-key"

export function TwoFactorView() {
    return (
        <AuthView
            path="two-factor"
            classNames={{
                form: {
                    base: "justify-items-center [&>.flex]:justify-center",
                    forgotPasswordLink: "hidden",
                    qrCode: "mx-auto",
                    otpInput: "h-12 w-12 text-lg",
                    otpInputContainer: "justify-center"
                },
                footerLink: "inline-flex items-center gap-1.5"
            }}
            cardFooter={
                <div className="flex w-full flex-col items-center gap-2">
                    <Suspense>
                        <TotpSetupKey />
                    </Suspense>
                    <Link
                        className="text-muted-foreground text-xs hover:text-foreground hover:underline"
                        href="/auth/recover-account"
                    >
                        Lost access to your authenticator?
                    </Link>
                </div>
            }
        />
    )
}
