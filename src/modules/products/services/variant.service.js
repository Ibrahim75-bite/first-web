import path from "path";
import pool from "../../../core/database/db.js";
import withTransaction from "../../../core/database/transaction.js";
import defaultVariantRepository from "../repositories/variant.repository.js";
import defaultCache from "../../../core/common/cache.js";
import defaultStorageService from "../../../core/common/storage.js";
import defaultAuditLogger from "../../../core/common/audit.js";
import { validateAndProcessImage } from "../../../core/utils/image.js";
import { NotFoundError, ValidationError } from "../../../core/common/error.js";
import config from "../../../config/index.js";

/**
 * Enterprise Variant Service (ARCH-01, ARCH-02, ARCH-03, F-BUG-01 remediated)
 */
export class VariantService {
    constructor({
        variantRepo = defaultVariantRepository,
        cacheService = defaultCache,
        storage = defaultStorageService,
        auditLog = defaultAuditLogger,
        dbPool = pool
    } = {}) {
        this.variantRepo = variantRepo;
        this.cache = cacheService;
        this.storage = storage;
        this.auditLogger = auditLog;
        this.db = dbPool;
    }

    async update(id, data) {
        const existing = await this.variantRepo.findById(id, this.db);
        if (!existing) {
            throw new NotFoundError(`Variant ${id} not found`);
        }

        await this.variantRepo.update(id, data, this.db);
        await this.auditLogger.logEvent("variant.update", `Variant ID: ${id}`, existing, data);
        
        this.cache.clearProducts();
        return { message: `Variant ${id} updated successfully` };
    }

    async delete(id) {
        return await withTransaction(async (tx) => {
            const client = tx.client;
            const images = await this.variantRepo.getImagesForVariant(id, client);
            const deleted = await this.variantRepo.delete(id, client);

            if (!deleted) {
                throw new NotFoundError(`Variant ${id} not found`);
            }

            // Post-commit hook (ARCH-02)
            tx.onCommit(async () => {
                for (const img of images) {
                    const imageName = img.image_name;
                    const thumbName = `thumb_${path.parse(imageName).name}.webp`;
                    await this.storage.delete(imageName, "uploads");
                    await this.storage.delete(thumbName, "thumbnails");
                }
            });

            await this.auditLogger.logEvent("variant.delete", `Variant SKU: ${deleted.sku}`, deleted, null);
            this.cache.clearProducts();
            return {
                message: `Variant ${deleted.sku} deleted`,
                deleted_images: images.length
            };
        });
    }

    async addImage(variantId, data) {
        const { image_name, display_order = 1 } = data;

        let thumbnailName = null;
        if (this.storage.exists(image_name, "uploads")) {
            thumbnailName = await validateAndProcessImage(image_name);
        }

        await this.variantRepo.insertImage(variantId, image_name, display_order, this.db);
        await this.auditLogger.logEvent("variant.image_add", `Variant ID: ${variantId}, Image: ${image_name}`);
        
        this.cache.clearProducts();

        return {
            message: "Image added successfully",
            image_url: `${config.baseUrl}/images/${image_name}`,
            thumbnail_url: thumbnailName
                ? `${config.baseUrl}/images/thumbnails/${thumbnailName}`
                : null
        };
    }

    async uploadImage(variantId, file, displayOrder = 1) {
        // Pre-validation before file processing (F-BUG-01 remediated)
        const variantCheck = await this.variantRepo.findById(variantId, this.db);
        if (!variantCheck) {
            if (file && file.filename) {
                await this.storage.delete(file.filename, "uploads");
            }
            throw new NotFoundError(`Variant ${variantId} not found`);
        }

        const imageName = file.filename;
        let thumbnailName = null;

        try {
            thumbnailName = await validateAndProcessImage(imageName);
            await this.variantRepo.insertImage(variantId, imageName, displayOrder, this.db);
            await this.auditLogger.logEvent("variant.image_upload", `Variant SKU: ${variantCheck.sku}, Image: ${imageName}`);
            
            this.cache.clearProducts();

            return {
                message: "Image uploaded successfully",
                image_name: imageName,
                image_url: `${config.baseUrl}/images/${imageName}`,
                thumbnail_url: thumbnailName
                    ? `${config.baseUrl}/images/thumbnails/${thumbnailName}`
                    : null,
                display_order: displayOrder
            };
        } catch (err) {
            // Clean up disk file on failure
            await this.storage.delete(imageName, "uploads");
            if (thumbnailName) {
                await this.storage.delete(thumbnailName, "thumbnails");
            }
            throw err;
        }
    }

    async deleteImage(id) {
        return await withTransaction(async (tx) => {
            const client = tx.client;
            const deleted = await this.variantRepo.deleteImage(id, client);
            if (!deleted) {
                throw new NotFoundError(`Image ${id} not found`);
            }

            const imageName = deleted.image_name;
            const thumbName = `thumb_${path.parse(imageName).name}.webp`;

            // Post-commit execution (ARCH-02)
            tx.onCommit(async () => {
                await this.storage.delete(imageName, "uploads");
                await this.storage.delete(thumbName, "thumbnails");
            });

            await this.auditLogger.logEvent("variant.image_delete", `Image ID: ${id}, Name: ${imageName}`);
            this.cache.clearProducts();
            return { message: `Image "${imageName}" deleted` };
        });
    }
}

export const variantService = new VariantService();
export default variantService;
