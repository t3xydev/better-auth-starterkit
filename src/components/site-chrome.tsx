"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function SiteChrome({
    header,
    children
}: {
    header: ReactNode
    children: ReactNode
}) {
    const pathname = usePathname()
    const isDocs =
        pathname === "/docs" ||
        pathname === "/docs/framework" ||
        pathname.startsWith("/docs/framework/")

    return (
        <>
            {!isDocs && header}
            {children}
        </>
    )
}
