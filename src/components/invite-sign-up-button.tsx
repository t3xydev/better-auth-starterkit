"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

/** Sets the better-invite cookie, then sends the user to sign-up. */
export function InviteSignUpButton({ token }: { token: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function prepareSignUp() {
        setLoading(true)
        setError(null)

        const { data, error: activateError } = await authClient.invite.activate({
            token,
            callbackURL: "/auth/sign-up",
        })

        if (activateError) {
            setError(activateError.message ?? "Failed to prepare invite for sign-up.")
            setLoading(false)
            return
        }

        router.push(data?.redirectTo ?? "/auth/sign-up")
    }

    return (
        <div className="w-full space-y-2">
            <Button
                className="w-full"
                variant="outline"
                disabled={loading}
                onClick={prepareSignUp}
            >
                {loading ? "Preparing…" : "Create an account"}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    )
}
