import { body, validationResult } from "express-validator";
import { ValidationError } from "../../../core/common/error.js";

export const validateUpdateVariant = [
    body("sku").optional().matches(/^[a-zA-Z0-9-]+$/).withMessage("SKU must be alphanumeric with hyphens only").trim(),
    body("color_name_en").optional().trim().escape(),
    body("color_name_ar").optional().trim(),
    body("color_code").optional().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];

export const validateAddImage = [
    body("image_name").notEmpty().withMessage("image_name is required").trim(),
    body("display_order").optional().isInt({ min: 1 }).withMessage("display_order must be a positive integer").toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];
