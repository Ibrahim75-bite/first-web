-- =============================================================================
-- Migration: 003_fts_vector_and_invariants
-- Purpose: Add search_vector TSVECTOR, auto-update trigger, refresh_tokens FK/indexes, and enterprise schema invariants.
-- =============================================================================

-- 1. FULL TEXT SEARCH TSVECTOR COLUMN & TRIGGER (F-01)
ALTER TABLE product_translations ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION update_product_translation_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector(
            CASE WHEN NEW.language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
            coalesce(NEW.name, '')
        ), 'A') ||
        setweight(to_tsvector(
            CASE WHEN NEW.language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
            coalesce(NEW.material, '')
        ), 'B') ||
        setweight(to_tsvector(
            CASE WHEN NEW.language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
            coalesce(NEW.description, '')
        ), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_translation_search_vector ON product_translations;
CREATE TRIGGER trg_update_product_translation_search_vector
BEFORE INSERT OR UPDATE ON product_translations
FOR EACH ROW EXECUTE FUNCTION update_product_translation_search_vector();

-- Populate search_vector for existing rows
UPDATE product_translations SET search_vector = 
    setweight(to_tsvector(
        CASE WHEN language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
        coalesce(name, '')
    ), 'A') ||
    setweight(to_tsvector(
        CASE WHEN language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
        coalesce(material, '')
    ), 'B') ||
    setweight(to_tsvector(
        CASE WHEN language_code = 'ar' THEN 'arabic'::regconfig ELSE 'english'::regconfig END,
        coalesce(description, '')
    ), 'C')
WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_product_translations_search_vector 
ON product_translations USING GIN(search_vector);


-- 2. REFRESH TOKENS FK & EXPIRY INDEX (R2-09)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_refresh_tokens_user'
    ) THEN
        ALTER TABLE refresh_tokens 
        ADD CONSTRAINT fk_refresh_tokens_user 
        FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked ON refresh_tokens(revoked);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_revoked ON refresh_tokens(user_id, revoked);


-- 3. PRODUCT VARIANT SKU UNIQUE CONSTRAINT (R2-03)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_product_variants_sku'
    ) THEN
        ALTER TABLE product_variants ADD CONSTRAINT uq_product_variants_sku UNIQUE (sku);
    END IF;
END $$;


-- 4. ENTERPRISE SCHEMA INVARIANTS & RELATIONSHIP CONSTRAINTS (R2-12)

-- Product Relations: Prevent self-relation and duplicate pairs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chk_no_self_product_relation'
    ) THEN
        ALTER TABLE product_relations ADD CONSTRAINT chk_no_self_product_relation CHECK (product_id != related_product_id);
    END IF;
END $$;

-- Variant Media: Enforce unique media attachment per variant
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_variant_media_pair'
    ) THEN
        ALTER TABLE variant_media ADD CONSTRAINT uq_variant_media_pair UNIQUE (variant_id, media_id);
    END IF;
END $$;

-- Entity Revisions: Unique revision numbers per entity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_entity_revision_num'
    ) THEN
        ALTER TABLE entity_revisions ADD CONSTRAINT uq_entity_revision_num UNIQUE (entity_type, entity_id, revision_number);
    END IF;
END $$;

-- Scoped Slug Uniqueness
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_category_slug_lang'
    ) THEN
        ALTER TABLE category_translations ADD CONSTRAINT uq_category_slug_lang UNIQUE (slug, language_code);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'uq_article_slug_lang'
    ) THEN
        ALTER TABLE article_translations ADD CONSTRAINT uq_article_slug_lang UNIQUE (slug, language_code);
    END IF;
END $$;

-- Enforce inquiry_number column existence on inquiries
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS inquiry_number VARCHAR(100);

