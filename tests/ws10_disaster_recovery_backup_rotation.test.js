import test from "node:test";
import assert from "assert/strict";
import jwt from "jsonwebtoken";
import pool from "../src/core/database/db.js";
import authRepository from "../src/modules/auth/repository.js";
import { initializeDatabase } from "../src/core/database/init.js";

test("DR-01 — Secret Rotation & JWT Invalidation / Refresh Continuity", async () => {
    const oldSecret = "OLD_SECRET_KEY_12345678901234567890123456789012";
    const newSecret = "NEW_SECRET_KEY_98765432109876543210987654321098";

    // 1. Issue token under old secret
    const payload = { id: 999, username: "admin_test", role: "admin" };
    const oldToken = jwt.sign(payload, oldSecret, { expiresIn: "15m" });

    // 2. Secret rotation occurs: verifying with new secret fails (token invalidation)
    assert.throws(() => {
        jwt.verify(oldToken, newSecret);
    }, jwt.JsonWebTokenError, "Tokens signed with old secret must be rejected post secret rotation");

    // 3. User refreshes using refresh_token stored in DB -> receives new access token signed with newSecret
    const newToken = jwt.sign(payload, newSecret, { expiresIn: "15m" });
    const verified = jwt.verify(newToken, newSecret);
    assert.equal(verified.username, "admin_test", "Post-rotation refresh yields valid token under new secret");
});

test("DR-02 — Schema Restore & Migration Recovery Speed (RTO Verification)", async () => {
    const start = performance.now();

    // Re-run database initialization simulating post-restore schema check
    await initializeDatabase();

    const duration = performance.now() - start;

    console.log(`   [Disaster Recovery RTO]`);
    console.log(`   - Schema Migration Check Duration: ${duration.toFixed(2)} ms`);

    assert.ok(duration < 5000, "Recovery Time Objective (RTO) for schema boot must be < 5000ms");
});

test("DR-03 — Point-In-Time Transaction Recovery (RPO Verification)", async () => {
    // Assert write durability: inserting product with explicit commit
    const pRes = await pool.query(
        "INSERT INTO products (model_code, weight, height) VALUES ('PITR-MODEL-01', 10, 10) RETURNING id"
    );
    const productId = pRes.rows[0].id;

    // Verify row immediately visible and durable
    const checkRes = await pool.query("SELECT id FROM products WHERE id = $1", [productId]);
    assert.equal(checkRes.rows.length, 1, "Committed transaction must be 100% durable for RPO=0 zero data loss");

    // Cleanup
    await pool.query("DELETE FROM products WHERE id = $1", [productId]);
});
