-- =============================================================================
-- Migration: 001_enterprise_upgrade
-- Purpose: Transform base Decorella schema to support enterprise CMS, Media Library, SEO/AEO/GEO, and audit trails.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENHANCE ADMINS TABLE
ALTER TABLE admins ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_by INT REFERENCES admins(id) ON DELETE SET NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_by INT REFERENCES admins(id) ON DELETE SET NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES admins(id) ON DELETE SET NULL;

-- 2. ENHANCE PRODUCTS TABLE
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS published_status VARCHAR(50) NOT NULL DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by INT REFERENCES admins(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by INT REFERENCES admins(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES admins(id) ON DELETE SET NULL;

-- 3. ENHANCE PRODUCT VARIANTS TABLE
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2) DEFAULT NULL;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS height NUMERIC(10, 2) DEFAULT NULL;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 4. ENHANCE TAGS TABLE
ALTER TABLE tags ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 5. ENHANCE INQUIRIES TABLE
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- =============================================================================
-- 6. CREATE CATEGORIES TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS category_translations (
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, language_code)
);

CREATE TABLE IF NOT EXISTS product_categories (
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- =============================================================================
-- 7. CREATE MEDIA LIBRARY TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS media_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES admins(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    sha256_hash CHAR(64) UNIQUE NOT NULL,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_by INT REFERENCES admins(id) ON DELETE SET NULL,
    deleted_by INT REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS media_translations (
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    PRIMARY KEY (media_id, language_code)
);

CREATE TABLE IF NOT EXISTS variant_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id INT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 8. CREATE SEO, AEO, AND GEO TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL, -- UUID or Int ID representation
    language_code VARCHAR(10) NOT NULL,
    meta_title VARCHAR(150),
    meta_description VARCHAR(255),
    canonical_url VARCHAR(2048),
    robots VARCHAR(50) DEFAULT 'index, follow',
    schema_markup JSONB DEFAULT NULL,
    opengraph_tags JSONB DEFAULT NULL,
    twitter_cards JSONB DEFAULT NULL,
    aeo_questions JSONB DEFAULT NULL,
    geo_entity_linking JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_type, entity_id, language_code)
);

-- =============================================================================
-- 9. CREATE RELATIONSHIPS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_relations (
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    related_product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'related',
    PRIMARY KEY (product_id, related_product_id, type)
);

-- =============================================================================
-- 10. CREATE CMS & ARTICLES TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    featured_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    author_id INT REFERENCES admins(id) ON DELETE SET NULL,
    published_status VARCHAR(50) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS article_translations (
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    slug VARCHAR(255) NOT NULL,
    summary TEXT,
    content_blocks JSONB NOT NULL,
    PRIMARY KEY (article_id, language_code)
);

-- =============================================================================
-- 11. CREATE STATIC PAGES TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS pages (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    published_status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS page_translations (
    page_id BIGINT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    layout_data JSONB NOT NULL,
    PRIMARY KEY (page_id, language_code)
);

-- =============================================================================
-- 12. CREATE REVISIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS entity_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    revision_number INT NOT NULL,
    data_snapshot JSONB NOT NULL,
    reason TEXT DEFAULT NULL,
    created_by INT REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 13. CREATE BULK IMPORT LOGGER
-- =============================================================================
CREATE TABLE IF NOT EXISTS imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_rows INT NOT NULL DEFAULT 0,
    processed_rows INT NOT NULL DEFAULT 0,
    failed_rows INT NOT NULL DEFAULT 0,
    created_by INT REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    sku VARCHAR(100),
    is_successful BOOLEAN NOT NULL,
    error_message TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 14. CREATE SEARCH ANALYTICS
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query VARCHAR(255) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    results_count INT NOT NULL DEFAULT 0,
    is_success BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 15. INDEX OPTIMIZATION
-- =============================================================================

-- Foreign Keys Indexes
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_media_variant_id ON variant_media(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_media_media_id ON variant_media(media_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_id ON product_tags(tag_id);

-- Soft delete indices (Partial)
CREATE INDEX IF NOT EXISTS idx_products_active ON products(created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(display_order) WHERE deleted_at IS NULL;

-- Trigram gin indexes for fast autocomplete
CREATE INDEX IF NOT EXISTS idx_product_trans_name_trgm ON product_translations USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_trans_slug_trgm ON product_translations USING gin (slug gin_trgm_ops);

-- Language Aware FTS indexes
CREATE INDEX IF NOT EXISTS idx_product_fts_en ON product_translations 
USING gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(material, '') || ' ' || coalesce(description, '')))
WHERE language_code = 'en';

CREATE INDEX IF NOT EXISTS idx_product_fts_ar ON product_translations 
USING gin (to_tsvector('arabic', coalesce(name, '') || ' ' || coalesce(material, '') || ' ' || coalesce(description, '')))
WHERE language_code = 'ar';
