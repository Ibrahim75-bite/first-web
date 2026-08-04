import test from "node:test";
import assert from "assert/strict";
import crypto from "crypto";

import pool from "../src/core/database/db.js";
import withTransaction from "../src/core/database/transaction.js";
import productRepository from "../src/modules/products/repositories/product.repository.js";
import inquiryRepository from "../src/modules/inquiries/repository.js";
import tagRepository from "../src/modules/products/repositories/tag.repository.js";

test("DB-AUDIT — Foreign Key Cascade & Referential Integrity", async () => {
    const testCode = `TEST-CASCADE-${Date.now()}`;
    const testSku = `SKU-CASCADE-${Date.now()}`;

    let productId;
    let variantId;

    await withTransaction(async (tx) => {
        productId = await productRepository.insert({ model_code: testCode, weight: 1.5, height: 2.5 }, tx.client);
        await productRepository.insertTranslations({
            productId,
            name_en: "Cascade Test Product",
            material_en: "Wood",
            description_en: "Cascade test description",
            name_ar: "منتج اختبار",
            material_ar: "خشب",
            description_ar: "وصف اختبار",
            slugEn: `cascade-test-${Date.now()}-en`,
            slugAr: `cascade-test-${Date.now()}-ar`
        }, tx.client);

        variantId = await tx.client.query(
            `INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar) VALUES ($1, $2, 'Red', 'أحمر') RETURNING id`,
            [productId, testSku]
        ).then(res => res.rows[0].id);

        await tx.client.query(
            `INSERT INTO variant_images (variant_id, image_name) VALUES ($1, 'test_img.jpg')`,
            [variantId]
        );
    });

    // Verify parent product exists
    const checkProduct = await pool.query("SELECT id FROM products WHERE id = $1", [productId]);
    assert.equal(checkProduct.rows.length, 1);

    // Delete parent product
    await productRepository.delete(productId);

    // Verify cascading deletion across product_translations, product_variants, and variant_images
    const checkTrans = await pool.query("SELECT * FROM product_translations WHERE product_id = $1", [productId]);
    const checkVariants = await pool.query("SELECT * FROM product_variants WHERE product_id = $1", [productId]);
    const checkImages = await pool.query("SELECT * FROM variant_images WHERE variant_id = $1", [variantId]);

    assert.equal(checkTrans.rows.length, 0, "Translations must be deleted on cascade");
    assert.equal(checkVariants.rows.length, 0, "Variants must be deleted on cascade");
    assert.equal(checkImages.rows.length, 0, "Variant images must be deleted on cascade");
});

test("DB-AUDIT — Full-Text Search TSVECTOR & Index Query Execution", async () => {
    const testCode = `TEST-FTS-${Date.now()}`;
    const uniqueTerm = `AndalusianGoldMaster${Date.now()}`;

    let productId;
    await withTransaction(async (tx) => {
        productId = await productRepository.insert({ model_code: testCode, weight: 1.0, height: 1.0 }, tx.client);
        await productRepository.insertTranslations({
            productId,
            name_en: `Luxury Tile ${uniqueTerm}`,
            material_en: "Porcelain",
            description_en: "Handcrafted architectural tile",
            name_ar: "بلاط فاخر",
            material_ar: "بورسلين",
            description_ar: "بلاط معماري يدوي",
            slugEn: `fts-${Date.now()}-en`,
            slugAr: `fts-${Date.now()}-ar`
        }, tx.client);
    });

    // Execute Full-Text Search query via ProductRepository
    const results = await productRepository.listIds({
        lang: "en",
        search: uniqueTerm,
        tagList: null,
        limit: 10,
        offset: 0
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].id, productId);

    // Cleanup
    await productRepository.delete(productId);
});

test("DB-AUDIT — High-Concurrency Concurrent Writes & Lock Safety", async () => {
    const totalWorkers = 25;
    const testSkus = Array.from({ length: totalWorkers }).map((_, i) => `CONCUR-SKU-${Date.now()}-${i}`);

    // Execute 25 parallel transaction inserts
    const insertTasks = testSkus.map((sku) => 
        withTransaction(async (tx) => {
            const modelCode = `MODEL-${sku}`;
            const pid = await productRepository.insert({ model_code: modelCode, weight: 5, height: 5 }, tx.client);
            await tx.client.query(
                `INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar) VALUES ($1, $2, 'Blue', 'أزرق')`,
                [pid, sku]
            );
            return pid;
        })
    );

    const insertedIds = await Promise.all(insertTasks);
    assert.equal(insertedIds.length, totalWorkers);

    // Cleanup all created test rows
    await pool.query("DELETE FROM products WHERE id = ANY($1)", [insertedIds]);
});

test("DB-AUDIT — Cryptographic Business Identifier Uniqueness under Stress", async () => {
    const count = 50;
    const insertTasks = Array.from({ length: count }).map(() => 
        inquiryRepository.insert({
            customer_name: "Stress Customer",
            customer_email: "stress@example.com",
            items: [{ sku: "TEST-SKU", quantity: 10 }]
        })
    );

    const results = await Promise.all(insertTasks);
    const ids = results.map(r => r.id);

    // Fetch generated inquiry_numbers from DB
    const rows = await pool.query("SELECT inquiry_number FROM inquiries WHERE id = ANY($1)", [ids]);
    const numbers = rows.rows.map(r => r.inquiry_number);
    const uniqueNumbers = new Set(numbers);

    assert.equal(numbers.length, count);
    assert.equal(uniqueNumbers.size, count, "All generated inquiry reference numbers must be 100% unique");

    // Cleanup
    await pool.query("DELETE FROM inquiries WHERE id = ANY($1)", [ids]);
});
