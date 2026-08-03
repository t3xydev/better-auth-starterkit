<p align="center">
  <img src="docs/assets/banner.svg" alt="Better Auth StarterKit" width="100%" />
</p>

<p align="center">
  <strong>Your own OpenID / OAuth identity server, on Better Auth.</strong><br />
  Open, federated, decentralized — OIDC IdP · Nostr · wallets planned · extend the app or run accounts-style
</p>

<p align="center">
  <em>Fork of <a href="https://github.com/daveyplate/better-auth-nextjs-starter">daveyplate/better-auth-nextjs-starter</a> · by <a href="https://t3xy.dev">t3xy.dev</a></em>
</p>

<p align="center">
  <a href="https://betterauth-starterkit.t3xy.dev/"><img src="https://img.shields.io/badge/live%20demo-t3xy.dev-0B1220?style=flat-square" alt="Live demo" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/quick%20start-3%20commands-0d9488?style=flat-square" alt="Quick start" /></a>
  <a href="https://better-auth.com"><img src="https://img.shields.io/badge/Better%20Auth-1.6-black?style=flat-square" alt="Better Auth" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square" alt="Next.js" /></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle-PostgreSQL-C5F74F?style=flat-square" alt="Drizzle" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-slate?style=flat-square" alt="MIT" /></a>
</p>

<p align="center">
  <a href="https://betterauth-starterkit.t3xy.dev/"><strong>Live demo</strong></a> ·
  <a href="https://t3xy.dev">t3xy.dev</a> ·
  <a href="docs/product.md">Product</a> ·
  <a href="docs/getting-started.md">Getting started</a> ·
  <a href="docs/features.md">Features</a> ·
  <a href="docs/deployment.md">Deploy</a> ·
  <a href="docs/environment-variables.md">Env vars</a> ·
  <a href="docs/admin-panel.md">Admin panel</a>
</p>

---

## Why this exists

Most auth starters stop at “sign in works locally.” This kit is a **framework + starter** for shipping your **own identity / OpenID Connect server** — a shared issuer other apps authenticate against.

The direction is a more **open, federated, and decentralized** future: standards-based OAuth / OIDC you control, plus first-class paths for protocol and wallet identity (Nostr today; Bluesky, Bitcoin Connect, Lightning, ETH planned) instead of locking users into a single closed login silo.

You get Postgres + migrations, OIDC discovery, consent, an admin UI for OAuth clients, SMTP, branding via env vars, and a health check your host can probe. Clone it, set three variables, migrate, deploy.

**Two ways to use it:**

| Mode | What you do |
|---|---|
| **Extend the template** | Keep this Next.js app, build product UI here, run frontend + auth together |
| **Accounts-style IdP** | Deploy this as the accounts host; other apps are separate OAuth / OIDC clients |

