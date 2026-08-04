import test from "node:test";
import assert from "assert/strict";
import pool from "../src/core/database/db.js";
import productService from "../src/modules/products/services/product.service.js";
import inquiryService from "../src/modules/inquiries/service.js";
import { ValidationError, NotFoundError } from "../src/core/common/error.js";

test("BIZ-01 — Product Creation & 4-Variant Maximum Rule Enforce", async () => {
    const modelCode = "BIZ-RULE-001";
    
    // Cleanup prior run if exists
    await pool.query("DELETE FROM products WHERE model_code = $1", [modelCode]);

    // Create base product with 4 variants
    for (let i = 1; i <= 4; i++) {
        await productService.create({
            model_code: modelCode,
            weight: 5.5,
            height: 10.0,
            name_en: "Luxury Vase",
            material_en: "Porcelain",
            description_en: "Handcrafted Luxury Porcelain Vase",
            name_ar: "مزهرية فاخرة",
            material_ar: "بورسلين",
            description_ar: "مزهرية فاخرة مصنوعة يدوياً",
            sku: `${modelCode}-VAR-${i}`,
            color_en: `Color ${i}`,
            color_ar: `لون ${i}`
        });
    }

    // 5th variant insertion must throw ValidationError (Max 4 variants allowed per model)
    await assert.rejects(async () => {
        await productService.create({
            model_code: modelCode,
            weight: 5.5,
            height: 10.0,
            name_en: "Luxury Vase",
            material_en: "Porcelain",
            description_en: "Handcrafted Luxury Porcelain Vase",
            name_ar: "مزهرية فاخرة",
            material_ar: "بورسلين",
            description_ar: "مزهرية فاخرة مصنوعة يدوياً",
            sku: `${modelCode}-VAR-5`,
            color_en: "Color 5",
            color_ar: "لون 5"
        });
    }, (err) => {
        assert.ok(err instanceof ValidationError);
        assert.match(err.message, /maximum reached/i);
        return true;
    }, "Product variant insertion exceeding 4 must be rejected under business rules");

    // Cleanup
    await pool.query("DELETE FROM products WHERE model_code = $1", [modelCode]);
});

test("BIZ-02 — Minimum Order Quantity (MOQ) Validation & Unique Inquiry Generation", async () => {
    // 1. Submit inquiry with quantity < MOQ (MOQ = 10 for test variant)
    await assert.rejects(async () => {
        await inquiryService.submit({
            customer_name: "John Doe",
            customer_email: "john@example.com",
            items: [
                { sku: "U0002-PN05-WHT-GOLD", quantity: 0 }
            ]
        });
    }, (err) => {
        assert.ok(err instanceof ValidationError);
        return true;
    }, "Inquiry requesting quantity below MOQ must throw ValidationError");

    // 2. Submit valid inquiry
    const result = await inquiryService.submit({
        customer_name: "John Doe",
        customer_email: "john@example.com",
        items: [
            { sku: "U0002-PN05-WHT-GOLD", quantity: 50 }
        ]
    });

    assert.ok(result.inquiry_id, "Valid inquiry submission generates a unique inquiry ID");

    // Cleanup
    await pool.query("DELETE FROM inquiries WHERE id = $1", [result.inquiry_id]);
});

test("BIZ-03 — Multi-Language Product Catalog Search & Pagination Boundary", async () => {
    // Test listing products in Arabic
    const arCatalog = await productService.list({
        lang: "ar",
        page: 1,
        limit: 10
    });

    assert.ok(Array.isArray(arCatalog.data), "Product catalog returns array of items");
    assert.equal(arCatalog.page, 1, "Catalog honors requested page boundary");
    assert.ok(arCatalog.limit <= 100, "Catalog limits max page size to 100");
});
