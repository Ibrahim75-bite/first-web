import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../../config/index.js";
import authRepository from "./repository.js";
import { AuthenticationError } from "../../core/common/error.js";
import auditLogger from "../../core/common/audit.js";

export class AuthService {
    _hashToken(token) {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    _generateAccessToken(admin) {
        return jwt.sign(
            {
                id: admin.id,
                username: admin.username,
                role: admin.role
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
    }

    async login(username, password) {
        const admin = await authRepository.findByUsername(username);
        if (!admin) {
            await auditLogger.logEvent("auth.failed", `User: ${username} (Not found)`);
            throw new AuthenticationError("Invalid username or password");
        }

        const isValid = await bcrypt.compare(password, admin.password_hash);
        if (!isValid) {
            await auditLogger.logEvent("auth.failed", `User: ${username} (Incorrect password)`);
            throw new AuthenticationError("Invalid username or password");
        }

        // Generate Access Token (Short-lived)
        const token = this._generateAccessToken(admin);

        // Generate Refresh Token (Long-lived)
        const rawRefreshToken = crypto.randomBytes(40).toString("hex");
        const tokenHash = this._hashToken(rawRefreshToken);
        
        // Expiration calculation: 7 days
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await authRepository.saveRefreshToken(admin.id, tokenHash, expiresAt);

        await auditLogger.logEvent("auth.login", `User: ${username}`);

        return {
            token,
            refreshToken: rawRefreshToken,
            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new AuthenticationError("Refresh token required");
        }

        const tokenHash = this._hashToken(refreshToken);
        const record = await authRepository.findRefreshToken(tokenHash);

        if (!record) {
            throw new AuthenticationError("Invalid refresh token");
        }

        // Check if token was already revoked
        if (record.revoked) {
            // Reuse detection! Revoke all tokens for this user as a safeguard.
            await authRepository.revokeAllRefreshTokensForUser(record.user_id);
            await auditLogger.logEvent(
                "security.alert",
                `Refresh token reuse detected for User ID ${record.user_id}! Revoking all sessions.`,
                { token_hash_attempted: tokenHash }
            );
            throw new AuthenticationError("Token reuse detected. All sessions revoked.");
        }

        // Check expiration
        if (new Date() > new Date(record.expires_at)) {
            throw new AuthenticationError("Refresh token expired");
        }

        // Token rotation: generate new tokens
        const admin = { id: record.user_id }; // We just need user ID to generate tokens
        // Let's resolve the user from DB to obtain username and role for JWT payload consistency
        const userResult = await authRepository.findByUsername(record.username);
        // Note: we can fetch by ID directly or use username, let's make sure we query DB safely.
        // Let's load the full user object to ensure claims are correct.
        const fullUserQuery = await poolQuery(`SELECT id, username, role FROM admins WHERE id = $1`, [record.user_id]);
        if (fullUserQuery.rows.length === 0) {
            throw new AuthenticationError("User associated with token not found");
        }
        const userObj = fullUserQuery.rows[0];

        const token = this._generateAccessToken(userObj);
        const rawRefreshToken = crypto.randomBytes(40).toString("hex");
        const newHash = this._hashToken(rawRefreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Transactional update: replace old token, insert new token
        await authRepository.updateReplacedToken(tokenHash, newHash);
        await authRepository.saveRefreshToken(userObj.id, newHash, expiresAt);

        return {
            token,
            refreshToken: rawRefreshToken
        };
    }

    async logout(refreshToken) {
        if (refreshToken) {
            const tokenHash = this._hashToken(refreshToken);
            await authRepository.revokeRefreshToken(tokenHash);
            await auditLogger.logEvent("auth.logout", "Single session closed");
        }
    }

    async logoutAll(userId) {
        await authRepository.revokeAllRefreshTokensForUser(userId);
        await auditLogger.logEvent("auth.logout_all", `All sessions closed for User ID ${userId}`);
    }
}

// Inline helper for standard queries
import pool from "../../core/database/db.js";
async function poolQuery(sql, params) {
    return pool.query(sql, params);
}

export const authService = new AuthService();
export default authService;
