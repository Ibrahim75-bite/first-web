import pg from "pg";
import config from "../../config/index.js";

const { Pool } = pg;

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.name,
    password: config.database.password,
    port: config.database.port,
    ssl: config.database.ssl,
    max: config.database.max,
    idleTimeoutMillis: config.database.idleTimeoutMillis,
    connectionTimeoutMillis: config.database.connectionTimeoutMillis,
    statement_timeout: config.database.statementTimeoutMillis,
    query_timeout: config.database.queryTimeoutMillis,
    application_name: "elmuttahida-api"
});

export const checkDatabaseHealth = async () => {
    const start = Date.now();
    try {
        const res = await pool.query("SELECT 1 AS alive");
        const latencyMs = Date.now() - start;
        return {
            status: res.rows[0]?.alive === 1 ? "UP" : "DOWN",
            latencyMs,
            totalCount: pool.totalCount,
            idleCount: pool.idleCount,
            waitingCount: pool.waitingCount
        };
    } catch (err) {
        return {
            status: "DOWN",
            error: err.message,
            latencyMs: Date.now() - start
        };
    }
};

export default pool;

