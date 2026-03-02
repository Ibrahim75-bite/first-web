import express from "express";
import { body, validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Shared constants
const BASE_URL = process.env.BASE_URL.replace(/\/+$/, "");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "images");
const THUMBS_DIR = path.join(__dirname, "..", "uploads", "images", "thumbnails");

// Import helpers from server scope (passed via factory)
let generateUniqueSlug, getCached, setCache, clearProductCache;

function init(deps) {
    generateUniqueSlug = deps.generateUniqueSlug;
    getCached = deps.getCached;
    setCache = deps.setCache;
    clearProductCache = deps.clearProductCache;
}

// =============================================================================
// Helper: Build image object from row (consistent across all routes)
// =============================================================================
function buildImageObject(imageName) {
    const imageUrl = `${BASE_URL}/images/${imageName}`;
    const thumbName = `thumb_${path.parse(imageName).name}.webp`;
    const thumbnailUrl = `${BASE_URL}/images/thumbnails/${thumbName}`;
    return {
        url: imageUrl,
        thumbnail: fs.existsSync(path.join(THUMBS_DIR, thumbName)) ? thumbnailUrl : null
    };
}

// =============================================================================
// Helper: Group SQL rows into structured product (reused by /:id, /slug/:slug, list)
// =============================================================================
function groupRowsIntoProduct(rows, lang) {
    const first = rows[0];
    const product = {
        product_id: first.product_id,
        model_sku: first.model_sku,
        slug: first.product_slug || first.slug || null,
        weight: parseFloat(first.weight),
        height: parseFloat(first.height),
        name: first.name,
        material: first.material,
        description: first.description,
        meta_title: first.meta_title || null,
        meta_description: first.meta_description || null,
        variants: {},
        tags: {}
    };

    const imagesSeen = {};

    for (const row of rows) {
        // Tags
        if (row.tag_slug) {
            product.tags[row.tag_slug] = {
                slug: row.tag_slug,
                name: row.tag_name
            };
        }

        // Variants
        if (row.variant_id) {
            if (!product.variants[row.variant_id]) {
                product.variants[row.variant_id] = {
                    variant_id: row.variant_id,
                    sku: row.sku,
                    color_code: row.color_code || null,
                    color: lang === "ar" ? row.color_name_ar : row.color_name_en,
                    min_order_qty: row.min_order_qty || 1,
                    images: []
                };
                imagesSeen[row.variant_id] = new Set();
            }

            if (row.image_name) {
                const imgObj = buildImageObject(row.image_name);
                if (!imagesSeen[row.variant_id].has(imgObj.url)) {
                    imagesSeen[row.variant_id].add(imgObj.url);
                    product.variants[row.variant_id].images.push(imgObj);
                }
            }
        }
    }

    return {
        ...product,
        variants: Object.values(product.variants),
        tags: Object.values(product.tags)
    };
}

// =============================================================================
// Full product SELECT query (with tags) — reused by /:id and /slug/:slug
// =============================================================================
const FULL_PRODUCT_SELECT = `
    SELECT
      p.id AS product_id,
      p.model_code AS model_sku,
      p.weight,
      p.height,
      t.name,
      t.slug AS product_slug,
      t.material,
      t.description,
      t.meta_title,
      t.meta_description,
      v.id AS variant_id,
      v.sku,
      v.color_code,
      v.color_name_en,
      v.color_name_ar,
      v.min_order_qty,
      i.image_name,
      tg.slug AS tag_slug,
      tt.name AS tag_name
`;

// =============================================================================
// ROUTE ORDER (critical for Express matching):
//   1. GET /slug/:slug   (literal "slug" path segment — must come before /:id)
//   2. GET /:id/admin    (literal "admin" after param — must come before /:id)
//   3. GET /:id          (param catch-all — comes last among GETs with params)
//   4. GET /             (paginated list)
//   5. POST /            (create product)
//   6. PUT /:id          (update)
//   7. DELETE /:id       (delete)
//   8. POST /:id/tags    (link tags)
//   9. DELETE /:id/tags/:tagId (unlink tag)
// =============================================================================

