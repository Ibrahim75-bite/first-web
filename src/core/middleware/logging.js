import { getRequestContext } from "../common/context.js";

const SENSITIVE_KEYS = ["password", "token", "refreshtoken", "authorization", "secret", "creditcard", "cvv"];

export function maskSensitiveData(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(maskSensitiveData);

    const masked = {};
    for (const [key, value] of Object.entries(obj)) {
        if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
            masked[key] = "[REDACTED]";
        } else if (value && typeof value === "object") {
            masked[key] = maskSensitiveData(value);
        } else {
            masked[key] = value;
        }
    }
    return masked;
}

export function formatLogEntry(level, message, meta = {}) {
    const ctx = getRequestContext() || {};
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        requestId: ctx.requestId || meta.requestId || "none",
        userId: ctx.userId || meta.userId || null,
        ip: ctx.ip || meta.ip || "unknown",
        message,
        ...maskSensitiveData(meta)
    });
}

export const logger = {
    info: (msg, meta) => console.log(formatLogEntry("INFO", msg, meta)),
    warn: (msg, meta) => console.warn(formatLogEntry("WARN", msg, meta)),
    error: (msg, meta) => console.error(formatLogEntry("ERROR", msg, meta))
};

export const structuredLoggingMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const durationMs = Date.now() - startTime;
        const ctx = getRequestContext();
        
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs,
            contentLength: res.get("content-length") || null,
            userAgent: ctx.userAgent
        });
    });

    next();
};

export const responseTimerMiddleware = (req, res, next) => {
    req._startTime = Date.now();
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        const elapsed = Date.now() - req._startTime;
        res.setHeader("X-Response-Time", `${elapsed}ms`);
        return originalJson(body);
    };
    next();
};
