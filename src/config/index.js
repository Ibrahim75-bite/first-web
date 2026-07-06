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

const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`❌ Configuration Error: Missing environment variables: ${missingEnv.join(", ")}`);
    process.exit(1);
}

export const config = {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5000", 10),
    baseUrl: process.env.BASE_URL.replace(/\/+$/, ""),
    frontendUrl: process.env.FRONTEND_URL || "https://elmuttahida.com",
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        refreshSecret: process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh"),
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    },
    database: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10)
    },
    storage: {
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
    }
};

export default config;
