import pool from "../../../core/database/db.js";

export class TagRepository {
    async listAll(lang) {
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
        const result = await pool.query(query, [lang]);
        return result.rows;
    }

    async findBySlug(slug) {
        const query = `SELECT id, slug FROM tags WHERE slug = $1`;
        const result = await pool.query(query, [slug]);
        return result.rows[0] || null;
    }

    async findById(id) {
        const query = `SELECT id, slug FROM tags WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async checkProductTagLink(productId, tagId) {
        const query = `SELECT 1 FROM product_tags WHERE product_id = $1 AND tag_id = $2`;
        const result = await pool.query(query, [productId, tagId]);
        return result.rows.length > 0;
    }

    async insert(client, slug) {
        const query = `INSERT INTO tags (slug) VALUES ($1) RETURNING id`;
        const result = await client.query(query, [slug]);
        return result.rows[0].id;
    }

    async insertTranslations(client, tagId, name_en, name_ar) {
        const query = `
            INSERT INTO tag_translations (tag_id, language_code, name)
            VALUES ($1, 'en', $2), ($1, 'ar', $3)
        `;
        await client.query(query, [tagId, name_en, name_ar]);
    }

    async update(client, id, slug) {
        const query = `UPDATE tags SET slug = $1 WHERE id = $2`;
        await client.query(query, [slug, id]);
    }

    async updateTranslation(client, tagId, lang, name) {
        const query = `
            UPDATE tag_translations SET name = $1
            WHERE tag_id = $2 AND language_code = $3
        `;
        await client.query(query, [name, tagId, lang]);
    }

    async delete(id) {
        const query = `DELETE FROM tags WHERE id = $1 RETURNING id, slug`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async linkProductTag(productId, tagId) {
        const query = `INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2)`;
        await pool.query(query, [productId, tagId]);
    }

    async unlinkProductTag(productId, tagId) {
        const query = `DELETE FROM product_tags WHERE product_id = $1 AND tag_id = $2 RETURNING *`;
        const result = await pool.query(query, [productId, tagId]);
        return result.rows[0] || null;
    }
}

export const tagRepository = new TagRepository();
export default tagRepository;
