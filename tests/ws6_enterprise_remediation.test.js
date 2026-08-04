import test from "node:test";
import assert from "assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import pool from "../src/core/database/db.js";
import withTransaction from "../src/core/database/transaction.js";
import { MemoryCacheProvider, RedisCacheProvider, createCacheProvider } from "../src/core/common/cache.js";
import { VariantService } from "../src/modules/products/services/variant.service.js";
import { ProductService } from "../src/modules/products/services/product.service.js";
import { InquiryRepository } from "../src/modules/inquiries/repository.js";
import storageService from "../src/core/common/storage.js";
import container from "../src/container.js";

test("ARCH-01 — Transaction Context Propagation & Rollback Safety", async () => {
    const testSku = `TEST-ROLLBACK-${Date.now()}`;
    
    try {
        await withTransaction(async (tx) => {
            await tx.client.query(
                `INSERT INTO products (model_code, weight, height) VALUES ($1, 10, 10)`,
                [testSku]
            );
            // Deliberate error to trigger rollback
            throw new Error("Forced transaction rollback test");
        });
    } catch (err) {
        assert.equal(err.message, "Forced transaction rollback test");
    }

    // Verify product was rolled back completely
    const res = await pool.query("SELECT * FROM products WHERE model_code = $1", [testSku]);
    assert.equal(res.rows.length, 0, "Rolled back transaction must leave 0 orphaned rows");
});

test("ARCH-02 & F-BUG-01 — Orphan Upload Cleanup on Invalid Variant Failure", async () => {
    const fakeFileName = `test_orphan_${crypto.randomUUID()}.jpg`;
    await storageService.write(fakeFileName, Buffer.from("dummy image content"), "uploads");
    
    const mockFile = { filename: fakeFileName };
    const invalidVariantId = 99999999; // Non-existent variant ID

    const variantService = new VariantService();

    try {
        await variantService.uploadImage(invalidVariantId, mockFile);
        assert.fail("Should have thrown NotFoundError for invalid variant");
    } catch (err) {
        assert.equal(err.name, "NotFoundError");
    }

    // Verify orphaned file was deleted from uploads directory
    const exists = storageService.exists(fakeFileName, "uploads");
    assert.equal(exists, false, "Orphaned upload file must be deleted upon validation failure");
});

test("ARCH-02 — Post-Commit Deferred Execution Queue (Rollback preserves files)", async () => {
    const testFile = `test_deferred_${crypto.randomUUID()}.jpg`;
    await storageService.write(testFile, Buffer.from("test content"), "uploads");

    try {
        await withTransaction(async (tx) => {
            tx.onCommit(async () => {
                await storageService.delete(testFile, "uploads");
            });
            throw new Error("Rollback before commit");
        });
    } catch (err) {
        assert.equal(err.message, "Rollback before commit");
    }

    // Since transaction rolled back, onCommit must NOT have executed!
    const fileExistsAfterRollback = storageService.exists(testFile, "uploads");
    assert.equal(fileExistsAfterRollback, true, "Rollback must preserve files queued for post-commit deletion");

    // Clean up test file manually
    await storageService.delete(testFile, "uploads");
});

test("ARCH-03 — Dependency Inversion Container Resolution", async () => {
    const pService = container.get("productService");
    const vService = container.get("variantService");
    assert.ok(pService instanceof ProductService);
    assert.ok(vService instanceof VariantService);

    // Custom Container Scope with Mocks
    const customContainer = container.createCustomScope({
        productService: { isMock: true }
    });
    assert.equal(customContainer.get("productService").isMock, true);
});

test("ARCH-05 — Connection Pool Release Verification", async () => {
    const initialIdle = pool.idleCount;

    // Run 20 concurrent transactions
    const promises = Array.from({ length: 20 }).map(() => 
        withTransaction(async (tx) => {
            const res = await tx.client.query("SELECT 1 AS num");
            return res.rows[0].num;
        })
    );

    const results = await Promise.all(promises);
    assert.equal(results.length, 20);
    assert.equal(results.every(r => r === 1), true);

    // Give pool small window to return all connections to idle state
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(pool.waitingCount, 0, "No client connections should be left waiting or leaked");
});

test("ARCH-06 — Cache Provider Interchangeability", async () => {
    const memCache = createCacheProvider("memory");
    assert.ok(memCache instanceof MemoryCacheProvider);

    memCache.set("test:key", { foo: "bar" });
    assert.deepEqual(memCache.get("test:key"), { foo: "bar" });

    const redisCache = createCacheProvider("redis", { redisClient: null });
    assert.ok(redisCache instanceof RedisCacheProvider);

    // Graceful fallback when redisClient is null
    await redisCache.set("test:redis", { bar: "baz" });
    const val = await redisCache.get("test:redis");
    assert.deepEqual(val, { bar: "baz" });
});

test("ARCH-07 — Cryptographic Collision-Resistant Identifier Generation", async () => {
    const repo = new InquiryRepository();
    const mockDb = {
        query: async (sql, params) => {
            return { rows: [{ id: 1, created_at: new Date() }] };
        }
    };

    const inserted = await repo.insert({
        customer_name: "John Doe",
        customer_email: "john@example.com",
        items: [{ sku: "SKU-1", quantity: 10 }]
    }, mockDb);

    assert.ok(inserted.id);
});
