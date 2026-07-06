import pool from "../database/db.js";
import { getRequestContext } from "./context.js";

export class AuditLogger {
    async logEvent(action, target, previousValue = null, newValue = null) {
        try {
            const context = getRequestContext();
            
            const userId = context.userId || null;
            const username = context.username || null;
            const ipAddress = context.ip || "unknown";
            const deviceInfo = context.userAgent || "unknown";
            const requestId = context.requestId || null;

            const query = `
                INSERT INTO audit_logs 
                (user_id, username, ip_address, device_info, request_id, action, target, previous_value, new_value)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;

            await pool.query(query, [
                userId,
                username,
                ipAddress,
                deviceInfo,
                requestId,
                action,
                target,
                previousValue ? JSON.stringify(previousValue) : null,
                newValue ? JSON.stringify(newValue) : null
            ]);
        } catch (err) {
            // Never crash the primary request due to an audit logging failure
            console.error("❌ Failed to write audit log:", err.message);
        }
    }
}

export const auditLogger = new AuditLogger();
export default auditLogger;
