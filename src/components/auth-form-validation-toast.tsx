"use client"

import type { ReactNode } from "react"
import { toast } from "sonner"

/**
 * Shows a toast when better-auth-ui (RHF + Zod) blocks submit on field errors.
 * Field-level FormMessage still renders under each input.
 */
export function AuthFormValidationToast({ children }: { children: ReactNode }) {
    return (
        <div
            className="w-full max-w-sm"
            onSubmitCapture={(event) => {
                const form = event.currentTarget.querySelector("form")
                if (!form) return

                // Zod resolver is async; wait for RHF to paint FormMessage nodes.
                window.setTimeout(() => {
                    const messages = form.querySelectorAll(
                        '[data-slot="form-message"]'
                    )
                    if (messages.length === 0) return

                    const first = messages[0]?.textContent?.trim()
                    toast.error(first || "Please fix the highlighted fields")
                }, 50)
            }}
        >
            {children}
        </div>
    )
}
