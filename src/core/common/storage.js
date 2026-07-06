import fs from "fs";
import path from "path";
import config from "../../config/index.js";

export class DiskStorageService {
    constructor() {
        this.uploadsDir = config.storage.uploadsDir;
        this.thumbsDir = config.storage.thumbsDir;
        this.tempDir = config.storage.tempDir;
        this._ensureDirectories();
    }

    _ensureDirectories() {
        try {
            if (!fs.existsSync(this.uploadsDir)) {
                fs.mkdirSync(this.uploadsDir, { recursive: true });
            }
            if (!fs.existsSync(this.thumbsDir)) {
                fs.mkdirSync(this.thumbsDir, { recursive: true });
            }
            if (!fs.existsSync(this.tempDir)) {
                fs.mkdirSync(this.tempDir, { recursive: true });
            }
        } catch (err) {
            console.warn("Could not create local upload directories (expected in Serverless/Vercel environments):", err.message);
        }
    }

    async write(fileName, buffer, target = "uploads") {
        const baseDir = target === "thumbnails" ? this.thumbsDir : this.uploadsDir;
        const filePath = path.join(baseDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        return fileName;
    }

    async delete(fileName, target = "uploads") {
        const baseDir = target === "thumbnails" ? this.thumbsDir : this.uploadsDir;
        const filePath = path.join(baseDir, fileName);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    }

    exists(fileName, target = "uploads") {
        const baseDir = target === "thumbnails" ? this.thumbsDir : this.uploadsDir;
        const filePath = path.join(baseDir, fileName);
        return fs.existsSync(filePath);
    }

    getLocalPath(fileName, target = "uploads") {
        const baseDir = target === "thumbnails" ? this.thumbsDir : this.uploadsDir;
        return path.join(baseDir, fileName);
    }
}

export const storageService = new DiskStorageService();
export default storageService;
