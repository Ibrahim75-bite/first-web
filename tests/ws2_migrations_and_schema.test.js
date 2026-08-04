import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "..", "src", "core", "database", "migrations");

test("WS2 Migrations — Migration files exist and follow version naming", () => {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();
    assert.ok(files.length >= 3);
    assert.equal(files[0], "001_base_schema.sql");
    assert.equal(files[1], "002_enterprise_upgrade.sql");
    assert.equal(files[2], "003_fts_vector_and_invariants.sql");
});

test("WS2 Schema — 003_fts_vector_and_invariants contains F-01 search_vector and trigger", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "003_fts_vector_and_invariants.sql"), "utf8");
    assert.match(content, /search_vector TSVECTOR/i);
    assert.match(content, /CREATE TRIGGER trg_update_product_translation_search_vector/i);
    assert.match(content, /CREATE INDEX IF NOT EXISTS idx_product_translations_search_vector/i);
});

test("WS2 Schema — Contains R2-09 refresh_tokens foreign key and index definitions", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "003_fts_vector_and_invariants.sql"), "utf8");
    assert.match(content, /fk_refresh_tokens_user/i);
    assert.match(content, /idx_refresh_tokens_revoked/i);
});

test("WS2 Schema — Contains R2-03 SKU uniqueness constraint", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "003_fts_vector_and_invariants.sql"), "utf8");
    assert.match(content, /uq_product_variants_sku/i);
});

test("WS2 Schema — Contains R2-12 Enterprise invariants", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "003_fts_vector_and_invariants.sql"), "utf8");
    assert.match(content, /chk_no_self_product_relation/i);
    assert.match(content, /uq_variant_media_pair/i);
    assert.match(content, /uq_entity_revision_num/i);
});
