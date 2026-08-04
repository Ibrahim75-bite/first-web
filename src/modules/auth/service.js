import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../../config/index.js";
import pool from "../../core/database/db.js";
import withTransaction from "../../core/database/transaction.js";
import defaultAuthRepository from "./repository.js";
import defaultAuditLogger from "../../core/common/audit.js";
import { AuthenticationError } from "../../core/common/error.js";

/**
 * Enterprise Authentication Service (ARCH-01, ARCH-03 remediated)
 */
export class AuthService {
    constructor({
        authRepo = defaultAuthRepository,
        auditLog = defaultAuditLogger,
        dbPool = pool
    } = {}) {
        this.authRepo = authRepo;
        this.auditLogger = auditLog;
        this.db = dbPool;
    }

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
        const admin = await this.authRepo.findByUsername(username, this.db);
        if (!admin) {
            await this.auditLogger.logEvent("auth.failed", `User: ${username} (Not found or inactive)`);
            throw new AuthenticationError("Invalid username or password");
        }

        const isValid = await bcrypt.compare(password, admin.password_hash);
        if (!isValid) {
            await this.auditLogger.logEvent("auth.failed", `User: ${username} (Incorrect password)`);
            throw new AuthenticationError("Invalid username or password");
        }

        const token = this._generateAccessToken(admin);
        const rawRefreshToken = crypto.randomBytes(40).toString("hex");
        const tokenHash = this._hashToken(rawRefreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.authRepo.saveRefreshToken(admin.id, tokenHash, expiresAt, this.db);
        await this.auditLogger.logEvent("auth.login", `User: ${username}`);

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

        return await withTransaction(async (tx) => {
            const client = tx.client;

            // Atomic lock FOR UPDATE
            const recordRes = await client.query(
                `SELECT id, user_id, token_hash, expires_at, revoked, replaced_by_token_hash 
                 FROM refresh_tokens 
                 WHERE token_hash = $1 FOR UPDATE`,
                [tokenHash]
            );
            const record = recordRes.rows[0];

            if (!record) {
                throw new AuthenticationError("Invalid refresh token");
            }

            if (record.revoked) {
                await client.query(`UPDATE refresh_tokens SET revoked = TRUE, revoked_at = NOW() WHERE user_id = $1`, [record.user_id]);

                await this.auditLogger.logEvent(
                    "security.alert",
                    `Refresh token reuse detected for User ID ${record.user_id}! Revoking all sessions.`,
                    { token_hash_attempted: tokenHash }
                );
                throw new AuthenticationError("Token reuse detected. All sessions revoked.");
            }

            if (new Date() > new Date(record.expires_at)) {
                throw new AuthenticationError("Refresh token expired");
            }

            const userRes = await client.query(
                `SELECT id, username, role, is_active FROM admins WHERE id = $1 AND (is_active IS TRUE OR is_active IS NULL) AND deleted_at IS NULL`,
                [record.user_id]
            );
            if (userRes.rows.length === 0) {
                throw new AuthenticationError("User associated with token not found or disabled");
            }
            const userObj = userRes.rows[0];

            const token = this._generateAccessToken(userObj);
            const rawRefreshToken = crypto.randomBytes(40).toString("hex");
            const newHash = this._hashToken(rawRefreshToken);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            await client.query(
                `UPDATE refresh_tokens SET revoked = TRUE, revoked_at = NOW(), replaced_by_token_hash = $1 WHERE id = $2`,
                [newHash, record.id]
            );
            await client.query(
                `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
                [userObj.id, newHash, expiresAt]
            );

            return {
                token,
                refreshToken: rawRefreshToken
            };
        });
    }

    async logout(refreshToken) {
        if (refreshToken) {
            const tokenHash = this._hashToken(refreshToken);
            await this.authRepo.revokeRefreshToken(tokenHash, this.db);
            await this.auditLogger.logEvent("auth.logout", "Single session closed");
        }
    }

    async logoutAll(userId) {
        await this.authRepo.revokeAllRefreshTokensForUser(userId, this.db);
        await this.auditLogger.logEvent("auth.logout_all", `All sessions closed for User ID ${userId}`);
    }
}

export const authService = new AuthService();
export default authService;
