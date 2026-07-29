"use client"

import { AuthUIContext, AuthView, SignInForm } from "@daveyplate/better-auth-ui"
import { useContext, useEffect, useState } from "react"

import { AuthFormValidationToast } from "@/components/auth-form-validation-toast"
import { NostrSignInButton } from "@/components/nostr-sign-in-button"
import { Passkey2faButton } from "@/components/passkey-2fa-button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { inviteOnly } from "@/lib/invite-only"

export function SignInView({ appName }: { appName?: string }) {
    const { localization } = useContext(AuthUIContext)
    const [hasNostr, setHasNostr] = useState(false)
    const [passkeyAvailable, setPasskeyAvailable] = useState(false)
    const brand = appName || "Better Auth StarterKit"

    useEffect(() => {
        if (typeof window === "undefined") return
        if (window.nostr) setHasNostr(true)

        if (!window.PublicKeyCredential) return
        const check = PublicKeyCredential
            .isUserVerifyingPlatformAuthenticatorAvailable?.()
        if (check) {
            check.then(setPasskeyAvailable).catch(() => setPasskeyAvailable(false))
        } else {
            setPasskeyAvailable(true)
        }
    }, [])

    if (inviteOnly) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <p className="text-sm font-medium text-muted-foreground">
                        {brand}
                    </p>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Registration is invite-only.
                        <br />
                        You&apos;ll need an invite link to create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AuthFormValidationToast>
                        <SignInForm localization={{}} />
                    </AuthFormValidationToast>
                    {passkeyAvailable || hasNostr ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Separator className="!w-auto grow" />
                                <span className="shrink-0 text-muted-foreground text-sm">
                                    {localization.OR_CONTINUE_WITH}
                                </span>
                                <Separator className="!w-auto grow" />
                            </div>
                            {passkeyAvailable ? <Passkey2faButton /> : null}
                            {hasNostr ? <NostrSignInButton /> : null}
                        </div>
                    ) : null}
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-center text-sm text-muted-foreground">
                        Have an invite? Use the link or code to sign up.
                    </p>
                </CardFooter>
            </Card>
        )
    }

    const footer = hasNostr ? (
        <div className="flex w-full flex-col gap-2">
            <NostrSignInButton />
        </div>
    ) : undefined

    return (
        <AuthFormValidationToast>
            <AuthView path="sign-in" cardFooter={footer} />
        </AuthFormValidationToast>
    )
}
