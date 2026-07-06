import pool from "../../core/database/db.js";

export class InquiryRepository {
    async checkSkusExist(skus) {
        const query = `SELECT sku FROM product_variants WHERE sku = ANY($1)`;
        const result = await pool.query(query, [skus]);
        return result.rows.map(r => r.sku);
    }

    async insert({ customer_name, customer_email, customer_phone, customer_company, message, items }) {
        const query = `
            INSERT INTO inquiries (customer_name, customer_email, customer_phone, customer_company, message, items)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, created_at
        `;
        const result = await pool.query(query, [
            customer_name,
            customer_email,
            customer_phone,
            customer_company,
            message,
            JSON.stringify(items)
        ]);
        return result.rows[0];
    }

    async list({ status, limit, offset }) {
        let query = `SELECT * FROM inquiries`;
        const params = [];

        if (status) {
            query += ` WHERE status = $1`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        return result.rows;
    }

    async count({ status }) {
        let query = `SELECT COUNT(*) as total FROM inquiries`;
        const params = [];

        if (status) {
            query += ` WHERE status = $1`;
            params.push(status);
        }

        const result = await pool.query(query, params);
        return parseInt(result.rows[0].total, 10);
    }

    async updateStatus(id, status) {
        const query = `
            UPDATE inquiries 
            SET status = $1, updated_at = NOW() 
            WHERE id = $2 
            RETURNING id, status, updated_at
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0] || null;
    }
}

export const inquiryRepository = new InquiryRepository();
export default inquiryRepository;
