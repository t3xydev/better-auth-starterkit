/**
 * Single source of truth for deployment targets.
 * Edit this file, then run `pnpm deploy:sync` to regenerate platform configs.
 */

export type CloudflareRuntime = "containers" | "workers"

export const deployConfig = {
    /** Service / image name used across platforms */
    name: "better-auth-starterkit",

    /** App listen port */
    port: 3000,

    /** Healthcheck path (Next.js route) */
    healthcheckPath: "/api/health",

    /** Image build (no database required) */
    buildCommand: "pnpm build",

    /** Apply committed Drizzle migrations */
    migrateCommand: "pnpm db:migrate",

    /** Process start after migrations (non-container hosts) */
    startCommand: "pnpm start",

    /**
     * Container entrypoint: migrate at runtime, then start.
     * DATABASE_URL is needed when the container starts, not when the image builds.
     */
    get containerStartCommand() {
        return `${this.migrateCommand} && ${this.startCommand}`
    },

    /** Required production env vars */
    requiredEnv: [
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL"
    ] as const,

    cloudflare: {
        /**
         * `containers` (default) — shared Dockerfile via Cloudflare Containers.
         * `workers` — OpenNext on Workers; needs @opennextjs/cloudflare + Hyperdrive.
         */
        runtime: "containers" as CloudflareRuntime,

        /** Worker entry for Containers mode */
        containerWorker: "deploy/cloudflare/container-worker.ts",

        /** Durable Object / Container class name */
        containerClassName: "AuthServerContainer"
    },

    dokploy: {
        /**
         * Replace with your public hostname before deploying Compose to Dokploy.
         * Used in Traefik Host() rules.
         */
        domain: "auth.example.com",

        /** Traefik router/service name prefix (must be unique on the host) */
        routerName: "better-auth-starterkit"
    }
} as const

export type DeployConfig = typeof deployConfig
