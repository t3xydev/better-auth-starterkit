import { toNextJsHandler } from "better-auth/next-js"
import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { oauthClients } from "@/database/schema"
import {
    PUBLIC_SCOPES,
    unknownClientMetadata,
} from "@/lib/client-trust"

const PUBLIC_SCOPE_SET = new Set<string>(PUBLIC_SCOPES)

function isValidRedirectUri(uri: string): boolean {
    try {
        const parsed = new URL(uri)
        if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") return true
        return parsed.protocol === "https:"
    } catch {
        return false
    }
}

const { POST: _POST, GET } = toNextJsHandler(auth)

async function stampUnknownClient(clientId: string) {
    await db
        .update(oauthClients)
        .set({
            metadata: unknownClientMetadata(),
            skipConsent: false,
            requirePKCE: true,
            updatedAt: new Date(),
        })
        .where(eq(oauthClients.clientId, clientId))
}

async function POST(request: NextRequest) {
    const url = new URL(request.url)
    const isRegistration = url.pathname.endsWith("/register")

    if (isRegistration) {
        const cloned = request.clone()
        try {
            const body = await cloned.json()

            const uris: unknown[] = body.redirect_uris ?? body.redirectUris ?? []
            for (const uri of uris) {
                if (typeof uri !== "string" || !isValidRedirectUri(uri)) {
                    return NextResponse.json(
                        {
                            error: "invalid_redirect_uri",
                            error_description:
                                "Redirect URIs must use HTTPS (except localhost)",
                        },
                        { status: 400 },
                    )
                }
            }

            if (body.require_pkce === false || body.requirePKCE === false) {
                return NextResponse.json(
                    {
                        error: "invalid_client_metadata",
                        error_description: "PKCE is required and cannot be disabled",
                    },
                    { status: 400 },
                )
            }

            const grantTypes: unknown[] = body.grant_types ?? body.grantTypes ?? []
            if (grantTypes.includes("client_credentials")) {
                return NextResponse.json(
                    {
                        error: "invalid_client_metadata",
                        error_description:
                            "client_credentials is not allowed for dynamically registered clients",
                    },
                    { status: 400 },
                )
            }

            if (body.skip_consent === true || body.skipConsent === true) {
                return NextResponse.json(
                    {
                        error: "invalid_client_metadata",
                        error_description: "skip_consent cannot be set during dynamic client registration",
                    },
                    { status: 400 },
                )
            }

            if (body.metadata != null) {
                return NextResponse.json(
                    {
                        error: "invalid_client_metadata",
                        error_description: "Private metadata cannot be set during dynamic client registration",
                    },
                    { status: 400 },
                )
            }

            const scopeRaw: unknown = body.scope
            if (typeof scopeRaw === "string" && scopeRaw.trim()) {
                for (const scope of scopeRaw.split(/\s+/).filter(Boolean)) {
                    if (!PUBLIC_SCOPE_SET.has(scope)) {
                        return NextResponse.json(
                            {
                                error: "invalid_scope",
                                error_description: `cannot request scope ${scope}`,
                            },
                            { status: 400 },
                        )
                    }
                }
            }
        } catch {
            return NextResponse.json(
                { error: "invalid_request", error_description: "Malformed request body" },
                { status: 400 },
            )
        }

        const response = await _POST(request)
        if (response.ok) {
            try {
                const payload = (await response.clone().json()) as {
                    client_id?: string
                }
                if (payload.client_id) {
                    await stampUnknownClient(payload.client_id)
                }
            } catch {
                // Registration succeeded; metadata stamp is best-effort.
            }
        }
        return response
    }

    return _POST(request)
}

export { POST, GET }
