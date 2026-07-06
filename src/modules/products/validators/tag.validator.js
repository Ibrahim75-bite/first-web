import { body, validationResult } from "express-validator";
import { ValidationError } from "../../../core/common/error.js";

export const validateCreateTag = [
    body("slug").notEmpty().withMessage("Slug is required").trim(),
    body("name_en").notEmpty().withMessage("English name is required").trim(),
    body("name_ar").notEmpty().withMessage("Arabic name is required").trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];

export const validateUpdateTag = [
    body("slug").optional().trim(),
    body("name_en").optional().trim(),
    body("name_ar").optional().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];

export const validateLinkTags = [
    body("tag_slugs").isArray({ min: 1 }).withMessage("tag_slugs must be a non-empty array"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];
