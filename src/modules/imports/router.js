import express from "express";
import multer from "multer";
import config from "../../config/index.js";
import authMiddleware from "../../core/middleware/auth.js";
import importController from "./controller.js";

const router = express.Router();

const csvUpload = multer({
    dest: config.storage.tempDir,
    fileFilter: (req, file, cb) => {
        const allowed = ["text/csv", "application/vnd.ms-excel", "text/plain"];
        if (allowed.includes(file.mimetype) || file.originalname.endsWith(".csv")) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max CSV
});

const handleCsvUpload = (req, res, next) => {
    csvUpload.single("csvFile")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ error: "CSV file too large. Maximum size is 10MB" });
            }
            return res.status(400).json({ error: err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

router.post("/", authMiddleware, handleCsvUpload, importController.importCsv);

export default router;
