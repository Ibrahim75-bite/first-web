# Workstream 2 Architecture — Schema & Migration Ownership

## Overview
WS2 transitions database management from imperative, startup DDL executions to a versioned, immutable, checksum-verified migration engine.

## Key Architectural Controls

### 1. Migration Runner Engine (`src/core/database/migrator.js`)
* **Advisory Lock**: Uses `pg_advisory_xact_lock(987654321)` to ensure serial migration execution across horizontal app instances.
* **Ledger Table**: Tracks version numbers, file names, SHA-256 checksums, and execution timestamps in `schema_migrations`.
* **Checksum Verification**: Protects already-applied migrations from retroactive alteration.

### 2. Full-Text Search TSVECTOR (`003_fts_vector_and_invariants.sql`)
* **Search Vector Column**: Adds `search_vector TSVECTOR` to `product_translations`.
* **Automated Trigger**: `trg_update_product_translation_search_vector` automatically updates `search_vector` on INSERT/UPDATE operations, assigning weighted relevance to name (A), material (B), and description (C).
* **GIN Index**: `idx_product_translations_search_vector` enables sub-10ms full-text catalog queries.

### 3. Schema Invariants & Integrity Constraints
* **SKU Uniqueness**: `uq_product_variants_sku` on `product_variants(sku)`.
* **Refresh Token Integrity**: `fk_refresh_tokens_user` linking `refresh_tokens.user_id` to `admins(id)` with `ON DELETE CASCADE`.
* **Product Relations**: `chk_no_self_product_relation` prevents self-referencing product links.
* **Media & Revisions**: `uq_variant_media_pair` on `(variant_id, media_id)` and `uq_entity_revision_num` on `(entity_type, entity_id, revision_number)`.
