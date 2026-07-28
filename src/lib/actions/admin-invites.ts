"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) throw new Error("Not authenticated")
    if (session.user.role !== "admin") throw new Error("Forbidden")
    return session
}

export type InviteRow = {
    id: string
    token: string
    email?: string | null
    emails?: string[] | null
    role: string
    status: string
    maxUses: number
    createdAt: Date
    expiresAt: Date
}

export async function listInvites(): Promise<InviteRow[]> {
    await requireAdmin()

    const result = await auth.api.listInvites({
        headers: await headers(),
        query: {
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    })

    return (result.invitations ?? []) as InviteRow[]
}

export async function createInvite(data: {
    email?: string
    role: "user" | "admin"
    maxUses?: number
    expiresIn?: number
    shareInviterName?: boolean
}): Promise<{ status: boolean; message: string }> {
    await requireAdmin()

    const isPrivate = Boolean(data.email?.trim())

    return auth.api.createInvite({
        headers: await headers(),
        body: {
            role: data.role,
            ...(isPrivate ? { email: data.email!.trim() } : {}),
            ...(data.maxUses != null ? { maxUses: data.maxUses } : {}),
            ...(data.expiresIn != null ? { expiresIn: data.expiresIn } : {}),
            // Public invites never share; private only when explicitly enabled
            shareInviterName: isPrivate ? Boolean(data.shareInviterName) : false,
            senderResponse: "url",
        },
    })
}

/** Soft-cancel a pending invite via the better-invite plugin. */
export async function cancelInvite(token: string): Promise<{ status: boolean; message: string }> {
    await requireAdmin()

    return auth.api.cancelInvite({
        headers: await headers(),
        body: { token },
    })
}
