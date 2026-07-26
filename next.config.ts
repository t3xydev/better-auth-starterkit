import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ protocol: "https", hostname: "**" }]
    },
    transpilePackages: ["dbsc-toolkit", "@dbsc-toolkit/better-auth"],
}

export default nextConfig
