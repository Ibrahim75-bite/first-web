import path from "path";
import pool from "../../../core/database/db.js";
import withTransaction from "../../../core/database/transaction.js";
import defaultProductRepository from "../repositories/product.repository.js";
import defaultVariantRepository from "../repositories/variant.repository.js";
import defaultCache from "../../../core/common/cache.js";
import defaultStorageService from "../../../core/common/storage.js";
import defaultAuditLogger from "../../../core/common/audit.js";
import { generateUniqueSlug } from "../../../core/utils/slug.js";
import { NotFoundError, ValidationError } from "../../../core/common/error.js";
import config from "../../../config/index.js";

/**
 * Enterprise Product Domain Service (ARCH-01, ARCH-02, ARCH-03 remediated)
 */
export class ProductService {
    constructor({
        productRepo = defaultProductRepository,
        variantRepo = defaultVariantRepository,
        cacheService = defaultCache,
        storage = defaultStorageService,
        auditLog = defaultAuditLogger,
        dbPool = pool
    } = {}) {
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.cache = cacheService;
        this.storage = storage;
        this.auditLogger = auditLog;
        this.db = dbPool;
    }

    buildImageObject(imageName) {
        const imageUrl = `${config.baseUrl}/images/${imageName}`;
        const thumbName = `thumb_${path.parse(imageName).name}.webp`;
        const thumbnailUrl = `${config.baseUrl}/thumbnails/${thumbName}`;
        return {
            url: imageUrl,
            thumbnail: this.storage.exists(thumbName, "thumbnails") ? thumbnailUrl : null
        };
    }

    groupRowsIntoProduct(rows, lang) {
        if (!rows || rows.length === 0) return null;
        
        const first = rows[0];
        const product = {
            product_id: first.product_id,
            model_sku: first.model_sku,
            slug: first.product_slug || first.slug || null,
            weight: parseFloat(first.weight),
            height: parseFloat(first.height),
            name: first.name,
            material: first.material,
            description: first.description,
            meta_title: first.meta_title || null,
            meta_description: first.meta_description || null,
            variants: {},
            tags: {}
        };

        const imagesSeen = {};

        for (const row of rows) {
            if (row.tag_slug) {
                product.tags[row.tag_slug] = {
                    slug: row.tag_slug,
                    name: row.tag_name
                };
            }

            if (row.variant_id) {
                if (!product.variants[row.variant_id]) {
                    product.variants[row.variant_id] = {
                        variant_id: row.variant_id,
                        sku: row.sku,
                        color_code: row.color_code || null,
                        color: lang === "ar" ? row.color_name_ar : row.color_name_en,
                        min_order_qty: row.min_order_qty || 1,
                        images: []
                    };
                    imagesSeen[row.variant_id] = new Set();
                }

                if (row.image_name) {
                    const imgObj = this.buildImageObject(row.image_name);
                    if (!imagesSeen[row.variant_id].has(imgObj.url)) {
                        imagesSeen[row.variant_id].add(imgObj.url);
                        product.variants[row.variant_id].images.push(imgObj);
                    }
                }
            }
        }

        return {
            ...product,
            variants: Object.values(product.variants),
            tags: Object.values(product.tags)
        };
    }

    async getBySlug(slug, lang) {
        const cacheKey = `slug:${slug}:${lang}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const result = await this.productRepo.findBySlug(slug, lang, this.db);
        if (!result) {
            throw new NotFoundError(`Product with slug "${slug}" not found`);
        }

        const product = this.groupRowsIntoProduct(result.rows, result.language);
        this.cache.set(cacheKey, product);
        return product;
    }

    async getById(id, lang) {
        const rows = await this.productRepo.findById(id, lang, this.db);
        if (rows.length === 0) {
            throw new NotFoundError(`Product ${id} not found`);
        }
        return this.groupRowsIntoProduct(rows, lang);
    }

    async getAdminDetails(id) {
        const details = await this.productRepo.findAdminDetailsById(id, this.db);
        if (!details) {
            throw new NotFoundError(`Product ${id} not found`);
        }

        const imageMap = {};
        for (const img of details.images) {
            if (!imageMap[img.variant_id]) imageMap[img.variant_id] = [];
            imageMap[img.variant_id].push({
                id: img.id,
                image_name: img.image_name,
                display_order: img.display_order,
                ...this.buildImageObject(img.image_name)
            });
        }

        const translationMap = {};
        for (const t of details.translations) {
            translationMap[t.language_code] = t;
        }

        return {
            ...details.product,
            weight: parseFloat(details.product.weight),
            height: parseFloat(details.product.height),
            translations: translationMap,
            variants: details.variants.map(v => ({
                ...v,
                images: imageMap[v.id] || []
            })),
            tags: details.tags
        };
    }

    async list({ lang, search, tags, page, limit, featured }) {
        let effectiveTags = tags;
        if (featured) {
            effectiveTags = effectiveTags ? `${effectiveTags},featured` : "featured";
        }
        const tagList = effectiveTags ? effectiveTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : null;

        const cacheKey = `products:${lang}:${search}:${effectiveTags}:${page}:${limit}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const offset = (page - 1) * limit;
        
        let idRows = await this.productRepo.listIds({ lang, search, tagList, limit, offset }, this.db);
        let total = await this.productRepo.count({ lang, search, tagList }, this.db);

        if (idRows.length === 0 && search) {
            idRows = await this.productRepo.listFuzzyIds({ lang, search, limit, offset }, this.db);
        }

        if (idRows.length === 0) {
            const emptyResponse = { page, limit, total, totalPages: Math.ceil(total / limit), data: [] };
            this.cache.set(cacheKey, emptyResponse);
            return emptyResponse;
        }

        const productIds = idRows.map(r => r.id);
        const idOrderMap = {};
        productIds.forEach((id, idx) => { idOrderMap[id] = idx; });

        const rows = await this.productRepo.getFullProductsForIds(lang, productIds, this.db);
        
        const productsMap = {};
        for (const row of rows) {
            if (!productsMap[row.product_id]) {
                productsMap[row.product_id] = { rows: [] };
            }
            productsMap[row.product_id].rows.push(row);
        }

        const finalProducts = Object.values(productsMap)
            .map(({ rows: pRows }) => this.groupRowsIntoProduct(pRows, lang))
            .sort((a, b) => idOrderMap[a.product_id] - idOrderMap[b.product_id]);

        const response = { page, limit, total, totalPages: Math.ceil(total / limit), data: finalProducts };
        this.cache.set(cacheKey, response);
        return response;
    }

