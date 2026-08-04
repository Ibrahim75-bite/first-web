import fs from "fs";
import crypto from "crypto";
import csv from "csv-parser";
import pool from "../../core/database/db.js";
import withTransaction from "../../core/database/transaction.js";
import defaultStorageService from "../../core/common/storage.js";
import defaultCache from "../../core/common/cache.js";
import defaultProductService from "../products/services/product.service.js";
import defaultVariantService from "../products/services/variant.service.js";
import defaultTagService from "../products/services/tag.service.js";
import defaultVariantRepository from "../products/repositories/variant.repository.js";
import defaultTagRepository from "../products/repositories/tag.repository.js";
import { processImage } from "../../core/utils/image.js";
import { secureFetch } from "../../core/common/ssrf.js";

const REQUIRED_FIELDS = {
    model_code: "Model Code",
    sku: "SKU",
    name_en: "Name (EN)",
    name_ar: "Name (AR)",
    material_en: "Material (EN)",
    material_ar: "Material (AR)",
    description_en: "Description (EN)",
    description_ar: "Description (AR)",
    color_en: "Color (EN)",
    color_ar: "Color (AR)"
};

const NUMERIC_FIELDS = {
    weight: "Weight",
    height: "Height"
};

/**
 * Enterprise Import Orchestration Service (ARCH-01, ARCH-03, ARCH-04 remediated)
 */
export class ImportService {
    constructor({
        productService = defaultProductService,
        variantService = defaultVariantService,
        tagService = defaultTagService,
        variantRepo = defaultVariantRepository,
        tagRepo = defaultTagRepository,
        storage = defaultStorageService,
        cacheService = defaultCache,
        dbPool = pool
    } = {}) {
        this.productService = productService;
        this.variantService = variantService;
        this.tagService = tagService;
        this.variantRepo = variantRepo;
        this.tagRepo = tagRepo;
        this.storage = storage;
        this.cache = cacheService;
        this.db = dbPool;
    }

    async parseCsv(filePath) {
        const results = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => results.push(row))
                .on("end", resolve)
                .on("error", reject);
        });
        return results;
    }

    validateRow(row, rowNum) {
        const missingFields = [];
        for (const [field, label] of Object.entries(REQUIRED_FIELDS)) {
            if (!row[field] || !row[field].trim()) {
                missingFields.push(label);
            }
        }
        for (const [field, label] of Object.entries(NUMERIC_FIELDS)) {
            if (row[field] === undefined || row[field] === "" || isNaN(row[field])) {
                missingFields.push(`${label} (must be numeric)`);
            }
        }
        return missingFields;
    }

    async importCsv(filePath) {
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        try {
            const results = await this.parseCsv(filePath);
            if (results.length === 0) {
                throw new Error("CSV file is empty or has no valid rows");
            }

            for (let i = 0; i < results.length; i++) {
                const row = results[i];
                const rowNum = i + 2;
                const sku = row.sku;

                const missingFields = this.validateRow(row, rowNum);
                if (missingFields.length > 0) {
                    errors.push({ row: rowNum, sku: sku || null, reason: `Missing/invalid: ${missingFields.join(", ")}` });
                    errorCount++;
                    continue;
                }

                try {
                    await withTransaction(async (tx) => {
                        const client = tx.client;

                        // 1. Delegate Product creation/lookup through ProductService (ARCH-04)
                        const createResult = await this.productService.create({
                            model_code: row.model_code,
                            weight: parseFloat(row.weight),
                            height: parseFloat(row.height),
                            name_en: row.name_en,
                            name_ar: row.name_ar,
                            material_en: row.material_en,
                            material_ar: row.material_ar,
                            description_en: row.description_en,
                            description_ar: row.description_ar,
                            sku: row.sku,
                            color_en: row.color_en,
                            color_ar: row.color_ar,
                            color_code: row.color_code || null
                        }, client);

                        const productId = createResult.productId;

                        // 2. Link Tags via TagRepository using transaction client (ARCH-01 & ARCH-04)
                        if (row.tags && row.tags.trim()) {
                            const tagSlugs = row.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
                            for (const tagSlug of tagSlugs) {
                                const tag = await this.tagRepo.findBySlug(tagSlug, client);
                                if (tag) {
                                    const alreadyLinked = await this.tagRepo.checkProductTagLink(productId, tag.id, client);
                                    if (!alreadyLinked) {
                                        await this.tagRepo.linkProductTag(productId, tag.id, client);
                                    }
                                }
                            }
                        }

                        // 3. Process Remote Media Assets safely inside transaction (ARCH-01 & SSRF Guarded)
                        const variant = await this.variantRepo.findBySku(row.sku, client);
                        if (variant && row.image_url && row.image_url.trim()) {
                            const imageUrls = row.image_url.split("|").map(u => u.trim()).filter(Boolean);
                            let displayOrder = 1;

                            for (const url of imageUrls) {
                                try {
                                    const fetched = await secureFetch(url);
                                    const contentType = fetched.contentType || "";
                                    let ext = ".jpg";
                                    if (contentType.includes("png")) ext = ".png";
                                    else if (contentType.includes("webp")) ext = ".webp";

                                    const imageName = `${crypto.randomUUID()}${ext}`;
                                    
                                    await this.storage.write(imageName, fetched.buffer, "uploads");
                                    await processImage(imageName);

                                    await this.variantRepo.insertImage(variant.id, imageName, displayOrder, client);
                                    displayOrder++;
                                } catch (fetchErr) {
                                    console.error(`Row ${rowNum}: Remote image fetch failure for ${url}:`, fetchErr.message);
                                }
                            }
                        }
                    });

                    successCount++;
                } catch (err) {
                    errors.push({ row: rowNum, sku: row.sku, reason: err.message });
                    errorCount++;
                }
            }

            this.cache.clearProducts();

            return {
                message: "Import completed",
                total: results.length,
                success: successCount,
                failed: errorCount,
                errors: errors.length > 0 ? errors : undefined
            };

        } finally {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (cleanupErr) {
                console.error("Failed to clean up temp CSV:", cleanupErr.message);
            }
        }
    }
}

export const importService = new ImportService();
export default importService;
