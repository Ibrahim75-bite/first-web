import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts, please try again later" }
});

export const uploadLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 uploads per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Upload rate limit exceeded, please wait before uploading more files" }
});

export const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit searches to 30 per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Search rate limit exceeded, please slow down" }
});

export const inquiryLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit to 5 inquiries per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many inquiries submitted from this IP, please try again later" }
});
