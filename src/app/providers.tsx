"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { RootProvider } from "fumadocs-ui/provider/next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { organizationsEnabled } from "@/lib/organizations"
import { AuthDevtools } from "@/components/better-auth-devtools"
import { DbscInit } from "@/components/dbsc-init"
import { PHProvider } from "@/components/posthog-provider"
import { PostHogIdentify } from "@/components/posthog-identify"
import { PostHogPageView } from "@/components/posthog-page-view"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <PHProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <RootProvider theme={{ enabled: false }}>
                    <AuthUIProvider
                        authClient={authClient}
                        navigate={router.push}
                        replace={router.replace}
                        onSessionChange={() => {
                            router.refresh()
                            void authClient.getSession().then(({ data }) => {
                                if (data?.session) {
                                    void window.initDbsc?.()
                                } else {
                                    void window.clearBoundKey?.()
                                }
                            })
                        }}
                        Link={Link}
                        redirectTo="/account/settings"
                        twoFactor={["totp"]}
                        passkey
                        organization={organizationsEnabled || undefined}
                        credentials={{
                            passwordValidation: {
                                minLength: 8,
                            },
                        }}
                        localization={{
                            EMAIL_PLACEHOLDER: "",
                            PASSWORD_PLACEHOLDER: "",
                            CONFIRM_PASSWORD_PLACEHOLDER: "",
                            CURRENT_PASSWORD_PLACEHOLDER: "",
                            NEW_PASSWORD_PLACEHOLDER: "",
                        }}
                    >
                        <DbscInit />
                        <Suspense fallback={null}>
                            <PostHogPageView />
                        </Suspense>
                        <PostHogIdentify />

                        {children}

                        <AuthDevtools />
                        <Toaster richColors closeButton position="top-center" />
                    </AuthUIProvider>
                </RootProvider>
            </ThemeProvider>
        </PHProvider>
    )
}
