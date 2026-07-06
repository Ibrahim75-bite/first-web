import variantService from "../services/variant.service.js";

export class VariantController {
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await variantService.update(id, req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await variantService.delete(id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async addImage(req, res, next) {
        try {
            const { variantId } = req.params;
            const result = await variantService.addImage(variantId, req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async uploadImage(req, res, next) {
        try {
            const { variantId } = req.params;
            const displayOrder = parseInt(req.body.display_order, 10) || 1;

            if (!req.file) {
                return res.status(400).json({ error: "No image file provided" });
            }

            const result = await variantService.uploadImage(variantId, req.file, displayOrder);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async deleteImage(req, res, next) {
        try {
            const { id } = req.params;
            const result = await variantService.deleteImage(id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

export const variantController = new VariantController();
export default variantController;
