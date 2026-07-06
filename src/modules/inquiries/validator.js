import { body, validationResult } from "express-validator";
import { ValidationError } from "../../core/common/error.js";

export const validateInquiry = [
    body("customer_name").notEmpty().withMessage("Name is required").trim(),
    body("customer_email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("customer_phone").optional().trim(),
    body("customer_company").optional().trim(),
    body("message").optional().trim(),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.sku").notEmpty().withMessage("Each item must have a SKU"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];

export const validateInquiryStatus = [
    body("status").isIn(["new", "contacted", "quoted", "closed"]).withMessage("Status must be: new, contacted, quoted, or closed"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];
