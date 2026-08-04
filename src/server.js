import app from "./app.js";
import config from "./config/index.js";
import pool, { checkDatabaseHealth } from "./core/database/db.js";
import { initializeDatabase } from "./core/database/init.js";

let server;

async function bootstrap() {
    try {
        console.log("🔄 Connecting to database...");
        const dbHealth = await checkDatabaseHealth();
        if (dbHealth.status !== "UP") {
            throw new Error(`Database connection check failed: ${dbHealth.error || "UNKNOWN"}`);
        }
        console.log("🚀 Database connected successfully.");

        // Await full schema initialization before listening
        await initializeDatabase();
        console.log("✅ Schema migration/initialization checked.");

        if (config.env !== "test" && (!config.storage.isVercel || process.env.NODE_ENV !== "production")) {
            server = app.listen(config.port, () => {
                console.log(`🚀 Server running on port ${config.port} [${config.env}]`);
                if (process.send) {
                    process.send("ready");
                }
            });
        }
    } catch (err) {
        console.error("❌ Startup Error:", err.message);
        process.exit(1);
    }
}

async function gracefulShutdown(signal) {
    console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
    const shutdownTimeout = setTimeout(() => {
        console.error("❌ Forced shutdown due to timeout.");
        process.exit(1);
    }, 10000);

    try {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
            console.log("✅ HTTP server closed.");
        }
        await pool.end();
        console.log("✅ Database connection pool closed.");
        clearTimeout(shutdownTimeout);
        console.log("👋 Graceful shutdown complete.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error during shutdown:", err.message);
        process.exit(1);
    }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    gracefulShutdown("UNCAUGHT_EXCEPTION");
});

bootstrap();

export { server };

