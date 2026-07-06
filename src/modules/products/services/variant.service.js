import variantRepository from "../repositories/variant.repository.js";
import cache from "../../../core/common/cache.js";
import storageService from "../../../core/common/storage.js";
import { validateAndProcessImage } from "../../../core/utils/image.js";
import { NotFoundError, ValidationError } from "../../../core/common/error.js";
import auditLogger from "../../../core/common/audit.js";
import path from "path";
import config from "../../../config/index.js";

export class VariantService {
    async update(id, data) {
        const existing = await variantRepository.findById(id);
        if (!existing) {
            throw new NotFoundError(`Variant ${id} not found`);
        }

        await variantRepository.update(id, data);
        await auditLogger.logEvent("variant.update", `Variant ID: ${id}`, existing, data);
        
        cache.clearProducts();
        return { message: `Variant ${id} updated successfully` };
    }

    async delete(id) {
        const images = await variantRepository.getImagesForVariant(id);
        const deleted = await variantRepository.delete(id);

        if (!deleted) {
            throw new NotFoundError(`Variant ${id} not found`);
        }

        // Clean up image files
        for (const img of images) {
            const imageName = img.image_name;
            const thumbName = `thumb_${path.parse(imageName).name}.webp`;
            await storageService.delete(imageName, "uploads");
            await storageService.delete(thumbName, "thumbnails");
        }

        await auditLogger.logEvent("variant.delete", `Variant SKU: ${deleted.sku}`, deleted, null);

        cache.clearProducts();
        return {
            message: `Variant ${deleted.sku} deleted`,
            deleted_images: images.length
        };
    }

    async addImage(variantId, data) {
        const { image_name, display_order = 1 } = data;

        // Generate thumbnail if file exists on disk
        let thumbnailName = null;
        if (storageService.exists(image_name, "uploads")) {
            thumbnailName = await validateAndProcessImage(image_name);
        }

        await variantRepository.insertImage(variantId, image_name, display_order);
        await auditLogger.logEvent("variant.image_add", `Variant ID: ${variantId}, Image: ${image_name}`);
        
        cache.clearProducts();

        return {
            message: "Image added successfully",
            image_url: `${config.baseUrl}/images/${image_name}`,
            thumbnail_url: thumbnailName
                ? `${config.baseUrl}/images/thumbnails/${thumbnailName}`
                : null
        };
    }

    async uploadImage(variantId, file, displayOrder = 1) {
        const variantCheck = await variantRepository.findById(variantId);
        if (!variantCheck) {
            // Clean up uploaded file
            await storageService.delete(file.filename, "uploads");
            throw new NotFoundError(`Variant ${variantId} not found`);
        }

        const imageName = file.filename;
        const thumbnailName = await validateAndProcessImage(imageName);

        await variantRepository.insertImage(variantId, imageName, displayOrder);
        await auditLogger.logEvent("variant.image_upload", `Variant SKU: ${variantCheck.sku}, Image: ${imageName}`);
        
        cache.clearProducts();

        return {
            message: "Image uploaded successfully",
            image_name: imageName,
            image_url: `${config.baseUrl}/images/${imageName}`,
            thumbnail_url: thumbnailName
                ? `${config.baseUrl}/images/thumbnails/${thumbnailName}`
                : null,
            display_order: displayOrder
        };
    }

    async deleteImage(id) {
        const deleted = await variantRepository.deleteImage(id);
        if (!deleted) {
            throw new NotFoundError(`Image ${id} not found`);
        }

        const imageName = deleted.image_name;
        const thumbName = `thumb_${path.parse(imageName).name}.webp`;

        await storageService.delete(imageName, "uploads");
        await storageService.delete(thumbName, "thumbnails");

        await auditLogger.logEvent("variant.image_delete", `Image ID: ${id}, Name: ${imageName}`);

        cache.clearProducts();
        return { message: `Image "${imageName}" deleted` };
    }
}

export const variantService = new VariantService();
export default variantService;
