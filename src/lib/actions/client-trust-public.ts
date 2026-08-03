"use server"

import { eq } from "drizzle-orm"
import { db } from "@/database/db"
import { oauthClients } from "@/database/schema"
import {
    TRUST_TIER_LABELS,
    getTrustTier,
    isUnverifiedClient,
    type TrustTier,
} from "@/lib/client-trust"

export type PublicClientTrust = {
    clientId: string
    name: string | null
    uri: string | null
    icon: string | null
    trustTier: TrustTier
    trustLabel: string
    unverified: boolean
}

/** Public display fields for consent / authorize UX (no secrets or private metadata). */
export async function getPublicClientTrust(
    clientId: string,
): Promise<PublicClientTrust | null> {
    if (!clientId) return null

    const rows = await db
        .select({
            clientId: oauthClients.clientId,
            name: oauthClients.name,
            uri: oauthClients.uri,
            icon: oauthClients.icon,
            disabled: oauthClients.disabled,
            metadata: oauthClients.metadata,
        })
        .from(oauthClients)
        .where(eq(oauthClients.clientId, clientId))
        .limit(1)

    const client = rows[0]
    if (!client || client.disabled) return null

    const trustTier = getTrustTier(client.metadata)
    return {
        clientId: client.clientId,
        name: client.name,
        uri: client.uri,
        icon: client.icon,
        trustTier,
        trustLabel: TRUST_TIER_LABELS[trustTier],
        unverified: isUnverifiedClient(trustTier),
    }
}
