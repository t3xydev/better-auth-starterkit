"use client"

import { AuthView, SignInForm } from "@daveyplate/better-auth-ui"
import { useEffect, useState } from "react"

import { AuthFormValidationToast } from "@/components/auth-form-validation-toast"
import { NostrSignInButton } from "@/components/nostr-sign-in-button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { inviteOnly } from "@/lib/invite-only"

export function SignInView({ appName }: { appName?: string }) {
    const [hasNostr, setHasNostr] = useState(false)
    const brand = appName || "Better Auth StarterKit"

    useEffect(() => {
        if (typeof window === "undefined") return
        if (window.nostr) setHasNostr(true)
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
                    {hasNostr ? <NostrSignInButton /> : null}
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