// -----------------------------------------------------------------------------
// 1. GET /slug/:slug — Single product by slug
// -----------------------------------------------------------------------------
router.get("/slug/:slug", async (req, res) => {
    try {
        const slug = (req.params.slug || "").trim();
        const { lang = "en" } = req.query;

        if (!slug) {
            return res.status(400).json({ error: "Slug parameter is required" });
        }

        const cacheKey = `slug:${slug}:${lang}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json(cached);

        const result = await pool.query(`
          ${FULL_PRODUCT_SELECT}
          FROM product_translations t
          JOIN products p ON t.product_id = p.id
          LEFT JOIN product_variants v ON p.id = v.product_id
          LEFT JOIN variant_images i ON v.id = i.variant_id
          LEFT JOIN product_tags pt ON p.id = pt.product_id
          LEFT JOIN tags tg ON pt.tag_id = tg.id
          LEFT JOIN tag_translations tt
            ON tg.id = tt.tag_id AND tt.language_code = $2
          WHERE t.slug = $1
            AND t.language_code = $2
          ORDER BY v.sku ASC, i.display_order ASC
        `, [slug, lang]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Product with slug "${slug}" not found` });
        }

        const product = groupRowsIntoProduct(result.rows, lang);
        setCache(cacheKey, product);
        res.json(product);

    } catch (err) {
        console.error("ERROR IN GET /api/products/slug:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 2. GET /:id/admin — Full bilingual product for admin editing
// -----------------------------------------------------------------------------
router.get("/:id/admin", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const productResult = await pool.query(
            `SELECT id, model_code, weight, height FROM products WHERE id = $1`,
            [id]
        );
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: `Product ${id} not found` });
        }

        const product = productResult.rows[0];

        const translations = await pool.query(
            `SELECT language_code, name, material, description, slug, meta_title, meta_description
             FROM product_translations WHERE product_id = $1`,
            [id]
        );

        const variants = await pool.query(
            `SELECT v.id, v.sku, v.color_name_en, v.color_name_ar, v.color_code,
                    v.min_order_qty
             FROM product_variants v WHERE v.product_id = $1
             ORDER BY v.sku ASC`,
            [id]
        );

        const images = await pool.query(
            `SELECT i.id, i.variant_id, i.image_name, i.display_order
             FROM variant_images i
             JOIN product_variants v ON i.variant_id = v.id
             WHERE v.product_id = $1
             ORDER BY i.variant_id, i.display_order`,
            [id]
        );

        const tags = await pool.query(
            `SELECT tg.id, tg.slug,
                    MAX(CASE WHEN tt.language_code = 'en' THEN tt.name END) AS name_en,
                    MAX(CASE WHEN tt.language_code = 'ar' THEN tt.name END) AS name_ar
             FROM product_tags pt
             JOIN tags tg ON pt.tag_id = tg.id
             LEFT JOIN tag_translations tt ON tg.id = tt.tag_id
             WHERE pt.product_id = $1
             GROUP BY tg.id, tg.slug`,
            [id]
        );

        const imageMap = {};
        for (const img of images.rows) {
            if (!imageMap[img.variant_id]) imageMap[img.variant_id] = [];
            imageMap[img.variant_id].push({
                id: img.id,
                image_name: img.image_name,
                display_order: img.display_order,
                ...buildImageObject(img.image_name)
            });
        }

        const translationMap = {};
        for (const t of translations.rows) {
            translationMap[t.language_code] = t;
        }

        res.json({
            ...product,
            weight: parseFloat(product.weight),
            height: parseFloat(product.height),
            translations: translationMap,
            variants: variants.rows.map(v => ({
                ...v,
                images: imageMap[v.id] || []
            })),
            tags: tags.rows
        });

    } catch (err) {
        console.error("ERROR IN GET /api/products/:id/admin:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 3. GET /:id — Single product by ID (same structure as paginated list items)
// -----------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { lang = "en" } = req.query;

        const result = await pool.query(`
          ${FULL_PRODUCT_SELECT}
          FROM products p
          JOIN product_translations t
            ON p.id = t.product_id AND t.language_code = $1
          LEFT JOIN product_variants v
            ON p.id = v.product_id
          LEFT JOIN variant_images i
            ON v.id = i.variant_id
          LEFT JOIN product_tags pt
            ON p.id = pt.product_id
          LEFT JOIN tags tg
            ON pt.tag_id = tg.id
          LEFT JOIN tag_translations tt
            ON tg.id = tt.tag_id AND tt.language_code = $1
          WHERE p.id = $2
          ORDER BY v.sku ASC, i.display_order ASC
        `, [lang, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const product = groupRowsIntoProduct(result.rows, lang);
        res.json(product);

    } catch (err) {
        console.error("ERROR IN GET /api/products/:id:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 4. GET / — Paginated product list (search, tags, featured filter)
// -----------------------------------------------------------------------------
router.get("/", async (req, res) => {
    try {
        const {
            lang = "en",
            search = null,
            tags = null
        } = req.query;

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const offset = (page - 1) * limit;
        const featured = req.query.featured === "true";

        let effectiveTags = tags;
        if (featured) {
            effectiveTags = effectiveTags ? `${effectiveTags},featured` : "featured";
        }
        const tagList = effectiveTags ? effectiveTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : null;

        const cacheKey = `products:${lang}:${search}:${effectiveTags}:${page}:${limit}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json(cached);

        const whereClause = `
          WHERE t.language_code = $1
            AND (
              $2::text IS NULL OR
              t.search_vector @@
                CASE
                  WHEN t.language_code = 'en'
                    THEN plainto_tsquery('english', $2)
                  WHEN t.language_code = 'ar'
                    THEN plainto_tsquery('arabic', $2)
                  ELSE plainto_tsquery('simple', $2)
                END
            )
            AND (
              $3::text[] IS NULL OR
              EXISTS (
                SELECT 1
                FROM product_tags pt2
                JOIN tags tg2 ON pt2.tag_id = tg2.id
                WHERE pt2.product_id = p.id
                  AND tg2.slug = ANY($3)
              )
            )
        `;

        const baseParams = [lang, search, tagList];

        const [idResult, countResult] = await Promise.all([
            pool.query(`
              SELECT DISTINCT p.id, p.model_code,
                CASE
                  WHEN $2::text IS NULL THEN 0
                  WHEN t.language_code = 'en'
                    THEN ts_rank_cd(t.search_vector, plainto_tsquery('english', $2))
                  WHEN t.language_code = 'ar'
                    THEN ts_rank_cd(t.search_vector, plainto_tsquery('arabic', $2))
                  ELSE
                    ts_rank_cd(t.search_vector, plainto_tsquery('simple', $2))
                END AS rank
              FROM products p
              JOIN product_translations t ON p.id = t.product_id
              ${whereClause}
              ORDER BY rank DESC, p.model_code ASC
              LIMIT $4 OFFSET $5
            `, [...baseParams, limit, offset]),

            pool.query(`
              SELECT COUNT(DISTINCT p.id) AS total
              FROM products p
              JOIN product_translations t ON p.id = t.product_id
              ${whereClause}
            `, baseParams)
        ]);

        let productIds = idResult.rows.map(r => r.id);
        const total = parseInt(countResult.rows[0].total, 10);

        // Fuzzy search fallback (pg_trgm)
        if (productIds.length === 0 && search) {
            const fuzzyResult = await pool.query(`
              SELECT DISTINCT p.id, p.model_code,
                similarity(t.name, $2) AS sim
              FROM products p
              JOIN product_translations t ON p.id = t.product_id
              WHERE t.language_code = $1
                AND similarity(t.name, $2) > 0.2
              ORDER BY sim DESC, p.model_code ASC
              LIMIT $3 OFFSET $4
            `, [lang, search, limit, offset]);

            productIds = fuzzyResult.rows.map(r => r.id);
        }

        if (productIds.length === 0) {
            const emptyResponse = { page, limit, total, totalPages: Math.ceil(total / limit), data: [] };
            setCache(cacheKey, emptyResponse);
            return res.json(emptyResponse);
        }

        const idOrderMap = {};
        productIds.forEach((id, idx) => { idOrderMap[id] = idx; });

        const result = await pool.query(`
          ${FULL_PRODUCT_SELECT}
          FROM products p
          JOIN product_translations t
            ON p.id = t.product_id AND t.language_code = $1
          LEFT JOIN product_variants v
            ON p.id = v.product_id
          LEFT JOIN variant_images i
            ON v.id = i.variant_id
          LEFT JOIN product_tags pt
            ON p.id = pt.product_id
          LEFT JOIN tags tg
            ON pt.tag_id = tg.id
          LEFT JOIN tag_translations tt
            ON tg.id = tt.tag_id AND tt.language_code = $1
          WHERE p.id = ANY($2)
          ORDER BY p.model_code ASC, v.sku ASC, i.display_order ASC
        `, [lang, productIds]);

        const rows = result.rows;
        const productsMap = {};

        for (const row of rows) {
            if (!productsMap[row.product_id]) {
                productsMap[row.product_id] = { rows: [] };
            }
            productsMap[row.product_id].rows.push(row);
        }

        const finalProducts = Object.values(productsMap)
            .map(({ rows: pRows }) => groupRowsIntoProduct(pRows, lang))
            .sort((a, b) => idOrderMap[a.product_id] - idOrderMap[b.product_id]);

        const response = { page, limit, total, totalPages: Math.ceil(total / limit), data: finalProducts };
        setCache(cacheKey, response);
        res.json(response);

    } catch (err) {
        console.error("ERROR IN GET /api/products:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 5. POST / — Create product/variant
// -----------------------------------------------------------------------------
router.post("/", authMiddleware, [
    body("model_code").notEmpty().withMessage("Model code is required").trim(),
    body("sku")
        .notEmpty().withMessage("SKU is required")
        .matches(/^[a-zA-Z0-9-]+$/).withMessage("SKU must be alphanumeric with hyphens only")
        .trim(),
    body("name_en").notEmpty().withMessage("English name is required").trim().escape(),
    body("name_ar").notEmpty().withMessage("Arabic name is required").trim(),
    body("material_en").notEmpty().withMessage("English material is required").trim().escape(),
    body("material_ar").notEmpty().withMessage("Arabic material is required").trim(),
    body("description_en").notEmpty().withMessage("English description is required").trim(),
    body("description_ar").notEmpty().withMessage("Arabic description is required").trim(),
    body("color_en").notEmpty().withMessage("English color is required").trim().escape(),
    body("color_ar").notEmpty().withMessage("Arabic color is required").trim(),
    body("weight").isFloat({ min: 0.01 }).withMessage("Weight must be a positive number").toFloat(),
    body("height").isFloat({ min: 0.01 }).withMessage("Height must be a positive number").toFloat()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const {
        model_code, weight, height,
        name_en, name_ar, material_en, material_ar,
        description_en, description_ar,
        sku, color_en, color_ar
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let productResult = await client.query(
            `SELECT id FROM products WHERE model_code = $1`, [model_code]
        );

        let productId;

        if (productResult.rows.length === 0) {
            const insertResult = await client.query(
                `INSERT INTO products (model_code, weight, height) VALUES ($1, $2, $3) RETURNING id`,
                [model_code, weight, height]
            );
            productId = insertResult.rows[0].id;

            const slugEn = await generateUniqueSlug(client, name_en, "en");
            const slugAr = await generateUniqueSlug(client, name_ar, "ar");

            await client.query(
                `INSERT INTO product_translations
                 (product_id, language_code, name, material, description, slug)
                 VALUES
                 ($1, 'en', $2, $3, $4, $8),
                 ($1, 'ar', $5, $6, $7, $9)`,
                [productId, name_en, material_en, description_en, name_ar, material_ar, description_ar, slugEn, slugAr]
            );
        } else {
            productId = productResult.rows[0].id;
        }

        const variantCheck = await client.query(
            `SELECT id FROM product_variants WHERE sku = $1`, [sku]
        );

        if (variantCheck.rows.length === 0) {
            // Enforce max 4 variants per product
            const variantCount = await client.query(
                `SELECT COUNT(*) AS cnt FROM product_variants WHERE product_id = $1`, [productId]
            );
            if (parseInt(variantCount.rows[0].cnt, 10) >= 4) {
                await client.query("ROLLBACK");
                return res.status(400).json({
                    error: `Product ${model_code} already has 4 variants (maximum reached)`
                });
            }

            await client.query(
                `INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar)
                 VALUES ($1, $2, $3, $4)`,
                [productId, sku, color_en, color_ar]
            );
        }

        await client.query("COMMIT");
        clearProductCache();
        res.json({ message: "Product/Variant processed successfully" });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Product creation failed" });
    } finally {
        client.release();
    }
});

// -----------------------------------------------------------------------------
// 6. PUT /:id — Update product (partial bilingual)
// -----------------------------------------------------------------------------
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const {
        model_code, weight, height,
        name_en, name_ar, material_en, material_ar,
        description_en, description_ar,
        meta_title_en, meta_title_ar,
        meta_description_en, meta_description_ar
    } = req.body;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const existing = await client.query(`SELECT id FROM products WHERE id = $1`, [id]);
        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: `Product ${id} not found` });
        }

        // Update products table
        const productUpdates = [];
        const productValues = [];
        let paramIdx = 1;

        if (model_code !== undefined) { productUpdates.push(`model_code = $${paramIdx++}`); productValues.push(model_code); }
        if (weight !== undefined) { productUpdates.push(`weight = $${paramIdx++}`); productValues.push(weight); }
        if (height !== undefined) { productUpdates.push(`height = $${paramIdx++}`); productValues.push(height); }

        if (productUpdates.length > 0) {
            productValues.push(id);
            await client.query(
                `UPDATE products SET ${productUpdates.join(", ")} WHERE id = $${paramIdx}`,
                productValues
            );
        }

        // Update English translation
        const enUpdates = [];
        const enValues = [];
        let enIdx = 1;

        if (name_en !== undefined) { enUpdates.push(`name = $${enIdx++}`); enValues.push(name_en); }
        if (material_en !== undefined) { enUpdates.push(`material = $${enIdx++}`); enValues.push(material_en); }
        if (description_en !== undefined) { enUpdates.push(`description = $${enIdx++}`); enValues.push(description_en); }
        if (meta_title_en !== undefined) { enUpdates.push(`meta_title = $${enIdx++}`); enValues.push(meta_title_en); }
        if (meta_description_en !== undefined) { enUpdates.push(`meta_description = $${enIdx++}`); enValues.push(meta_description_en); }

        if (name_en !== undefined) {
            enUpdates.push(`slug = $${enIdx++}`);
            enValues.push(await generateUniqueSlug(client, name_en, "en"));
        }

        if (enUpdates.length > 0) {
            enValues.push(id);
            await client.query(
                `UPDATE product_translations SET ${enUpdates.join(", ")}
                 WHERE product_id = $${enIdx} AND language_code = 'en'`,
                enValues
            );
        }

        // Update Arabic translation
        const arUpdates = [];
        const arValues = [];
        let arIdx = 1;

        if (name_ar !== undefined) { arUpdates.push(`name = $${arIdx++}`); arValues.push(name_ar); }
        if (material_ar !== undefined) { arUpdates.push(`material = $${arIdx++}`); arValues.push(material_ar); }
        if (description_ar !== undefined) { arUpdates.push(`description = $${arIdx++}`); arValues.push(description_ar); }
        if (meta_title_ar !== undefined) { arUpdates.push(`meta_title = $${arIdx++}`); arValues.push(meta_title_ar); }
        if (meta_description_ar !== undefined) { arUpdates.push(`meta_description = $${arIdx++}`); arValues.push(meta_description_ar); }

        if (name_ar !== undefined) {
            arUpdates.push(`slug = $${arIdx++}`);
            arValues.push(await generateUniqueSlug(client, name_ar, "ar"));
        }

        if (arUpdates.length > 0) {
            arValues.push(id);
            await client.query(
                `UPDATE product_translations SET ${arUpdates.join(", ")}
                 WHERE product_id = $${arIdx} AND language_code = 'ar'`,
                arValues
            );
        }

        await client.query("COMMIT");
        clearProductCache();
        res.json({ message: `Product ${id} updated successfully` });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("ERROR IN PUT /api/products:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// -----------------------------------------------------------------------------
// 7. DELETE /:id — Delete product (cascade)
// -----------------------------------------------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const images = await pool.query(`
          SELECT i.image_name
          FROM variant_images i
          JOIN product_variants v ON i.variant_id = v.id
          WHERE v.product_id = $1
        `, [id]);

        const result = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING id, model_code`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Product ${id} not found` });
        }

        for (const img of images.rows) {
            const imgPath = path.join(UPLOADS_DIR, img.image_name);
            const thumbName = `thumb_${path.parse(img.image_name).name}.webp`;
            const thumbPath = path.join(THUMBS_DIR, thumbName);

            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
        }

        clearProductCache();
        res.json({
            message: `Product ${result.rows[0].model_code} and all related data deleted`,
            deleted_images: images.rows.length
        });

    } catch (err) {
        console.error("ERROR IN DELETE /api/products:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 8. POST /:id/tags — Link tags to product
// -----------------------------------------------------------------------------
router.post("/:id/tags", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { tag_slugs } = req.body;

    if (!tag_slugs || !Array.isArray(tag_slugs) || tag_slugs.length === 0) {
        return res.status(400).json({ error: "tag_slugs must be a non-empty array" });
    }

    try {
        const productCheck = await pool.query(`SELECT id FROM products WHERE id = $1`, [id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: `Product ${id} not found` });
        }

        const linked = [];
        const notFound = [];

        for (const slug of tag_slugs) {
            const tagResult = await pool.query(`SELECT id FROM tags WHERE slug = $1`, [slug.trim().toLowerCase()]);

            if (tagResult.rows.length === 0) {
                notFound.push(slug);
                continue;
            }

            const tagId = tagResult.rows[0].id;
            const existing = await pool.query(
                `SELECT 1 FROM product_tags WHERE product_id = $1 AND tag_id = $2`, [id, tagId]
            );

            if (existing.rows.length === 0) {
                await pool.query(`INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2)`, [id, tagId]);
                linked.push(slug);
            }
        }

        clearProductCache();
        res.json({
            message: "Tags linked",
            linked,
            not_found: notFound.length > 0 ? notFound : undefined
        });

    } catch (err) {
        console.error("ERROR IN POST /api/products/:id/tags:", err);
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------------------------------------------------------
// 9. DELETE /:id/tags/:tagId — Unlink tag from product
// -----------------------------------------------------------------------------
router.delete("/:id/tags/:tagId", authMiddleware, async (req, res) => {
    const { id, tagId } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM product_tags WHERE product_id = $1 AND tag_id = $2 RETURNING *`,
            [id, tagId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tag link not found for this product" });
        }

        clearProductCache();
        res.json({ message: `Tag ${tagId} unlinked from product ${id}` });

    } catch (err) {
        console.error("ERROR IN DELETE /api/products/:id/tags:", err);
        res.status(500).json({ error: err.message });
    }
});

export default { router, init };
