import { notFound, redirect } from "next/navigation"

import { docsBasePath, docsEnabled } from "@/lib/docs"

export default function DocsIndex() {
    if (!docsEnabled) notFound()
    redirect(docsBasePath)
}
