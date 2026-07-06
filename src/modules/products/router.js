import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import config from "../../config/index.js";
import authMiddleware from "../../core/middleware/auth.js";
import productController from "./controllers/product.controller.js";
import variantController from "./controllers/variant.controller.js";
import tagController from "./controllers/tag.controller.js";
import { validateCreateProduct, validateUpdateProduct } from "./validators/product.validator.js";
import { validateUpdateVariant, validateAddImage } from "./validators/variant.validator.js";
import { validateCreateTag, validateUpdateTag, validateLinkTags } from "./validators/tag.validator.js";
import { uploadLimiter, searchLimiter } from "../../core/middleware/rateLimiter.js";

const router = express.Router();

// =========================
// Multer Configuration for Product Images
// =========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, config.storage.uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // Generate random UUID to completely mitigate Path Traversal and Command Injection risks
        const uniqueName = `${crypto.randomUUID()}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP are allowed.`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware helper to handle multer errors gracefully
const handleMulterUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ error: "File too large. Maximum size is 5MB" });
            }
            return res.status(400).json({ error: err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// =============================================================================
// ROUTES DEFINITION
// =============================================================================

// --- Tags Management ---
router.get("/tags", tagController.list);
router.post("/tags", authMiddleware, validateCreateTag, tagController.create);
router.put("/tags/:id", authMiddleware, validateUpdateTag, tagController.update);
router.delete("/tags/:id", authMiddleware, tagController.delete);

// --- Product-Tag Linking ---
router.post("/:id/tags", authMiddleware, validateLinkTags, tagController.linkProduct);
router.delete("/:id/tags/:tagId", authMiddleware, tagController.unlinkProduct);

// --- Variants CRUD & Images ---
router.put("/variants/:id", authMiddleware, validateUpdateVariant, variantController.update);
router.delete("/variants/:id", authMiddleware, variantController.delete);

router.post("/variants/:variantId/images", authMiddleware, validateAddImage, variantController.addImage);
router.post("/variants/:variantId/images/upload", authMiddleware, uploadLimiter, handleMulterUpload, variantController.uploadImage);
router.delete("/images/:id", authMiddleware, variantController.deleteImage);

// --- Products CRUD ---
router.get("/slug/:slug", searchLimiter, productController.getBySlug);
router.get("/:id/admin", authMiddleware, productController.getAdminDetails);
router.get("/:id", productController.getById);
router.get("/", searchLimiter, productController.list);
router.post("/", authMiddleware, validateCreateProduct, productController.create);
router.put("/:id", authMiddleware, validateUpdateProduct, productController.update);
router.delete("/:id", authMiddleware, productController.delete);

export default router;
