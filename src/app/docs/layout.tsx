import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { docsEnabled } from "@/lib/docs"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
    if (!docsEnabled) notFound()

    return (
        <DocsLayout tree={source.pageTree} {...baseOptions()}>
            {children}
        </DocsLayout>
    )
}