    async create(data, clientOverride = null) {
        const executeLogic = async (client) => {
            let product = await this.productRepo.findByModelCode(data.model_code, client);
            let productId;

            if (!product) {
                productId = await this.productRepo.insert({
                    model_code: data.model_code,
                    weight: data.weight,
                    height: data.height
                }, client);

                const slugEn = await generateUniqueSlug(client, data.name_en, "en");
                const slugAr = await generateUniqueSlug(client, data.name_ar, "ar");

                await this.productRepo.insertTranslations({
                    productId,
                    name_en: data.name_en,
                    material_en: data.material_en,
                    description_en: data.description_en,
                    name_ar: data.name_ar,
                    material_ar: data.material_ar,
                    description_ar: data.description_ar,
                    slugEn,
                    slugAr
                }, client);
            } else {
                productId = product.id;
            }

            const variantCheck = await this.variantRepo.findBySku(data.sku, client);

            if (!variantCheck) {
                const variantCount = await this.variantRepo.countByProductId(productId, client);
                if (variantCount >= 4) {
                    throw new ValidationError(`Product ${data.model_code} already has 4 variants (maximum reached)`);
                }

                await this.variantRepo.insert({
                    productId,
                    sku: data.sku,
                    color_en: data.color_en,
                    color_ar: data.color_ar
                }, client);
            }

            await this.auditLogger.logEvent("product.create", `Model SKU: ${data.sku}`, null, data);
            this.cache.clearProducts();
            return { message: "Product/Variant processed successfully", productId };
        };

        if (clientOverride) {
            return await executeLogic(clientOverride);
        }

        return await withTransaction(async (tx) => {
            return await executeLogic(tx.client);
        });
    }

    async update(id, data) {
        return await withTransaction(async (tx) => {
            const client = tx.client;
            const exists = await this.productRepo.checkExists(id, client);
            if (!exists) {
                throw new NotFoundError(`Product ${id} not found`);
            }

            await this.productRepo.update(id, {
                model_code: data.model_code,
                weight: data.weight,
                height: data.height
            }, client);

            if (
                data.name_en !== undefined ||
                data.material_en !== undefined ||
                data.description_en !== undefined ||
                data.meta_title_en !== undefined ||
                data.meta_description_en !== undefined
            ) {
                let slugEn = undefined;
                if (data.name_en !== undefined) {
                    slugEn = await generateUniqueSlug(client, data.name_en, "en");
                }
                await this.productRepo.updateTranslation(id, "en", {
                    name: data.name_en,
                    material: data.material_en,
                    description: data.description_en,
                    meta_title: data.meta_title_en,
                    meta_description: data.meta_description_en,
                    slug: slugEn
                }, client);
            }

            if (
                data.name_ar !== undefined ||
                data.material_ar !== undefined ||
                data.description_ar !== undefined ||
                data.meta_title_ar !== undefined ||
                data.meta_description_ar !== undefined
            ) {
                let slugAr = undefined;
                if (data.name_ar !== undefined) {
                    slugAr = await generateUniqueSlug(client, data.name_ar, "ar");
                }
                await this.productRepo.updateTranslation(id, "ar", {
                    name: data.name_ar,
                    material: data.material_ar,
                    description: data.description_ar,
                    meta_title: data.meta_title_ar,
                    meta_description: data.meta_description_ar,
                    slug: slugAr
                }, client);
            }

            await this.auditLogger.logEvent("product.update", `Product ID: ${id}`, null, data);
            this.cache.clearProducts();
            return { message: `Product ${id} updated successfully` };
        });
    }

    async delete(id) {
        return await withTransaction(async (tx) => {
            const client = tx.client;
            const images = await this.productRepo.getImagesForProduct(id, client);

            const deleted = await this.productRepo.delete(id, client);
            if (!deleted) {
                throw new NotFoundError(`Product ${id} not found`);
            }

            // Post-commit deferred execution queue (ARCH-02)
            tx.onCommit(async () => {
                for (const img of images) {
                    const imageName = img.image_name;
                    const thumbName = `thumb_${path.parse(imageName).name}.webp`;
                    await this.storage.delete(imageName, "uploads");
                    await this.storage.delete(thumbName, "thumbnails");
                }
            });

            await this.auditLogger.logEvent("product.delete", `Product ID: ${id}`, deleted, null);
            this.cache.clearProducts();
            return {
                message: `Product ${deleted.model_code} and all related data deleted`,
                deleted_images: images.length
            };
        });
    }
}

export const productService = new ProductService();
export default productService;
