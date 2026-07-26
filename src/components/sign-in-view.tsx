"use client"

import { AuthView } from "@daveyplate/better-auth-ui"
import { useEffect, useState } from "react"

import { NostrSignInButton } from "@/components/nostr-sign-in-button"

export function SignInView() {
    const [hasNostr, setHasNostr] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (window.nostr) setHasNostr(true)
    }, [])

    const footer = hasNostr ? (
        <div className="flex w-full flex-col gap-2">
            <NostrSignInButton />
        </div>
    ) : undefined

    return <AuthView path="sign-in" cardFooter={footer} />
}
