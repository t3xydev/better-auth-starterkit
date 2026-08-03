---
name: deploy-targets
description: >-
  Syncs Railway, Dokploy, and Cloudflare deploy configs from deploy/config.ts.
  Use when adding or changing deploy targets, running deploy:sync, editing
  Dockerfile/railway.toml/docker-compose/wrangler, or switching Cloudflare
  Containers vs Workers/OpenNext.
---

# Deploy targets

## Rules

1. **Edit** [`deploy/config.ts`](../../../deploy/config.ts) only — never hand-edit generated files.
2. After config changes, run **`pnpm deploy:sync`**.
3. Point users to [`docs/deployment.md`](../../../docs/deployment.md) for platform UI steps.

Generated (do not hand-edit): `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `railway.toml`, `wrangler.jsonc`, and `open-next.config.ts` (Workers mode only).

## Target map

| Platform | Artifacts | How to deploy |
|----------|-----------|----------------|
| Railway | `railway.toml` + `Dockerfile` | Link repo; set env; deploy |
| Dokploy | `docker-compose.yml` + `Dockerfile` | Compose path `./docker-compose.yml`; set `dokploy.domain` first |
| Cloudflare Containers (default) | `wrangler.jsonc` + `Dockerfile` + `deploy/cloudflare/container-worker.ts` | `pnpm add -D wrangler @cloudflare/containers` then `pnpm cf:deploy` |
| Cloudflare Workers | OpenNext `wrangler.jsonc` + `open-next.config.ts` | Set `cloudflare.runtime: "workers"`, sync, install OpenNext deps |

## Config knobs

- `port`, `healthcheckPath`, `buildCommand`, `migrateCommand`, `startCommand`
- `containerStartCommand` — migrate then start (containers need `DATABASE_URL` at **start**)
- `requiredEnv` — `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `cloudflare.runtime` — `"containers"` (default) or `"workers"`
- `dokploy.domain` / `dokploy.routerName` — Traefik Host rule

## Cloudflare switch

**Containers → Workers**

1. Set `cloudflare.runtime: "workers"` in `deploy/config.ts`
2. `pnpm deploy:sync`
3. `pnpm add -D wrangler @opennextjs/cloudflare`
4. Document Hyperdrive for Postgres — app DB code is not Hyperdrive-wired yet

**Workers → Containers**

1. Set `cloudflare.runtime: "containers"`
2. `pnpm deploy:sync`

## Classic hosts

Render / Fly / similar (no Docker): `pnpm db:migrate && pnpm build` then `pnpm start`. Schema changes still use local `pnpm db:sync` before deploy.
