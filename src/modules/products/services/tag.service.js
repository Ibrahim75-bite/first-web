import pool from "../../../core/database/db.js";
import withTransaction from "../../../core/database/transaction.js";
import defaultTagRepository from "../repositories/tag.repository.js";
import defaultProductRepository from "../repositories/product.repository.js";
import defaultCache from "../../../core/common/cache.js";
import { NotFoundError, ConflictError } from "../../../core/common/error.js";

/**
 * Enterprise Tag Service (ARCH-01, ARCH-03, ARCH-05 remediated)
 */
export class TagService {
    constructor({
        tagRepo = defaultTagRepository,
        productRepo = defaultProductRepository,
        cacheService = defaultCache,
        dbPool = pool
    } = {}) {
        this.tagRepo = tagRepo;
        this.productRepo = productRepo;
        this.cache = cacheService;
        this.db = dbPool;
    }

    async listAll(lang) {
        const rows = await this.tagRepo.listAll(lang, this.db);
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

        return await withTransaction(async (tx) => {
            const client = tx.client;
            const existing = await this.tagRepo.findBySlug(normalizedSlug, client);
            if (existing) {
                throw new ConflictError(`Tag with slug "${normalizedSlug}" already exists`);
            }

            const tagId = await this.tagRepo.insert(normalizedSlug, client);
            await this.tagRepo.insertTranslations(tagId, name_en, name_ar, client);

            this.cache.clearProducts();
            return {
                id: tagId,
                slug: normalizedSlug,
                name_en,
                name_ar
            };
        });
    }

    async update(id, data) {
        const { slug, name_en, name_ar } = data;

        return await withTransaction(async (tx) => {
            const client = tx.client;
            const existing = await this.tagRepo.findById(id, client);
            if (!existing) {
                throw new NotFoundError(`Tag ${id} not found`);
            }

            if (slug !== undefined) {
                const normalizedSlug = slug
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                await this.tagRepo.update(id, normalizedSlug, client);
            }

            if (name_en !== undefined) {
                await this.tagRepo.updateTranslation(id, "en", name_en, client);
            }

            if (name_ar !== undefined) {
                await this.tagRepo.updateTranslation(id, "ar", name_ar, client);
            }

            this.cache.clearProducts();
            return { message: `Tag ${id} updated successfully` };
        });
    }

    async delete(id) {
        const deleted = await this.tagRepo.delete(id, this.db);
        if (!deleted) {
            throw new NotFoundError(`Tag ${id} not found`);
        }

        this.cache.clearProducts();
        return { message: `Tag "${deleted.slug}" deleted` };
    }

    async linkProduct(productId, tagSlugs) {
        return await withTransaction(async (tx) => {
            const client = tx.client;
            const productCheck = await this.productRepo.checkExists(productId, client);
            if (!productCheck) {
                throw new NotFoundError(`Product ${productId} not found`);
            }

            const linked = [];
            const notFound = [];

            for (const slug of tagSlugs) {
                const tag = await this.tagRepo.findBySlug(slug.trim().toLowerCase(), client);
                if (!tag) {
                    notFound.push(slug);
                    continue;
                }

                const alreadyLinked = await this.tagRepo.checkProductTagLink(productId, tag.id, client);
                if (!alreadyLinked) {
                    await this.tagRepo.linkProductTag(productId, tag.id, client);
                    linked.push(slug);
                }
            }

            this.cache.clearProducts();
            return {
                message: "Tags linked",
                linked,
                not_found: notFound.length > 0 ? notFound : undefined
            };
        });
    }

    async unlinkProduct(productId, tagId) {
        const unlinked = await this.tagRepo.unlinkProductTag(productId, tagId, this.db);
        if (!unlinked) {
            throw new NotFoundError("Tag link not found for this product");
        }

        this.cache.clearProducts();
        return { message: `Tag ${tagId} unlinked from product ${productId}` };
    }
}

export const tagService = new TagService();
export default tagService;
