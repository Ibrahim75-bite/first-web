import app from "./app.js";
import config from "./config/index.js";
import pool from "./core/database/db.js";

import { initializeDatabase } from "./core/database/init.js";

// Database Connection Check
pool.query("SELECT NOW()")
    .then(async () => {
        console.log("🚀 Database connected successfully.");
        await initializeDatabase();
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    });

// Start listening if not on serverless/Vercel platform
if (config.env !== "production" || !process.env.VERCEL) {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port} [${config.env}]`);
        
        // Notify PM2 that process is ready (resolves startup hang loop)
        if (process.send) {
            process.send("ready");
        }
    });
}
