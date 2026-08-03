import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [{ protocol: "https", hostname: "**" }]
    },
    transpilePackages: ["dbsc-toolkit", "@dbsc-toolkit/better-auth"]
}

export default withMDX(config)
