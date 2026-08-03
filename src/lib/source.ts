import { docs } from "@/.source"
import { loader } from "fumadocs-core/source"

const generated = docs.toFumadocsSource()

// fumadocs-mdx 11.10 types `files` as an array but runtime returns a thunk.
const files = (
    generated as unknown as { files: () => (typeof generated)["files"] }
).files()

export const source = loader({
    baseUrl: "/docs/framework",
    source: { files } as typeof generated
})
