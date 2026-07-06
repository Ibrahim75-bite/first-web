import inquiryService from "./service.js";

export class InquiryController {
    async submit(req, res, next) {
        try {
            const result = await inquiryService.submit(req.body);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    async list(req, res, next) {
        try {
            const { status, page = 1, limit = 20 } = req.query;
            const parsedPage = parseInt(page, 10) || 1;
            const parsedLimit = Math.min(100, parseInt(limit, 10) || 20);

            const result = await inquiryService.list({ status, page: parsedPage, limit: parsedLimit });
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await inquiryService.updateStatus(id, status);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

export const inquiryController = new InquiryController();
export default inquiryController;
