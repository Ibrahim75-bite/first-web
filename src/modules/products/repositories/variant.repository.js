import pool from "../../../core/database/db.js";

export class VariantRepository {
    async findById(id) {
        const query = `SELECT id, product_id, sku, color_name_en, color_name_ar, color_code, min_order_qty FROM product_variants WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async countByProductId(client, productId) {
        const query = `SELECT COUNT(*) AS cnt FROM product_variants WHERE product_id = $1`;
        const result = await client.query(query, [productId]);
        return parseInt(result.rows[0].cnt, 10);
    }

    async findBySku(client, sku) {
        const query = `SELECT id, product_id, sku FROM product_variants WHERE sku = $1`;
        const result = await client.query(query, [sku]);
        return result.rows[0] || null;
    }

    async insert(client, { productId, sku, color_en, color_ar, color_code = null }) {
        const query = `
            INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar, color_code)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const result = await client.query(query, [productId, sku, color_en, color_ar, color_code]);
        return result.rows[0].id;
    }

    async update(id, { sku, color_name_en, color_name_ar, color_code }) {
        const updates = [];
        const values = [];
        let idx = 1;

        if (sku !== undefined) { updates.push(`sku = $${idx++}`); values.push(sku); }
        if (color_name_en !== undefined) { updates.push(`color_name_en = $${idx++}`); values.push(color_name_en); }
        if (color_name_ar !== undefined) { updates.push(`color_name_ar = $${idx++}`); values.push(color_name_ar); }
        if (color_code !== undefined) { updates.push(`color_code = $${idx++}`); values.push(color_code); }

        if (updates.length > 0) {
            values.push(id);
            const query = `UPDATE product_variants SET ${updates.join(", ")} WHERE id = $${idx}`;
            await pool.query(query, values);
            return true;
        }
        return false;
    }

    async delete(id) {
        const query = `DELETE FROM product_variants WHERE id = $1 RETURNING id, sku`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async getImagesForVariant(id) {
        const query = `SELECT id, image_name FROM variant_images WHERE variant_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    }

    async insertImage(variantId, imageName, displayOrder = 1) {
        const query = `
            INSERT INTO variant_images (variant_id, image_name, display_order)
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const result = await pool.query(query, [variantId, imageName, displayOrder]);
        return result.rows[0].id;
    }

    async deleteImage(id) {
        const query = `DELETE FROM variant_images WHERE id = $1 RETURNING id, image_name`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
}

export const variantRepository = new VariantRepository();
export default variantRepository;
