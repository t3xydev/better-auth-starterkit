<p align="center">
  <img src="docs/assets/banner.svg" alt="Better Auth StarterKit" width="100%" />
</p>

<p align="center">
  <strong>Ship a production-ready Better Auth server in minutes.</strong><br />
  Email/password, OAuth 2.1 / OIDC provider, passkeys, 2FA, invites, Nostr, admin panel — all wired up.
</p>

<p align="center">
  <em>Fork of <a href="https://github.com/daveyplate/better-auth-nextjs-starter">daveyplate/better-auth-nextjs-starter</a> · by <a href="https://t3xy.dev">t3xy.dev</a></em>
</p>

<p align="center">
  <a href="https://betterauth-starterkit.up.railway.app/"><img src="https://img.shields.io/badge/live%20demo-Railway-0B1220?style=flat-square&logo=railway&logoColor=white" alt="Live demo" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/quick%20start-3%20commands-0d9488?style=flat-square" alt="Quick start" /></a>
  <a href="https://better-auth.com"><img src="https://img.shields.io/badge/Better%20Auth-1.6-black?style=flat-square" alt="Better Auth" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square" alt="Next.js" /></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle-PostgreSQL-C5F74F?style=flat-square" alt="Drizzle" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-slate?style=flat-square" alt="MIT" /></a>
</p>

<p align="center">
  <a href="https://betterauth-starterkit.up.railway.app/"><strong>Live demo</strong></a> ·
  <a href="https://t3xy.dev">t3xy.dev</a> ·
  <a href="docs/getting-started.md">Getting started</a> ·
  <a href="docs/features.md">Features</a> ·
  <a href="docs/deployment.md">Deploy</a> ·
  <a href="docs/environment-variables.md">Env vars</a> ·
  <a href="docs/admin-panel.md">Admin panel</a>
</p>

---

## Why this exists

Most auth starters stop at “sign in works locally.” This kit is built for **quick deploys** of a real auth **server**: Postgres + migrations, OIDC discovery, an admin UI for OAuth clients, SMTP, branding via env vars, and a health check your host can probe.

Clone it, set three variables, migrate, deploy. Extend the plugins as you grow.

**Live demo:** [https://betterauth-starterkit.up.railway.app/](https://betterauth-starterkit.up.railway.app/)

## What’s included

| Capability | Status |
|---|---|
| Email & password + verification / reset | Ready |
| **OAuth 2.1 / OpenID Connect provider** | Ready |
| Passkeys (WebAuthn) | Ready |
| Two-factor authentication (TOTP) | Ready |
| User invitations | Ready |
| Nostr sign-in + key linking | Ready |
| Admin role + **OAuth client management UI** | Ready |
| OpenAPI docs for the auth API | Ready |
| SMTP email (or console fallback) | Ready |
| Branding & theme via environment variables | Ready |
| PostHog analytics (optional) | Ready |
| Health endpoint (`/api/health`) | Ready |
| Better Auth Dash / Sentinel / DevTools | Ready |

Full breakdown → [docs/features.md](docs/features.md)

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
> Details in [admin panel docs](docs/admin-panel.md).

## Deploy in one build command

On Render, Railway, Fly, and similar hosts:

| Setting | Value |
|---|---|
| **Build** | `pnpm db:migrate && pnpm build` |
| **Start** | `pnpm start` |

`DATABASE_URL` must be available at **build time** so migrations can run. Platform notes and troubleshooting → [docs/deployment.md](docs/deployment.md).

```mermaid
flowchart LR
  A[Clone] --> B[Set env]
  B --> C[pnpm db:sync]
  C --> D[pnpm dev]
  B --> E[Deploy]
  E --> F["migrate && build"]
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
docs/                    # Guides you’re reading
migrations/              # Committed Drizzle SQL (required for deploys)
```

## Documentation

| Guide | Description |
|---|---|
| [Getting started](docs/getting-started.md) | Local setup walkthrough |
| [Features](docs/features.md) | Plugins, endpoints, and what ships out of the box |
| [Deployment](docs/deployment.md) | Build/start commands per platform |
| [Environment variables](docs/environment-variables.md) | Full env reference |
| [Admin panel](docs/admin-panel.md) | Manage OAuth clients |
| [Docs index](docs/README.md) | Everything in one place |

## Roadmap

More deploy helpers and features are coming. Ideas and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Forked from [daveyplate/better-auth-nextjs-starter](https://github.com/daveyplate/better-auth-nextjs-starter).

Maintained at [t3xy.dev](https://t3xy.dev). Built on [Better Auth](https://www.better-auth.com).

## License

[MIT](LICENSE)
