import fs from "fs";
import path from "path";
import csv from "csv-parser";
import pool from "../../core/database/db.js";
import storageService from "../../core/common/storage.js";
import cache from "../../core/common/cache.js";
import { generateUniqueSlug } from "../../core/utils/slug.js";
import { processImage } from "../../core/utils/image.js";
import productRepository from "../products/repositories/product.repository.js";
import variantRepository from "../products/repositories/variant.repository.js";
import tagRepository from "../products/repositories/tag.repository.js";
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

export class ImportService {
    async importCsv(filePath) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        try {
            // Parse CSV into memory
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row) => results.push(row))
                    .on("end", resolve)
                    .on("error", reject);
            });

            if (results.length === 0) {
                throw new Error("CSV file is empty or has no valid rows");
            }

            // Process each row
            for (let i = 0; i < results.length; i++) {
                const row = results[i];
                const rowNum = i + 2; // +2 for header row + 0-index
                const sku = row.sku;

                // Validate row fields
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

                if (missingFields.length > 0) {
                    const reason = `Missing/invalid: ${missingFields.join(", ")}`;
                    errors.push({ row: rowNum, sku: sku || null, reason });
                    errorCount++;
                    continue;
                }

                const client = await pool.connect();
                try {
                    await client.query("BEGIN");

                    // 1. Product (upsert by model_code)
                    let product = await productRepository.findByModelCode(client, row.model_code);
                    let productId;
                    let isNewProduct = false;

                    if (!product) {
                        isNewProduct = true;
                        productId = await productRepository.insert(client, {
                            model_code: row.model_code,
                            weight: parseFloat(row.weight),
                            height: parseFloat(row.height)
                        });

                        const slugEn = await generateUniqueSlug(client, row.name_en, "en");
                        const slugAr = await generateUniqueSlug(client, row.name_ar, "ar");

                        await productRepository.insertTranslations(client, {
                            productId,
                            name_en: row.name_en,
                            material_en: row.material_en,
                            description_en: row.description_en,
                            name_ar: row.name_ar,
                            material_ar: row.material_ar,
                            description_ar: row.description_ar,
                            slugEn,
                            slugAr
                        });
                    } else {
                        productId = product.id;
                    }

                    // 2. Tags (link by slug, only for new products)
                    if (row.tags && row.tags.trim() && isNewProduct) {
                        const tagSlugs = row.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);

                        for (const tagSlug of tagSlugs) {
                            const tag = await tagRepository.findBySlug(tagSlug);
                            if (tag) {
                                const alreadyLinked = await tagRepository.checkProductTagLink(productId, tag.id);
                                if (!alreadyLinked) {
                                    await tagRepository.linkProductTag(productId, tag.id);
                                }
                            }
                        }
                    }

                    // 3. Variant (skip if SKU already exists)
                    const variantCheck = await variantRepository.findBySku(client, row.sku);

                    if (!variantCheck) {
                        const variantId = await variantRepository.insert(client, {
                            productId,
                            sku: row.sku,
                            color_en: row.color_en,
                            color_ar: row.color_ar,
                            color_code: row.color_code || null
                        });

                        // 4. Download + process images from pipe-separated image URLs
                        if (row.image_url && row.image_url.trim()) {
                            try {
                                const imageUrls = row.image_url.split("|").map(u => u.trim()).filter(Boolean);
                                let displayOrder = 1;

                                for (const url of imageUrls) {
                                    try {
                                        const fetched = await secureFetch(url);
                                        const contentType = fetched.contentType || "";
                                        let ext = ".jpg";
                                        if (contentType.includes("png")) ext = ".png";
                                        else if (contentType.includes("webp")) ext = ".webp";

                                        const imageName = `${row.sku}-${displayOrder}-${Date.now()}${ext}`;
                                        
                                        await storageService.write(imageName, fetched.buffer, "uploads");
                                        await processImage(imageName);

                                        await variantRepository.insertImage(variantId, imageName, displayOrder);
                                        displayOrder++;
                                    } catch (fetchErr) {
                                        console.error(`Row ${rowNum}: SSRF/Download block for image ${url}:`, fetchErr.message);
                                    }
                                }
                            } catch (imgErr) {
                                console.error(`Row ${rowNum}: Image processing failed for ${row.sku}:`, imgErr.message);
                            }
                        }
                    }

                    await client.query("COMMIT");
                    successCount++;
                } catch (err) {
                    await client.query("ROLLBACK");
                    errors.push({ row: rowNum, sku: row.sku, reason: err.message });
                    errorCount++;
                } finally {
                    client.release();
                }
            }

            cache.clearProducts();

            return {
                message: "Import completed",
                total: results.length,
                success: successCount,
                failed: errorCount,
                errors: errors.length > 0 ? errors : undefined
            };

        } finally {
            // Clean up temp CSV file
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
