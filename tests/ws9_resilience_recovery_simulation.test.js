import test from "node:test";
import assert from "assert/strict";
import { RedisCacheProvider } from "../src/core/common/cache.js";
import withTransaction from "../src/core/database/transaction.js";
import pool from "../src/core/database/db.js";

test("RES-01 — Redis Interruption & Graceful Fallback", async () => {
    // Simulate disconnected/dead Redis client
    const deadRedisClient = {
        isOpen: false,
        get: async () => { throw new Error("Redis Connection Refused ECONNREFUSED"); },
        set: async () => { throw new Error("Redis Connection Refused ECONNREFUSED"); }
    };

    const redisProvider = new RedisCacheProvider({ redisClient: deadRedisClient });

    // Operations should NOT throw 500 errors; they must gracefully use Memory fallback
    await redisProvider.set("resilience_key", { status: "OK" }, 60000);
    const cachedData = await redisProvider.get("resilience_key");

    assert.deepEqual(cachedData, { status: "OK" }, "System must recover transparently via memory fallback when Redis dies");
});

test("RES-02 — DB Transaction Rollback on Interrupted File Upload", async () => {
    let commitHookExecuted = false;

    try {
        await withTransaction(async (tx) => {
            tx.onCommit(() => {
                commitHookExecuted = true;
            });

            await tx.client.query("INSERT INTO products (model_code, weight, height) VALUES ('RES-FAIL-01', 1, 1)");

            // Simulate file processing crash / disk full (ENOSPC)
            throw new Error("ENOSPC: no space left on device");
        });
    } catch (err) {
        assert.equal(err.message, "ENOSPC: no space left on device");
    }

    assert.equal(commitHookExecuted, false, "Post-commit file deletion hooks must NOT execute on aborted transaction");

    // Verify DB state was NOT mutated
    const checkRes = await pool.query("SELECT * FROM products WHERE model_code = 'RES-FAIL-01'");
    assert.equal(checkRes.rows.length, 0, "No orphaned records should exist after interrupted transaction");
});

test("RES-03 — Idempotent Migration Safety on Interrupted Migrations", async () => {
    const { initializeDatabase } = await import("../src/core/database/init.js");

    // Re-running migration twice simulates interrupted or repeated migration execution
    await initializeDatabase();
    await initializeDatabase();

    const dbHealth = await pool.query("SELECT 1 as healthy");
    assert.equal(dbHealth.rows[0].healthy, 1, "Database schema must remain healthy after repeated migration calls");
});

test("RES-04 — Sudden Network Interruption Database Pool Recovery", async () => {
    // Acquire connection, simulate abrupt query timeout / disconnect, verify pool releases connection
    try {
        await withTransaction(async (tx) => {
            await tx.client.query("SELECT 1");
            throw new Error("ETIMEDOUT: Network gateway dropped");
        });
    } catch (err) {
        assert.equal(err.message, "ETIMEDOUT: Network gateway dropped");
    }

    // Verify connection pool recovers cleanly
    assert.equal(pool.waitingCount, 0, "Pool waiting queue must recover to 0 after network interruption");
});
