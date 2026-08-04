import pool from "../../../core/database/db.js";

/**
 * Enterprise Tag Repository supporting unified transaction client parameter (ARCH-01 & ARCH-05 remediated)
 */
export class TagRepository {
    async listAll(lang, db = pool) {
        const query = `
          SELECT
            tg.id,
            tg.slug,
            tt.name,
            tt.language_code
          FROM tags tg
          LEFT JOIN tag_translations tt
            ON tg.id = tt.tag_id AND tt.language_code = $1
          ORDER BY tg.slug ASC
        `;
        const result = await db.query(query, [lang]);
        return result.rows;
    }

    async findBySlug(slug, db = pool) {
        const query = `SELECT id, slug FROM tags WHERE slug = $1`;
        const result = await db.query(query, [slug]);
        return result.rows[0] || null;
    }

    async findById(id, db = pool) {
        const query = `SELECT id, slug FROM tags WHERE id = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    }

    async checkProductTagLink(productId, tagId, db = pool) {
        const query = `SELECT 1 FROM product_tags WHERE product_id = $1 AND tag_id = $2`;
        const result = await db.query(query, [productId, tagId]);
        return result.rows.length > 0;
    }

    async insert(slug, db = pool) {
        const query = `INSERT INTO tags (slug) VALUES ($1) RETURNING id`;
        const result = await db.query(query, [slug]);
        return result.rows[0].id;
    }

    async insertTranslations(tagId, name_en, name_ar, db = pool) {
        const query = `
            INSERT INTO tag_translations (tag_id, language_code, name)
            VALUES ($1, 'en', $2), ($1, 'ar', $3)
        `;
        await db.query(query, [tagId, name_en, name_ar]);
    }

    async update(id, slug, db = pool) {
        const query = `UPDATE tags SET slug = $1 WHERE id = $2`;
        await db.query(query, [slug, id]);
    }

    async updateTranslation(tagId, lang, name, db = pool) {
        const query = `
            UPDATE tag_translations SET name = $1
            WHERE tag_id = $2 AND language_code = $3
        `;
        await db.query(query, [name, tagId, lang]);
    }

    async delete(id, db = pool) {
        const query = `DELETE FROM tags WHERE id = $1 RETURNING id, slug`;
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    }

    async linkProductTag(productId, tagId, db = pool) {
        const query = `INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2)`;
        await db.query(query, [productId, tagId]);
    }

    async unlinkProductTag(productId, tagId, db = pool) {
        const query = `DELETE FROM product_tags WHERE product_id = $1 AND tag_id = $2 RETURNING *`;
        const result = await db.query(query, [productId, tagId]);
        return result.rows[0] || null;
    }
}

export const tagRepository = new TagRepository();
export default tagRepository;
