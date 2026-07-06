import pool from "../../../core/database/db.js";

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

export class ProductRepository {
    async findById(id, lang) {
        const query = `
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
        `;
        const result = await pool.query(query, [lang, id]);
        return result.rows;
    }

    async findBySlug(slug, lang) {
        // Find product ID and actual language code for validation
        const lookupQuery = `
            SELECT product_id, language_code 
            FROM product_translations 
            WHERE slug = $1 LIMIT 1
        `;
        const lookup = await pool.query(lookupQuery, [slug]);
        if (lookup.rows.length === 0) return null;

        const { product_id, language_code: targetLang } = lookup.rows[0];
        const activeLang = lang || targetLang;

        const query = `
          ${FULL_PRODUCT_SELECT}
          FROM products p
          JOIN product_translations t ON p.id = t.product_id
          LEFT JOIN product_variants v ON p.id = v.product_id
          LEFT JOIN variant_images i ON v.id = i.variant_id
          LEFT JOIN product_tags pt ON p.id = pt.product_id
          LEFT JOIN tags tg ON pt.tag_id = tg.id
          LEFT JOIN tag_translations tt
            ON tg.id = tt.tag_id AND tt.language_code = $2
          WHERE p.id = $1
            AND t.language_code = $2
          ORDER BY v.sku ASC, i.display_order ASC
        `;

        const result = await pool.query(query, [product_id, activeLang]);
        
        if (result.rows.length === 0) {
            // Fallback to original slug translation language
            const fallbackQuery = `
              ${FULL_PRODUCT_SELECT}
              FROM products p
              JOIN product_translations t ON p.id = t.product_id
              LEFT JOIN product_variants v ON p.id = v.product_id
              LEFT JOIN variant_images i ON v.id = i.variant_id
              LEFT JOIN product_tags pt ON p.id = pt.product_id
              LEFT JOIN tags tg ON pt.tag_id = tg.id
              LEFT JOIN tag_translations tt
                ON tg.id = tt.tag_id AND tt.language_code = $3
              WHERE p.id = $1
                AND t.language_code = $3
              ORDER BY v.sku ASC, i.display_order ASC
            `;
            const fallbackResult = await pool.query(fallbackQuery, [product_id, activeLang, targetLang]);
            return { rows: fallbackResult.rows, language: targetLang };
        }

        return { rows: result.rows, language: activeLang };
    }

    async findAdminDetailsById(id) {
        const productResult = await pool.query(
            `SELECT id, model_code, weight, height FROM products WHERE id = $1`,
            [id]
        );
        if (productResult.rows.length === 0) return null;

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

        return {
            product,
            translations: translations.rows,
            variants: variants.rows,
            images: images.rows,
            tags: tags.rows
        };
    }

    async listIds({ lang, search, tagList, limit, offset }) {
        const whereClause = this._buildWhereClause();
        const baseParams = [lang, search, tagList];

        const query = `
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
        `;

        const result = await pool.query(query, [...baseParams, limit, offset]);
        return result.rows;
    }

    async count({ lang, search, tagList }) {
        const whereClause = this._buildWhereClause();
        const baseParams = [lang, search, tagList];

        const query = `
          SELECT COUNT(DISTINCT p.id) AS total
          FROM products p
          JOIN product_translations t ON p.id = t.product_id
          ${whereClause}
        `;

        const result = await pool.query(query, baseParams);
        return parseInt(result.rows[0].total, 10);
    }

    async listFuzzyIds({ lang, search, limit, offset }) {
        const query = `
          SELECT DISTINCT p.id, p.model_code,
            similarity(t.name, $2) AS sim
          FROM products p
          JOIN product_translations t ON p.id = t.product_id
          WHERE t.language_code = $1
            AND similarity(t.name, $2) > 0.2
          ORDER BY sim DESC, p.model_code ASC
          LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [lang, search, limit, offset]);
        return result.rows;
    }

    async getFullProductsForIds(lang, productIds) {
        const query = `
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
        `;
        const result = await pool.query(query, [lang, productIds]);
        return result.rows;
    }

    async checkExists(client, id) {
        const query = `SELECT 1 FROM products WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows.length > 0;
    }

    async findByModelCode(client, modelCode) {
        const query = `SELECT id FROM products WHERE model_code = $1`;
        const result = await client.query(query, [modelCode]);
        return result.rows[0] || null;
    }

    async insert(client, { model_code, weight, height }) {
        const query = `
            INSERT INTO products (model_code, weight, height)
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const result = await client.query(query, [model_code, weight, height]);
        return result.rows[0].id;
    }

    async insertTranslations(client, { productId, name_en, name_ar, material_en, material_ar, description_en, description_ar, slugEn, slugAr }) {
        const query = `
            INSERT INTO product_translations
            (product_id, language_code, name, material, description, slug)
            VALUES
            ($1, 'en', $2, $3, $4, $8),
            ($1, 'ar', $5, $6, $7, $9)
        `;
        await client.query(query, [productId, name_en, material_en, description_en, name_ar, material_ar, description_ar, slugEn, slugAr]);
    }

    async update(client, id, { model_code, weight, height }) {
        const updates = [];
        const values = [];
        let idx = 1;

        if (model_code !== undefined) { updates.push(`model_code = $${idx++}`); values.push(model_code); }
        if (weight !== undefined) { updates.push(`weight = $${idx++}`); values.push(weight); }
        if (height !== undefined) { updates.push(`height = $${idx++}`); values.push(height); }

        if (updates.length > 0) {
            values.push(id);
            const query = `UPDATE products SET ${updates.join(", ")} WHERE id = $${idx}`;
            await client.query(query, values);
        }
    }

    async updateTranslation(client, id, lang, { name, material, description, slug, meta_title, meta_description }) {
        const updates = [];
        const values = [];
        let idx = 1;

        if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
        if (material !== undefined) { updates.push(`material = $${idx++}`); values.push(material); }
        if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
        if (meta_title !== undefined) { updates.push(`meta_title = $${idx++}`); values.push(meta_title); }
        if (meta_description !== undefined) { updates.push(`meta_description = $${idx++}`); values.push(meta_description); }
        if (slug !== undefined) { updates.push(`slug = $${idx++}`); values.push(slug); }

        if (updates.length > 0) {
            values.push(id, lang);
            const query = `
                UPDATE product_translations 
                SET ${updates.join(", ")}
                WHERE product_id = $${idx} AND language_code = $${idx + 1}
            `;
            await client.query(query, values);
        }
    }

    async delete(client, id) {
        const query = `DELETE FROM products WHERE id = $1 RETURNING id, model_code`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    async getImagesForProduct(id) {
        const query = `
          SELECT i.image_name
          FROM variant_images i
          JOIN product_variants v ON i.variant_id = v.id
          WHERE v.product_id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    }

    _buildWhereClause() {
        return `
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
    }
}

export const productRepository = new ProductRepository();
export default productRepository;
