import productService from "../services/product.service.js";

export class ProductController {
    async getBySlug(req, res, next) {
        try {
            const slug = (req.params.slug || "").trim();
            const { lang } = req.query;
            const product = await productService.getBySlug(slug, lang);
            res.json(product);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const { lang = "en" } = req.query;
            const product = await productService.getById(id, lang);
            res.json(product);
        } catch (err) {
            next(err);
        }
    }

    async getAdminDetails(req, res, next) {
        try {
            const { id } = req.params;
            const data = await productService.getAdminDetails(id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async list(req, res, next) {
        try {
            const {
                lang = "en",
                search = null,
                tags = null
            } = req.query;

            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
            const featured = req.query.featured === "true";

            const data = await productService.list({ lang, search, tags, page, limit, featured });
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const result = await productService.create(req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.update(id, req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.delete(id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

export const productController = new ProductController();
export default productController;
