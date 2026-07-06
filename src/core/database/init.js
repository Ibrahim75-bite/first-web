import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
    const client = await pool.connect();
    try {
        console.log("Checking database schema initialization...");

        await client.query("BEGIN");

        // 1. Create base metadata tables if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL, -- references admins(id) defined in migration
                token_hash VARCHAR(255) NOT NULL UNIQUE,
                expires_at TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                revoked BOOLEAN DEFAULT FALSE,
                replaced_by_token_hash VARCHAR(255)
            );
            CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                user_id INT,
                username VARCHAR(100),
                ip_address VARCHAR(45),
                device_info TEXT,
                request_id VARCHAR(50),
                action VARCHAR(100) NOT NULL,
                target VARCHAR(200) NOT NULL,
                previous_value JSONB,
                new_value JSONB
            );
            CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
        `);

        // 2. Load and execute the 001_enterprise_upgrade DDL migration script
        const migrationPath = path.join(__dirname, "migrations", "001_enterprise_upgrade.sql");
        if (fs.existsSync(migrationPath)) {
            // console.log(`Applying database migration script: ${migrationPath}`);
            const migrationSql = fs.readFileSync(migrationPath, "utf8");
            await client.query(migrationSql);
        }

        await client.query("COMMIT");
        console.log("✅ Database schema initialized successfully.");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Database schema initialization failed:", err.message);
        throw err;
    } finally {
        client.release();
    }
}
