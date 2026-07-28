# Features

Everything wired into this starter so you can deploy an auth **server**, not just a login form.

Configuration lives primarily in [`src/lib/auth.ts`](../src/lib/auth.ts) and [`src/lib/auth-client.ts`](../src/lib/auth-client.ts).

## Authentication methods

| Method | Plugin / config | Notes |
|---|---|---|
| Email & password | `emailAndPassword` | Sign-up verification + password reset via [email](../src/lib/email.ts) |
| Passkeys | `@better-auth/passkey` | WebAuthn; RP ID derived from `BETTER_AUTH_URL` |
| Two-factor (TOTP) | `twoFactor` | Challenge UI at `/auth/two-factor` |
| Nostr | `better-auth-nostr` + custom link plugin | Sign-in and account key linking (`/account/nostr`) |
| Invitations | `better-invite` | Admin create/list UI, email + public invites, `/activate-invite/[token]` accept flow — [guide](./invitations.md) |

## OAuth 2.1 / OpenID Connect provider

This app can act as an **authorization server** for your other apps.

| Piece | Location |
|---|---|
| Provider plugin | `@better-auth/oauth-provider` in `auth.ts` |
| Consent UI | `/consent` |
| OIDC discovery | `/.well-known/openid-configuration` |
| OAuth AS metadata | `/.well-known/oauth-authorization-server` |
| Protected resource metadata | `/.well-known/oauth-protected-resource` |
| Admin UI for clients | `/admin/clients` — [guide](./admin-panel.md) |

**Default scopes:** `openid`, `profile`, `email`, `offline_access`

Dynamic client registration is enabled for authenticated users; public unauthenticated registration is off by default.

### Common endpoints

Replace `{BASE}` with `BETTER_AUTH_URL`:

```text
Authorize   {BASE}/api/auth/oauth2/authorize
Token       {BASE}/api/auth/oauth2/token
Userinfo    {BASE}/api/auth/oauth2/userinfo
Discovery   {BASE}/.well-known/openid-configuration
```

JWT issuer defaults to `BETTER_AUTH_URL` (overridable with `OAUTH_ISSUER` / `OAUTH_AUDIENCE`).

## Admin & operations

| Feature | Details |
|---|---|
| Admin plugin | Roles (`admin` / `user`), ban fields |
| OAuth client panel | Create, edit, rotate secrets, disable, delete |
| Better Auth Dash | Infra dashboard plugin (`BETTER_AUTH_API_KEY`) |
| Sentinel | Bot / challenge protection (client auto-solve enabled) |
| OpenAPI | Interactive API reference via `openAPI()` plugin |
| DevTools | Floating panel in development for test users |
| Health check | `GET /api/health` — DB ping + latency |

## Sessions & security

- Sessions stored in the database with cookie cache (`jwe`, 5-minute max age)
- Trusted origins: `BETTER_AUTH_URL` plus optional `BETTER_AUTH_TRUSTED_ORIGINS`
- Forwarded IP headers for proxies (`x-forwarded-for`, `x-real-ip`)
- DBSC toolkit integration for device-bound session credentials

## Email

When all SMTP variables are set (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`), mail is sent over SMTP. Otherwise messages are logged to the console — convenient for local development.

Used for:

- Email verification  
- Password reset  
- Invitations  

## Branding & UX

Customize without code changes:

- `APPLICATION_NAME` — header, metadata, PWA, OG title  
- `NEXT_PUBLIC_PRIMARY_HUE` / `NEXT_PUBLIC_PRIMARY_CHROMA` — theme color  
- `FAVICON_URL`, `ICON_URL`, `LOGO_URL`, `OPENGRAPH_IMAGE_URL` — assets via CDN  
- Dark / light mode toggle  
- Optional GitHub header link (`NEXT_PUBLIC_HIDE_GITHUB`)

## Analytics

Set `NEXT_PUBLIC_POSTHOG_KEY` (and optionally `NEXT_PUBLIC_POSTHOG_HOST`) to enable PostHog pageviews and auth-related event tracking. Omit the key to disable analytics entirely.

## MCP

An MCP transport route is available at `/api/mcp/[transport]` for tooling integrations.

## Extending

1. Add or configure plugins in `src/lib/auth.ts` (and matching client plugins in `auth-client.ts`).  
2. Run `pnpm db:sync` locally.  
3. Commit schema + migration files.  
4. Deploy with `pnpm db:migrate && pnpm build`.

See [deployment.md](./deployment.md) and [getting-started.md](./getting-started.md).
