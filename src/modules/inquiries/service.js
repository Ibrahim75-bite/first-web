import inquiryRepository from "./repository.js";
import { NotFoundError, ValidationError } from "../../core/common/error.js";

export class InquiryService {
    async submit(data) {
        const { items } = data;
        const skus = items.map(i => i.sku);

        const dbSkus = await inquiryRepository.checkSkusExist(skus);
        const validSkus = new Set(dbSkus);
        const invalidSkus = skus.filter(s => !validSkus.has(s));

        if (invalidSkus.length > 0) {
            throw new ValidationError("Invalid SKUs provided", { invalid_skus: invalidSkus });
        }

        const inserted = await inquiryRepository.insert({
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone || null,
            customer_company: data.customer_company || null,
            message: data.message || null,
            items: data.items
        });

        return {
            message: "Inquiry submitted successfully. We will get back to you soon.",
            inquiry_id: inserted.id,
            created_at: inserted.created_at
        };
    }

    async list({ status, page, limit }) {
        const offset = (Math.max(1, page) - 1) * limit;

        const [inquiries, total] = await Promise.all([
            inquiryRepository.list({ status, limit, offset }),
            inquiryRepository.count({ status })
        ]);

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: inquiries
        };
    }

    async updateStatus(id, status) {
        const updated = await inquiryRepository.updateStatus(id, status);
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
