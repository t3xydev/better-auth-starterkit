import { eq } from "drizzle-orm"

import { db } from "@/database/db"
import { invites, users } from "@/database/schema"

export type InviteWelcome = {
    role: string
    status: "pending" | "rejected" | "canceled" | "used"
    expiresAt: Date
    isExpired: boolean
    isPrivate: boolean
    email: string | null
    emails: string[]
    newAccount: boolean | null
    maxUses: number
    inviterName: string | null
}

export async function getInviteWelcome(
    token: string
): Promise<InviteWelcome | null> {
    const rows = await db
        .select({
            role: invites.role,
            status: invites.status,
            expiresAt: invites.expiresAt,
            email: invites.email,
            emails: invites.emails,
            newAccount: invites.newAccount,
            maxUses: invites.maxUses,
            shareInviterName: invites.shareInviterName,
            inviterName: users.name,
        })
        .from(invites)
        .leftJoin(users, eq(invites.createdByUserId, users.id))
        .where(eq(invites.token, token))
        .limit(1)

    const row = rows[0]
    if (!row) return null

    const emails = [
        ...(row.emails ?? []),
        ...(row.email ? [row.email] : []),
    ].filter((value, index, all) => all.indexOf(value) === index)

    return {
        role: row.role,
        status: row.status,
        expiresAt: row.expiresAt,
        isExpired: row.expiresAt.getTime() <= Date.now(),
        isPrivate: emails.length > 0,
        email: row.email,
        emails,
        newAccount: row.newAccount,
        maxUses: row.maxUses,
        inviterName: row.shareInviterName ? row.inviterName : null,
    }
}
