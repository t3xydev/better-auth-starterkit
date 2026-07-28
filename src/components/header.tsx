import { GitHubIcon } from "@daveyplate/better-auth-ui"
import { headers } from "next/headers"
import Link from "next/link"
import { Settings } from "lucide-react"

import { auth } from "@/lib/auth"
import { HeaderUserMenu } from "./header-user-menu"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export async function Header() {
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
    const isAdmin = session?.user?.role === "admin"
    const appName = process.env.APPLICATION_NAME || "Better Auth StarterKit"
    const logoUrl = process.env.LOGO_URL

    return (
        <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-safe-or-4 backdrop-blur md:h-14 md:px-safe-or-6">
            <Link href="/" className="flex h-full items-center py-2.5 md:py-3">
                {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary CDN URL via LOGO_URL
                    <img
                        src={logoUrl}
                        alt={appName}
                        className="h-full w-auto object-contain"
                    />
                ) : (
                    appName
                )}
            </Link>

            <div className="flex items-center gap-2">
                {isAdmin && (
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-full"
                        >
                            <Settings className="size-4" />
                        </Button>
                    </Link>
                )}

                {process.env.NEXT_PUBLIC_HIDE_GITHUB !== "true" && (
                    <Link
                        href="https://github.com/t3xydev/better-auth-starterkit"
                        target="_blank"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-full"
                        >
                            <GitHubIcon />
                        </Button>
                    </Link>
                )}

                <ModeToggle />
                <HeaderUserMenu />
            </div>
        </header>
    )
}
