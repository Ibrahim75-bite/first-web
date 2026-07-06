import { body, validationResult } from "express-validator";
import { ValidationError } from "../../../core/common/error.js";

export const validateCreateProduct = [
    body("model_code").notEmpty().withMessage("Model code is required").trim(),
    body("sku")
        .notEmpty().withMessage("SKU is required")
        .matches(/^[a-zA-Z0-9-]+$/).withMessage("SKU must be alphanumeric with hyphens only")
        .trim(),
    body("name_en").notEmpty().withMessage("English name is required").trim().escape(),
    body("name_ar").notEmpty().withMessage("Arabic name is required").trim(),
    body("material_en").notEmpty().withMessage("English material is required").trim().escape(),
    body("material_ar").notEmpty().withMessage("Arabic material is required").trim(),
    body("description_en").notEmpty().withMessage("English description is required").trim(),
    body("description_ar").notEmpty().withMessage("Arabic description is required").trim(),
    body("color_en").notEmpty().withMessage("English color is required").trim().escape(),
    body("color_ar").notEmpty().withMessage("Arabic color is required").trim(),
    body("weight").isFloat({ min: 0.01 }).withMessage("Weight must be a positive number").toFloat(),
    body("height").isFloat({ min: 0.01 }).withMessage("Height must be a positive number").toFloat(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];

export const validateUpdateProduct = [
    body("model_code").optional().trim(),
    body("name_en").optional().trim().escape(),
    body("name_ar").optional().trim(),
    body("material_en").optional().trim().escape(),
    body("material_ar").optional().trim(),
    body("description_en").optional().trim(),
    body("description_ar").optional().trim(),
    body("weight").optional().isFloat({ min: 0.01 }).withMessage("Weight must be a positive number").toFloat(),
    body("height").optional().isFloat({ min: 0.01 }).withMessage("Height must be a positive number").toFloat(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];
