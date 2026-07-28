import { OrganizationView } from "@daveyplate/better-auth-ui"
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server"
import { notFound } from "next/navigation"

import { organizationsEnabled } from "@/lib/organizations"

export const dynamicParams = false

export function generateStaticParams() {
    if (!organizationsEnabled) return []
    return Object.values(organizationViewPaths).map((path) => ({ path }))
}

export default async function OrganizationPage({
    params
}: {
    params: Promise<{ path: string }>
}) {
    if (!organizationsEnabled) notFound()

    const { path } = await params

    return (
        <main className="container self-center p-4 md:p-6">
            <OrganizationView
                path={path}
                classNames={{
                    sidebar: {
                        base: "sticky top-20"
                    }
                }}
            />
        </main>
    )
}
