import express from "express";
import authMiddleware from "../../core/middleware/auth.js";
import inquiryController from "./controller.js";
import { validateInquiry, validateInquiryStatus } from "./validator.js";
import { inquiryLimiter } from "../../core/middleware/rateLimiter.js";

const router = express.Router();

router.post("/", inquiryLimiter, validateInquiry, inquiryController.submit);
router.get("/", authMiddleware, inquiryController.list);
router.put("/:id/status", authMiddleware, validateInquiryStatus, inquiryController.updateStatus);

export default router;
