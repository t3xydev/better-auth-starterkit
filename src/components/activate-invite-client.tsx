"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function ActivateInviteClient({
    token,
    isPrivate,
}: {
    token: string
    /** better-invite only allows reject on private (email-bound) invites */
    isPrivate: boolean
}) {
    const router = useRouter()
    const [loading, setLoading] = useState<"accept" | "reject" | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function acceptInvite() {
        setLoading("accept")
        setError(null)

        const { data, error: activateError } = await authClient.invite.activate({
            token,
        })

        if (activateError) {
            setError(activateError.message ?? "Failed to activate invite.")
            setLoading(null)
            return
        }

        if (data?.action === "SIGN_IN_UP_REQUIRED" && data.redirectTo) {
            router.push(data.redirectTo)
            return
        }

        router.push(data?.redirectTo ?? "/auth/invited")
        router.refresh()
    }

    async function rejectInvite() {
        setLoading("reject")
        setError(null)

        // Public invites can't be rejected via the API (no invitee binding).
        // Declining just leaves without invalidating the shared link.
        if (!isPrivate) {
            router.push("/")
            return
        }

        const { error: rejectError } = await authClient.invite.reject({ token })

        if (rejectError) {
            setError(rejectError.message ?? "Failed to reject invite.")
            setLoading(null)
            return
        }

        router.push("/")
        router.refresh()
    }

    return (
        <div className="space-y-3">
            <Button
                className="w-full"
                disabled={loading !== null}
                onClick={acceptInvite}
            >
                {loading === "accept" ? "Activating…" : "Accept invite"}
            </Button>
            <Button
                className="w-full"
                variant="outline"
                disabled={loading !== null}
                onClick={rejectInvite}
            >
                {loading === "reject"
                    ? isPrivate
                        ? "Rejecting…"
                        : "Leaving…"
                    : isPrivate
                      ? "Reject"
                      : "Decline"}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    )
}
