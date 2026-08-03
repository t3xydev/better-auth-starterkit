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
    const isDocs = pathname === "/docs" || pathname.startsWith("/docs/")

    return (
        <>
            {!isDocs && header}
            {children}
        </>
    )
}
