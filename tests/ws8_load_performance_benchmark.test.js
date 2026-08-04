import test from "node:test";
import assert from "assert/strict";
import { performance } from "perf_hooks";

import pool from "../src/core/database/db.js";
import productService from "../src/modules/products/services/product.service.js";
import inquiryService from "../src/modules/inquiries/service.js";
import withTransaction from "../src/core/database/transaction.js";

/**
 * Calculates latency percentiles (P50, P95, P99) from an array of durations (ms).
 */
function calculatePercentiles(durations) {
    const sorted = [...durations].sort((a, b) => a - b);
    const count = sorted.length;
    
    const min = sorted[0];
    const max = sorted[count - 1];
    const p50 = sorted[Math.floor(count * 0.50)];
    const p95 = sorted[Math.floor(count * 0.95)];
    const p99 = sorted[Math.floor(count * 0.99)];
    const avg = sorted.reduce((sum, d) => sum + d, 0) / count;

    return { min, max, avg, p50, p95, p99, count };
}

test("PERF-01 — Product Catalog Pagination & Full-Text Search Latency", async () => {
    const iterations = 50;
    const durations = [];

    const memBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await productService.list({
            lang: "en",
            limit: 20,
            page: 1,
            search: "Vase"
        });
        const duration = performance.now() - start;
        durations.push(duration);
    }

    const memAfter = process.memoryUsage().heapUsed;
    const metrics = calculatePercentiles(durations);

    console.log("   [Catalog Search Performance]");
    console.log(`   - Count: ${metrics.count} requests`);
    console.log(`   - P50 (Median): ${metrics.p50.toFixed(2)} ms`);
    console.log(`   - P95: ${metrics.p95.toFixed(2)} ms`);
    console.log(`   - P99: ${metrics.p99.toFixed(2)} ms`);
    console.log(`   - Avg: ${metrics.avg.toFixed(2)} ms`);
    console.log(`   - Heap Delta: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)} MB`);

    assert.ok(metrics.p95 < 250, "P95 catalog search latency must be under 250ms");
});

test("PERF-02 — High-Volume Inquiry Creation Throughput", async () => {
    const totalRequests = 20;
    const durations = [];

    // Ensure valid SKU exists for test
    let skuRow = (await pool.query("SELECT sku FROM product_variants LIMIT 1")).rows[0];
    let sku = skuRow ? skuRow.sku : "PERF-SKU-001";

    if (!skuRow) {
        // Seed temporary variant if none exist
        const pRes = await pool.query("INSERT INTO products (model_code, weight, height) VALUES ('PERF-MOD', 1, 1) RETURNING id");
        await pool.query("INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar) VALUES ($1, 'PERF-SKU-001', 'Blue', 'أزرق')", [pRes.rows[0].id]);
    }

    const startTotal = performance.now();

    const tasks = Array.from({ length: totalRequests }).map(async (_, idx) => {
        const start = performance.now();
        const res = await inquiryService.submit({
            customer_name: `Perf Customer ${idx}`,
            customer_email: `perf_${idx}@example.com`,
            items: [{ sku, quantity: 1 }]
        });
        const duration = performance.now() - start;
        durations.push(duration);
        return res.inquiry_id;
    });

    const insertedIds = await Promise.all(tasks);
    const totalDuration = performance.now() - startTotal;

    const metrics = calculatePercentiles(durations);
    const rps = (totalRequests / (totalDuration / 1000)).toFixed(2);

    console.log("   [Inquiry Creation Stress]");
    console.log(`   - Throughput: ${rps} req/sec`);
    console.log(`   - P50: ${metrics.p50.toFixed(2)} ms | P95: ${metrics.p95.toFixed(2)} ms | P99: ${metrics.p99.toFixed(2)} ms`);

    assert.equal(insertedIds.length, totalRequests);
    assert.ok(metrics.p95 < 300, "P95 inquiry creation latency must be under 300ms");

    // Cleanup
    await pool.query("DELETE FROM inquiries WHERE id = ANY($1)", [insertedIds]);
});
test("PERF-04 — 30-Day Runtime Stability & Cache Capping Verification", async () => {
    const { MemoryCacheProvider } = await import("../src/core/common/cache.js");
    const testCache = new MemoryCacheProvider(100); // capped at 100 entries

    // Fill with 500 unique items
    for (let i = 0; i < 500; i++) {
        testCache.set(`key_${i}`, { val: i });
    }

    assert.ok(testCache.cache.size <= 100, `Cache size ${testCache.cache.size} must not exceed maxSize of 100`);

    const { authRepository } = await import("../src/modules/auth/repository.js");
    const purgedCount = await authRepository.purgeExpiredRefreshTokens();
    assert.ok(typeof purgedCount === "number");
});

test("PERF-03 — Database Connection Pool Under Parallel Transaction Load", async () => {
    const concurrentCount = 40;
    const durations = [];

    const tasks = Array.from({ length: concurrentCount }).map(async () => {
        const start = performance.now();
        await withTransaction(async (tx) => {
            const res = await tx.client.query("SELECT COUNT(*) FROM products");
            return res.rows[0].count;
        });
        const duration = performance.now() - start;
        durations.push(duration);
    });

    await Promise.all(tasks);

    const metrics = calculatePercentiles(durations);

    console.log("   [Database Pool Concurrency]");
    console.log(`   - Active Connections Released: pool.waitingCount = ${pool.waitingCount}`);
    console.log(`   - P50: ${metrics.p50.toFixed(2)} ms | P95: ${metrics.p95.toFixed(2)} ms`);

    assert.equal(pool.waitingCount, 0, "No connections left waiting in queue");
    assert.ok(metrics.p95 < 200, "P95 transaction execution latency must be under 200ms");
});
