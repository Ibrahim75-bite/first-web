import pool from "../../core/database/db.js";

export class AuthRepository {
    async findByUsername(username) {
        const query = `SELECT id, username, password_hash, role FROM admins WHERE username = $1`;
        const result = await pool.query(query, [username]);
        return result.rows[0] || null;
    }

    async saveRefreshToken(userId, tokenHash, expiresAt) {
        const query = `
            INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
            VALUES ($1, $2, $3)
        `;
        await pool.query(query, [userId, tokenHash, expiresAt]);
    }

    async findRefreshToken(tokenHash) {
        const query = `
            SELECT id, user_id, token_hash, expires_at, revoked, replaced_by_token_hash
            FROM refresh_tokens
            WHERE token_hash = $1
        `;
        const result = await pool.query(query, [tokenHash]);
        return result.rows[0] || null;
    }

    async revokeRefreshToken(tokenHash) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = TRUE
            WHERE token_hash = $1
        `;
        await pool.query(query, [tokenHash]);
    }

    async revokeAllRefreshTokensForUser(userId) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = TRUE
            WHERE user_id = $1
        `;
        await pool.query(query, [userId]);
    }

    async updateReplacedToken(oldTokenHash, newTokenHash) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = TRUE, replaced_by_token_hash = $1
            WHERE token_hash = $2
        `;
        await pool.query(query, [newTokenHash, oldTokenHash]);
    }
}

export const authRepository = new AuthRepository();
export default authRepository;
