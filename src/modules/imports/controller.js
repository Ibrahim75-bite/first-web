import importService from "./service.js";

export class ImportController {
    async importCsv(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No CSV file provided. Upload with field name 'csvFile'" });
            }

            const result = await importService.importCsv(req.file.path);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

export const importController = new ImportController();
export default importController;
