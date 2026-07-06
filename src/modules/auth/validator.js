import { body, validationResult } from "express-validator";
import { ValidationError } from "../../core/common/error.js";

export const validateLogin = [
    body("username").notEmpty().withMessage("Username is required").trim(),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ValidationError("Validation failed", errors.array()));
        }
        next();
    }
];
