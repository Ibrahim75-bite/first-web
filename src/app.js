import express from "express";
import cors from "cors";
import config from "./config/index.js";
import pool, { checkDatabaseHealth } from "./core/database/db.js";

// Global middlewares
import { structuredLoggingMiddleware, responseTimerMiddleware } from "./core/middleware/logging.js";
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
app.set("trust proxy", config.trustProxy);

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
app.use(express.json({ limit: "256kb" }));

// Parse cookie headers natively
app.use(cookieParamsMiddleware);

// Initialize unique request IDs & trace context globally
app.use(requestContextMiddleware);

// Static hosting pathways
const publicMediaHeaders = (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
};
app.use("/images", express.static(config.storage.uploadsDir, { setHeaders: publicMediaHeaders }));
app.use("/images/thumbnails", express.static(config.storage.thumbsDir, { setHeaders: publicMediaHeaders }));

// Logging & Performance Metrics
app.use(structuredLoggingMiddleware);
app.use(responseTimerMiddleware);

// Rate limits
app.use("/api/", globalLimiter);

// Input Sanitizers
app.use(sanitizeMiddleware);

// =============================================================================
// Health, Readiness & Telemetry Probes (Monitoring & K8s/Docker Probes)
// =============================================================================
app.get("/health", (req, res) => res.json({ status: "UP", timestamp: new Date().toISOString(), env: config.env }));
app.get("/health/live", (req, res) => res.status(200).json({ status: "ALIVE", timestamp: new Date().toISOString() }));

app.get("/health/ready", async (req, res) => {
    const dbHealth = await checkDatabaseHealth();
    const isReady = dbHealth.status === "UP";
    
    res.status(isReady ? 200 : 503).json({
        status: isReady ? "READY" : "UNREADY",
        timestamp: new Date().toISOString(),
        database: dbHealth
    });
});

app.get("/ready", async (req, res) => {
    const dbHealth = await checkDatabaseHealth();
    const isReady = dbHealth.status === "UP";
    
    res.status(isReady ? 200 : 503).json({
        status: isReady ? "READY" : "UNREADY",
        timestamp: new Date().toISOString(),
        database: dbHealth
    });
});

app.get("/metrics", (req, res) => {
    const memory = process.memoryUsage();
    const metrics = [
        `# HELP node_process_uptime_seconds Total V8 process uptime in seconds`,
        `# TYPE node_process_uptime_seconds counter`,
        `node_process_uptime_seconds ${process.uptime().toFixed(2)}`,
        `# HELP node_process_heap_bytes V8 heap memory usage in bytes`,
        `# TYPE node_process_heap_bytes gauge`,
        `node_process_heap_bytes ${memory.heapUsed}`,
        `# HELP db_pool_total_connections Total connections in DB pool`,
        `# TYPE db_pool_total_connections gauge`,
        `db_pool_total_connections ${pool.totalCount || 0}`,
        `# HELP db_pool_idle_connections Idle connections in DB pool`,
        `# TYPE db_pool_idle_connections gauge`,
        `db_pool_idle_connections ${pool.idleCount || 0}`,
        `# HELP db_pool_waiting_queries Waiting queries in DB pool queue`,
        `# TYPE db_pool_waiting_queries gauge`,
        `db_pool_waiting_queries ${pool.waitingCount || 0}`
    ].join("\n");

    res.setHeader("Content-Type", "text/plain; version=0.0.4");
    res.send(metrics);
});

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
