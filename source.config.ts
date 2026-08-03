import {
    defineConfig,
    defineDocs,
    frontmatterSchema,
    metaSchema
} from "fumadocs-mdx/config"

export const docs = defineDocs({
    dir: "docs/framework",
    docs: {
        schema: frontmatterSchema
    },
    meta: {
        schema: metaSchema
    }
})

export default defineConfig()
