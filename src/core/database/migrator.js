import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const LOCK_ID = 987654321;

export async function getMigrationStatus() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                checksum CHAR(64) NOT NULL,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        const res = await client.query("SELECT version, name, checksum, executed_at FROM schema_migrations ORDER BY version ASC");
        return res.rows;
    } finally {
        client.release();
    }
}

export async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log("🔒 Acquiring migration advisory lock...");
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_ID]);

        // Ensure migrations ledger exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                checksum CHAR(64) NOT NULL,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        // Fetch applied migrations map
        const appliedRes = await client.query("SELECT version, checksum FROM schema_migrations");
        const appliedMap = new Map(appliedRes.rows.map(r => [r.version, r.checksum]));

        // Read migration files
        if (!fs.existsSync(MIGRATIONS_DIR)) {
            fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
        }

        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.endsWith(".sql"))
            .sort();

        let appliedCount = 0;

        for (const file of files) {
            const version = file.split("_")[0];
            const filePath = path.join(MIGRATIONS_DIR, file);
            const content = fs.readFileSync(filePath, "utf8");
            const checksum = crypto.createHash("sha256").update(content).digest("hex");

            if (appliedMap.has(version)) {
                const existingChecksum = appliedMap.get(version);
                if (existingChecksum !== checksum) {
                    throw new Error(`❌ Migration Checksum Mismatch in ${file}! Recorded: ${existingChecksum}, Current: ${checksum}`);
                }
            } else {
                console.log(`⚡ Applying migration: ${file}...`);
                await client.query(content);
                await client.query(
                    "INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
                    [version, file, checksum]
                );
                appliedCount++;
                console.log(`✅ Applied migration: ${file}`);
            }
        }

        await client.query("COMMIT");
        console.log(`🎉 Migration execution finished. (${appliedCount} new migrations applied)`);
        return { appliedCount };
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Migration failed:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

// CLI Command execution handle
if (process.argv[1] && process.argv[1].endsWith("migrator.js")) {
    const cmd = process.argv[2] || "migrate";
    if (cmd === "status") {
        getMigrationStatus()
            .then(rows => {
                console.table(rows);
                process.exit(0);
            })
            .catch(err => {
                console.error("Status error:", err);
                process.exit(1);
            });
    } else {
        runMigrations()
            .then(() => process.exit(0))
            .catch(() => process.exit(1));
    }
}
