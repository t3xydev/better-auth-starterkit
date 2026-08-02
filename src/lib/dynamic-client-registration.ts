/**
 * OAuth dynamic client registration (RFC 7591) flags.
 * Both default off; set to `"true"` to enable.
 * Unauthenticated registration allows public clients to register without a session (e.g. MCP).
 */
export const allowDynamicClientRegistration =
    process.env.ALLOW_DYNAMIC_CLIENT_REGISTRATION === "true"

export const allowUnauthenticatedClientRegistration =
    process.env.ALLOW_UNAUTHENTICATED_CLIENT_REGISTRATION === "true"
