# Documentation

Guides for running and extending **Better Auth StarterKit** — your own Better Auth–based OpenID / OAuth **identity server** on Next.js + PostgreSQL.

This kit is a fork of [daveyplate/better-auth-nextjs-starter](https://github.com/daveyplate/better-auth-nextjs-starter). Maintained at [t3xy.dev](https://t3xy.dev). See [Credits](../README.md#credits) in the README.

**Live demo:** [https://betterauth-starterkit.t3xy.dev/](https://betterauth-starterkit.t3xy.dev/)

## Start here

1. [Product](./product.md) — IdP framing, dual usage modes, roadmap identity methods  
2. [Getting started](./getting-started.md) — install, env, migrate, run locally  
3. [Features](./features.md) — what ships out of the box  
4. [Deployment](./deployment.md) — synced targets (Railway, Dokploy, Cloudflare) + classic hosts  

## Reference

| Doc | When you need it |
|---|---|
| [Product](./product.md) | What this kit is for (accounts-style IdP vs extend template) |
| [Environment variables](./environment-variables.md) | Configuring secrets, SMTP, branding, analytics |
| [Admin panel](./admin-panel.md) | Creating and managing OAuth / OIDC clients |
| [Client trust model](./client-trust-model.md) | Trust tiers, DCR defaults, scope gating |
| [Invitations](./invitations.md) | better-invite setup, activate UI, admin invites |
| [TypeScript: better-invite](./typescript-better-invite.md) | Plugin type shim used in this repo |

## Useful paths

| Path | Purpose |
|---|---|
| `/auth/sign-in` | Sign-in UI |
| `/account/*` | Account settings (Better Auth UI) |
| `/admin/clients` | OAuth client admin (admin role required) |
| `/admin/invites` | Create and manage user invites (admin role required) |
| `/invite/activate/[token]` | Invite welcome page; accept or reject |
| `/api/auth/*` | Better Auth API |
| `/api/health` | Liveness + DB connectivity |
| `/.well-known/openid-configuration` | OIDC discovery |
| `/api/auth/reference` | OpenAPI reference (openAPI plugin) |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
