import crypto from "crypto";
import pool from "../../core/database/db.js";

/**
 * Enterprise Repository for Inquiries (ARCH-01 & ARCH-07 remediated)
 */
export class InquiryRepository {
    async checkSkusExist(skus, db = pool) {
        const query = `SELECT sku, min_order_qty FROM product_variants WHERE sku = ANY($1)`;
        const result = await db.query(query, [skus]);
        return result.rows;
    }

    async insert({ customer_name, customer_email, customer_phone, customer_company, message, items }, db = pool) {
        const query = `
            INSERT INTO inquiries (inquiry_number, customer_name, customer_email, customer_phone, customer_company, message, items)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, inquiry_number, created_at
        `;
        // Cryptographically secure collision-resistant reference identifier (ARCH-07)
        const hexSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
        const inquiryNumber = `INQ-${Date.now()}-${hexSuffix}`;

        const result = await db.query(query, [
            inquiryNumber,
            customer_name,
            customer_email,
            customer_phone || null,
            customer_company || null,
            message || null,
            JSON.stringify(items)
        ]);
        return result.rows[0];
    }

    async list({ status, limit, offset }, db = pool) {
        let query = `SELECT * FROM inquiries`;
        const params = [];

        if (status) {
            query += ` WHERE status = $1`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    async count({ status }, db = pool) {
        let query = `SELECT COUNT(*) as total FROM inquiries`;
        const params = [];

        if (status) {
            query += ` WHERE status = $1`;
            params.push(status);
        }

        const result = await db.query(query, params);
        return parseInt(result.rows[0].total, 10);
    }

    async updateStatus(id, status, db = pool) {
        const query = `
            UPDATE inquiries 
            SET status = $1 
            WHERE id = $2 
            RETURNING id, status
        `;
        const result = await db.query(query, [status, id]);
        return result.rows[0] || null;
    }
}

export const inquiryRepository = new InquiryRepository();
export default inquiryRepository;
