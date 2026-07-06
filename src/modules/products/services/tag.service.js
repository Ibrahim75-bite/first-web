import pool from "../../../core/database/db.js";
import tagRepository from "../repositories/tag.repository.js";
import productRepository from "../repositories/product.repository.js";
import cache from "../../../core/common/cache.js";
import { NotFoundError, ConflictError } from "../../../core/common/error.js";

export class TagService {
    async listAll(lang) {
        const rows = await tagRepository.listAll(lang);
        return rows.map(row => ({
            id: row.id,
            slug: row.slug,
            name: row.name || null
        }));
    }

    async create(data) {
        const { slug, name_en, name_ar } = data;
        const normalizedSlug = slug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const existing = await tagRepository.findBySlug(normalizedSlug);
            if (existing) {
                throw new ConflictError(`Tag with slug "${normalizedSlug}" already exists`);
            }

            const tagId = await tagRepository.insert(client, normalizedSlug);
            await tagRepository.insertTranslations(client, tagId, name_en, name_ar);

            await client.query("COMMIT");
            cache.clearProducts();

            return {
                id: tagId,
                slug: normalizedSlug,
                name_en,
                name_ar
            };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    async update(id, data) {
        const { slug, name_en, name_ar } = data;

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const existing = await tagRepository.findById(id);
            if (!existing) {
                throw new NotFoundError(`Tag ${id} not found`);
            }

            if (slug !== undefined) {
                const normalizedSlug = slug
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                await tagRepository.update(client, id, normalizedSlug);
            }

            if (name_en !== undefined) {
                await tagRepository.updateTranslation(client, id, "en", name_en);
            }

            if (name_ar !== undefined) {
                await tagRepository.updateTranslation(client, id, "ar", name_ar);
            }

            await client.query("COMMIT");
            cache.clearProducts();
            return { message: `Tag ${id} updated successfully` };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    async delete(id) {
        const deleted = await tagRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Tag ${id} not found`);
        }

        cache.clearProducts();
        return { message: `Tag "${deleted.slug}" deleted` };
    }

    async linkProduct(productId, tagSlugs) {
        const client = await pool.connect();
        try {
            const productCheck = await productRepository.checkExists(client, productId);
            if (!productCheck) {
                throw new NotFoundError(`Product ${productId} not found`);
            }

            const linked = [];
            const notFound = [];

            for (const slug of tagSlugs) {
                const tag = await tagRepository.findBySlug(slug.trim().toLowerCase());
                if (!tag) {
                    notFound.push(slug);
                    continue;
                }

                const alreadyLinked = await tagRepository.checkProductTagLink(productId, tag.id);
                if (!alreadyLinked) {
                    await tagRepository.linkProductTag(productId, tag.id);
                    linked.push(slug);
                }
            }

            cache.clearProducts();
            return {
                message: "Tags linked",
                linked,
                not_found: notFound.length > 0 ? notFound : undefined
            };
        } finally {
            client.release();
        }
    }

    async unlinkProduct(productId, tagId) {
        const unlinked = await tagRepository.unlinkProductTag(productId, tagId);
        if (!unlinked) {
            throw new NotFoundError("Tag link not found for this product");
        }

        cache.clearProducts();
        return { message: `Tag ${tagId} unlinked from product ${productId}` };
    }
}

export const tagService = new TagService();
export default tagService;
