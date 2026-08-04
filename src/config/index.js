import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_ENV = [
    "DB_USER",
    "DB_HOST",
    "DB_NAME",
    "DB_PASSWORD",
    "DB_PORT",
    "JWT_SECRET",
    "BASE_URL"
];

// Validate missing required variables
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`❌ Configuration Error: Missing environment variables: ${missingEnv.join(", ")}`);
    if (process.env.NODE_ENV !== "test") {
        process.exit(1);
    }
}

// Validate production secrets strength
if (process.env.NODE_ENV === "production") {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.error("❌ Configuration Error: JWT_SECRET must be at least 32 characters long in production.");
        process.exit(1);
    }
}

const parseBool = (val, defaultVal = false) => {
    if (val === undefined || val === null) return defaultVal;
    return String(val).toLowerCase() === "true" || val === "1";
};

const parseIntBounded = (val, defaultVal, min, max) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return defaultVal;
    if (min !== undefined && parsed < min) return min;
    if (max !== undefined && parsed > max) return max;
    return parsed;
};

const parseTrustProxy = (val) => {
    if (!val) return false;
    if (val === "true" || val === "1") return 1;
    if (val === "false" || val === "0") return false;
    const parsedNum = parseInt(val, 10);
    if (!isNaN(parsedNum)) return parsedNum;
    return val; // IP/CIDR string or array format
};

export const config = Object.freeze({
    env: process.env.NODE_ENV || "development",
    port: parseIntBounded(process.env.PORT, 5000, 1024, 65535),
    baseUrl: (process.env.BASE_URL || "http://localhost:5000").replace(/\/+$/, ""),
    frontendUrl: (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, ""),
    jwt: Object.freeze({
        secret: process.env.JWT_SECRET || "default_dev_secret_change_in_production_32chars",
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        refreshSecret: process.env.JWT_REFRESH_SECRET || ((process.env.JWT_SECRET || "default_dev_secret") + "_refresh"),
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    }),
    database: Object.freeze({
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        name: process.env.DB_NAME || "elmuttahida",
        password: process.env.DB_PASSWORD || "postgres",
        port: parseIntBounded(process.env.DB_PORT, 5432, 1, 65535),
        ssl: parseBool(process.env.DB_SSL, false) ? {
            rejectUnauthorized: parseBool(process.env.DB_SSL_REJECT_UNAUTHORIZED, true)
        } : false,
        max: parseIntBounded(process.env.DB_POOL_MAX, 10, 1, 100),
        idleTimeoutMillis: parseIntBounded(process.env.DB_IDLE_TIMEOUT_MS, 30000, 1000, 300000),
        connectionTimeoutMillis: parseIntBounded(process.env.DB_CONNECTION_TIMEOUT_MS, 5000, 1000, 60000),
        statementTimeoutMillis: parseIntBounded(process.env.DB_STATEMENT_TIMEOUT_MS, 15000, 1000, 120000),
        queryTimeoutMillis: parseIntBounded(process.env.DB_QUERY_TIMEOUT_MS, 15000, 1000, 120000)
    }),
    trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
    storage: Object.freeze({
        isVercel: !!process.env.VERCEL,
        uploadsDir: process.env.VERCEL 
            ? "/tmp/uploads/images" 
            : path.join(__dirname, "..", "..", "uploads", "images"),
        thumbsDir: process.env.VERCEL 
            ? "/tmp/uploads/images/thumbnails" 
            : path.join(__dirname, "..", "..", "uploads", "images", "thumbnails"),
        tempDir: process.env.VERCEL 
            ? "/tmp/uploads/temp" 
            : path.join(__dirname, "..", "..", "uploads", "temp")
    })
});

export default config;