**Live demo:** [https://betterauth-starterkit.t3xy.dev/](https://betterauth-starterkit.t3xy.dev/)

## What’s included

| Capability | Status |
|---|---|
| Email & password + verification / reset | Ready |
| **OAuth 2.1 / OpenID Connect provider** | Ready |
| Passkeys (WebAuthn) | Ready |
| Two-factor authentication (TOTP) | Ready |
| User invitations | Ready |
| Organizations (members, roles, invites) | Opt-in (`NEXT_PUBLIC_ORGANIZATIONS_ENABLED`) |
| Nostr sign-in + key linking | Ready |
| Bluesky (AT Proto) identity | Planned |
| Bitcoin Connect | Planned |
| Lightning | Planned |
| Ethereum (wallet / SIWE-style) | Planned |
| Billing (account-scoped) | Planned |
| Admin role + **OAuth client management UI** | Ready |
| OpenAPI docs for the auth API | Ready |
| SMTP email (or console fallback) | Ready |
| Branding & theme via environment variables | Ready |
| PostHog analytics (optional) | Ready |
| Health endpoint (`/api/health`) | Ready |
| Better Auth Dash / Sentinel / DevTools | Ready |

Full breakdown → [docs/features.md](docs/features.md) · product framing → [docs/product.md](docs/product.md)

## Stack

- [Better Auth](https://www.better-auth.com) + [Better Auth UI](https://better-auth-ui.com)
- [Next.js](https://nextjs.org) 15 (App Router) · [React](https://react.dev) 19
- [Drizzle ORM](https://orm.drizzle.team) · [PostgreSQL](https://www.postgresql.org)
- [shadcn/ui](https://ui.shadcn.com) · [Tailwind CSS](https://tailwindcss.com) 4 · [Biome](https://biomejs.dev)

## Quick start

**1. Clone & install**

```bash
git clone https://github.com/t3xydev/better-auth-starterkit.git
cd better-auth-starterkit
pnpm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

Set at least:

```bash
BETTER_AUTH_SECRET="$(openssl rand -hex 32)"
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:pass@localhost:5432/better_auth"
```

See [environment variables](docs/environment-variables.md) for SMTP, branding, OAuth, PostHog, and trusted origins.

**3. Sync the database & run**

```bash
pnpm db:sync   # generate schema → migrations → apply
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you’ll land on sign-in.

> First admin: sign up, then `UPDATE users SET role = 'admin' WHERE email = 'you@example.com';`  
> With `NEXT_PUBLIC_INVITE_ONLY=true`, the first user can still sign up to bootstrap; later sign-ups need an invite — [invitations](docs/invitations.md).  
> Details in [admin panel docs](docs/admin-panel.md).

## Deploy

Synced targets (Cloudflare Containers, Railway, Dokploy) live in [`deploy/config.ts`](deploy/config.ts). After edits:

```bash
pnpm deploy:sync
```

| Setting | Classic hosts (Render, Fly, …) | Containers (Railway / Dokploy / CF) |
|---|---|---|
| **Build** | `pnpm db:migrate && pnpm build` | Image: `pnpm build` |
| **Start** | `pnpm start` | `pnpm db:migrate && pnpm start` |

`DATABASE_URL` is required at **build** for classic migrate-during-build, or at **container start** for Docker targets. Platform notes → [docs/deployment.md](docs/deployment.md).

```mermaid
flowchart LR
  A[Clone] --> B[Set env]
  B --> C[pnpm db:sync]
  C --> D[pnpm dev]
  B --> E[Deploy]
  E --> F["migrate && build / container start"]
  F --> G[Auth server live]
```
## Project layout

```text
src/
├── app/                 # Next.js routes (auth UI, admin, OIDC discovery, MCP)
├── components/          # UI + admin OAuth client tools
├── database/            # Drizzle client + schema
└── lib/
    ├── auth.ts          # Better Auth server config (plugins live here)
    ├── auth-client.ts   # Browser client
    └── email.ts         # SMTP / console mailer
deploy/                  # Shared deploy config + sync (Railway / Dokploy / Cloudflare)
docs/                    # Guides you’re reading
migrations/              # Committed Drizzle SQL (required for deploys)
```
## Documentation

| Guide | Description |
|---|---|
| [Product](docs/product.md) | IdP framing, dual usage modes, planned identity + billing |
| [Getting started](docs/getting-started.md) | Local setup walkthrough |
| [Features](docs/features.md) | Plugins, endpoints, and what ships out of the box |
| [Deployment](docs/deployment.md) | Railway / Dokploy / Cloudflare sync + classic hosts |
| [Environment variables](docs/environment-variables.md) | Full env reference |
| [Admin panel](docs/admin-panel.md) | Manage OAuth clients |
| [Docs index](docs/README.md) | Everything in one place |

## Roadmap

Planned on the same account / IdP model (works in both usage modes):

- Bluesky (AT Proto) sign-in + linking  
- Bitcoin Connect, Lightning, and Ethereum wallet identity  
- Billing (subscriptions / payments scoped to the account)

Ideas and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/product.md](docs/product.md).
## Credits

Forked from [daveyplate/better-auth-nextjs-starter](https://github.com/daveyplate/better-auth-nextjs-starter).

Maintained at [t3xy.dev](https://t3xy.dev). Built on [Better Auth](https://www.better-auth.com).

## License

[MIT](LICENSE)
