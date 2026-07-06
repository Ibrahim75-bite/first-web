import tagService from "../services/tag.service.js";

export class TagController {
    async list(req, res, next) {
        try {
            const { lang = "en" } = req.query;
            const data = await tagService.listAll(lang);
            res.json({ data });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const tag = await tagService.create(req.body);
            res.status(201).json({
                message: "Tag created",
                tag
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await tagService.update(id, req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await tagService.delete(id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async linkProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { tag_slugs } = req.body;
            const result = await tagService.linkProduct(id, tag_slugs);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async unlinkProduct(req, res, next) {
        try {
            const { id, tagId } = req.params;
            const result = await tagService.unlinkProduct(id, tagId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

export const tagController = new TagController();
export default tagController;
