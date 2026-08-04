import pool from "../../core/database/db.js";

/**
 * Enterprise Auth Repository supporting flexible db parameter injection (ARCH-01)
 */
export class AuthRepository {
    async findByUsername(username, db = pool) {
        const query = `
            SELECT id, username, password_hash, role, is_active 
            FROM admins 
            WHERE username = $1 AND (is_active IS TRUE OR is_active IS NULL) AND deleted_at IS NULL
        `;
        const result = await db.query(query, [username]);
        return result.rows[0] || null;
    }

    async findById(id, db = pool) {
        const query = `
            SELECT id, username, role, is_active 
            FROM admins 
            WHERE id = $1 AND (is_active IS TRUE OR is_active IS NULL) AND deleted_at IS NULL
        `;
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    }

    async saveRefreshToken(userId, tokenHash, expiresAt, db = pool) {
        const query = `
            INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
            VALUES ($1, $2, $3)
        `;
        await db.query(query, [userId, tokenHash, expiresAt]);
    }

    async findRefreshToken(tokenHash, db = pool) {
        const query = `
            SELECT id, user_id, token_hash, expires_at, revoked, replaced_by_token_hash
            FROM refresh_tokens
            WHERE token_hash = $1
        `;
        const result = await db.query(query, [tokenHash]);
        return result.rows[0] || null;
    }

    async revokeRefreshToken(tokenHash, db = pool) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = TRUE, revoked_at = NOW()
            WHERE token_hash = $1
        `;
        await db.query(query, [tokenHash]);
    }

    async revokeAllRefreshTokensForUser(userId, db = pool) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = TRUE, revoked_at = NOW()
            WHERE user_id = $1
        `;
        await db.query(query, [userId]);
    }

    async purgeExpiredRefreshTokens(db = pool) {
        const query = `DELETE FROM refresh_tokens WHERE expires_at < NOW() OR (revoked IS TRUE AND revoked_at < NOW() - INTERVAL '7 days')`;
        const result = await db.query(query);
        return result.rowCount;
    }
}

export const authRepository = new AuthRepository();
export default authRepository;
