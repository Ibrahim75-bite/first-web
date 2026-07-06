import config from "../../config/index.js";
import { AppError } from "../common/error.js";

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    const isProduction = config.env === "production";

    // Standardize Express-Validator validation errors mapped to AppError structure
    if (err.array && typeof err.array === "function") {
        return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            details: err.array()
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    // Handle database specific constraints safely
    if (err.code === "23505") { // PG unique constraint violation
        return res.status(409).json({
            status: "fail",
            message: "A resource with this identifier already exists."
        });
    }

    console.error("UNHANDLED ERROR 💥:", err);

    return res.status(err.statusCode).json({
        status: err.status,
        message: isProduction ? "Internal server error" : err.message,
        ...(!isProduction && { stack: err.stack })
    });
};

export default errorHandler;
