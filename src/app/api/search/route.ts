import { createFromSource } from "fumadocs-core/search/server"
import { NextResponse } from "next/server"

import { docsEnabled } from "@/lib/docs"
import { source } from "@/lib/source"

const search = createFromSource(source, {
    language: "english"
})

export function GET(request: Request) {
    if (!docsEnabled) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    return search.GET(request)
}
