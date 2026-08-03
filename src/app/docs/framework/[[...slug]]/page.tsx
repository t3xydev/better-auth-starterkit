import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle
} from "fumadocs-ui/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/mdx"
import { docsEnabled } from "@/lib/docs"
import { source } from "@/lib/source"

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>
}) {
    if (!docsEnabled) notFound()

    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX components={getMDXComponents()} />
            </DocsBody>
        </DocsPage>
    )
}

export async function generateStaticParams() {
    if (!docsEnabled) return []
    return source.generateParams()
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
    if (!docsEnabled) return {}

    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description
    }
}
