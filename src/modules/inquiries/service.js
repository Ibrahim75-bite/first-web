import pool from "../../core/database/db.js";
import defaultInquiryRepository from "./repository.js";
import { NotFoundError, ValidationError } from "../../core/common/error.js";

/**
 * Enterprise Inquiry Service (ARCH-01, ARCH-03, ARCH-07 remediated)
 */
export class InquiryService {
    constructor({
        inquiryRepo = defaultInquiryRepository,
        dbPool = pool
    } = {}) {
        this.inquiryRepo = inquiryRepo;
        this.db = dbPool;
    }

    async submit(data) {
        const { items, customer_name, customer_email } = data;
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new ValidationError("At least one item is required in the inquiry");
        }

        const skus = items.map(i => i.sku);
        const variantRows = await this.inquiryRepo.checkSkusExist(skus, this.db);
        const variantMap = new Map(variantRows.map(r => [r.sku, r]));

        const invalidSkus = [];
        const moqFailures = [];

        for (const item of items) {
            const variant = variantMap.get(item.sku);
            if (!variant) {
                invalidSkus.push(item.sku);
            } else {
                const minQty = variant.min_order_qty || 1;
                if (item.quantity < minQty) {
                    moqFailures.push({
                        sku: item.sku,
                        requested_quantity: item.quantity,
                        min_order_qty: minQty
                    });
                }
            }
        }

        if (invalidSkus.length > 0) {
            throw new ValidationError("Invalid SKUs provided", { invalid_skus: invalidSkus });
        }

        if (moqFailures.length > 0) {
            throw new ValidationError("Minimum Order Quantity (MOQ) requirement not met for item(s)", { moq_failures: moqFailures });
        }

        const inserted = await this.inquiryRepo.insert({
            customer_name,
            customer_email,
            customer_phone: data.customer_phone || null,
            customer_company: data.customer_company || null,
            message: data.message || null,
            items
        }, this.db);

        return {
            message: "Inquiry submitted successfully. We will get back to you soon.",
            inquiry_id: inserted.id,
            created_at: inserted.created_at
        };
    }

    async list({ status, page, limit }) {
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const offset = (safePage - 1) * safeLimit;

        const [inquiries, total] = await Promise.all([
            this.inquiryRepo.list({ status, limit: safeLimit, offset }, this.db),
            this.inquiryRepo.count({ status }, this.db)
        ]);

        return {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
            data: inquiries
        };
    }

    async updateStatus(id, status) {
        const updated = await this.inquiryRepo.updateStatus(id, status, this.db);
        if (!updated) {
            throw new NotFoundError(`Inquiry ${id} not found`);
        }
        return {
            message: `Inquiry ${id} status updated to "${status}"`,
            inquiry: updated
        };
    }
}

export const inquiryService = new InquiryService();
export default inquiryService;
