import sharp from "sharp";
import path from "path";
import fs from "fs";
import storageService from "../common/storage.js";
import { ValidationError } from "../common/error.js";

const MAX_DIMENSION = 4096; // 4K max resolution to prevent decompression bombs

export async function validateAndProcessImage(imageName) {
    const inputPath = storageService.getLocalPath(imageName, "uploads");
    const thumbName = `thumb_${path.parse(imageName).name}.webp`;
    const thumbPath = storageService.getLocalPath(thumbName, "thumbnails");

    try {
        // Read metadata to check dimensions and type (Magic Byte Verification)
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const allowedFormats = ["jpeg", "png", "webp"];
        if (!allowedFormats.includes(metadata.format)) {
            throw new ValidationError(`Unsupported image format: ${metadata.format}`);
        }

        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            throw new ValidationError(
                `Image dimensions exceed maximum allowed size of ${MAX_DIMENSION}x${MAX_DIMENSION} pixels`
            );
        }

        // Standardize and sanitize the main uploaded image by re-encoding
        // and stripping all EXIF/metadata headers (Secure by Default)
        const tempSanitizedPath = `${inputPath}.sanitized`;
        
        await sharp(inputPath)
            .rotate() // Auto-rotate based on EXIF orientation before stripping it
            .keepMetadata(false) // Strip all metadata headers (EXIF, GPS, etc.)
            .toFile(tempSanitizedPath);

        // Replace original upload with the fully sanitized version
        fs.renameSync(tempSanitizedPath, inputPath);

        // Generate thumbnail
        await sharp(inputPath)
            .resize(300, 300, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(thumbPath);

        return thumbName;
    } catch (err) {
        // Clean up the invalid file to prevent executable payloads on disk
        try {
            if (fs.existsSync(inputPath)) {
                fs.unlinkSync(inputPath);
            }
        } catch (cleanupErr) {
            console.error("Failed to clean up malicious image upload:", cleanupErr.message);
        }
        throw err;
    }
}

// Backward compatibility wrapper
export async function processImage(imageName) {
    try {
        return await validateAndProcessImage(imageName);
    } catch (err) {
        console.error(`Error in processImage fallback for ${imageName}:`, err.message);
        return null;
    }
}
