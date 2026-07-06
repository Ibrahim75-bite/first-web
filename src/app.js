import express from "express";
import cors from "cors";
import config from "./config/index.js";
import pool from "./core/database/db.js";

// Global middlewares
import { morganMiddleware, responseTimerMiddleware } from "./core/middleware/logging.js";
import { sanitizeMiddleware } from "./core/middleware/sanitizer.js";
import { globalLimiter } from "./core/middleware/rateLimiter.js";
import errorHandler from "./core/middleware/error.js";
import { requestContextMiddleware } from "./core/common/context.js";
import { 
    cookieParamsMiddleware, 
    helmetMiddleware, 
    securityHeadersMiddleware 
} from "./core/middleware/security.js";

// Routers
import authRouter from "./modules/auth/router.js";
import productRouter from "./modules/products/router.js";
import inquiryRouter from "./modules/inquiries/router.js";
import importRouter from "./modules/imports/router.js";

const app = express();

// =============================================================================
// Security & Zero-Trust Headers Configuration
// =============================================================================
app.use(helmetMiddleware);
app.use(securityHeadersMiddleware);

// =============================================================================
// CORS Setup (Least-Privilege & Secure-by-Default)
// =============================================================================
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [config.frontendUrl];
        if (config.env !== "production") {
            allowedOrigins.push("http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173");
        }
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS validation failed: Origin blocked under Zero-Trust rules."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// Parse cookie headers natively
app.use(cookieParamsMiddleware);

// Initialize unique request IDs & trace context globally
app.use(requestContextMiddleware);

// Static hosting pathways
app.use("/images", express.static("uploads/images"));
app.use("/images/thumbnails", express.static("uploads/images/thumbnails"));

// Logging & Performance Metrics
app.use(morganMiddleware);
app.use(responseTimerMiddleware);

// Rate limits
app.use("/api/", globalLimiter);

// Input Sanitizers
app.use(sanitizeMiddleware);

// =============================================================================
// Routes Mapping
// =============================================================================
app.get("/", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Server running", time: result.rows[0] });
    } catch (err) {
        next(err);
    }
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/import", importRouter);

// Central error boundaries handler
app.use(errorHandler);

export default app;
