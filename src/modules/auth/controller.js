import authService from "./service.js";
import config from "../../config/index.js";
import { AuthenticationError } from "../../core/common/error.js";

export class AuthController {
    async login(req, res, next) {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return next(new AuthenticationError("Username and password are required"));
        }
        try {
            const data = await authService.login(username, password);

            // Store refresh token in secure HttpOnly cookie
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                message: "Login successful",
                token: data.token,
                user: data.user
            });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                return next(new AuthenticationError("Refresh token required"));
            }

            const data = await authService.refresh(refreshToken);

            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({
                token: data.token
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                res.clearCookie("refreshToken");
                return res.json({ message: "Logged out successfully" });
            }

            await authService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.json({ message: "Logged out successfully" });
        } catch (err) {
            next(err);
        }
    }

    async logoutAll(req, res, next) {
        try {
            const userId = req.user.id;
            await authService.logoutAll(userId);
            res.clearCookie("refreshToken");
            res.json({ message: "Logged out of all devices successfully" });
        } catch (err) {
            next(err);
        }
    }
}

export const authController = new AuthController();
export default authController;
