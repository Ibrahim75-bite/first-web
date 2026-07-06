import express from "express";
import authController from "./controller.js";
import { validateLogin } from "./validator.js";
import { authLimiter } from "../../core/middleware/rateLimiter.js";
import authMiddleware from "../../core/middleware/auth.js";

const router = express.Router();

router.post("/login", authLimiter, validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/logout-all", authMiddleware, authController.logoutAll);

export default router;
