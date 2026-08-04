# WS3 Operational Runbook — Identity & Authorization Management

## Session Management & Revocation

### Force Revoking All User Sessions
To immediately revoke all active refresh tokens for a compromised user account (e.g. User ID `42`):
```sql
UPDATE refresh_tokens 
SET revoked = TRUE, revoked_at = NOW() 
WHERE user_id = 42;
```

### Deactivating an Administrator Account
To disable access for a user immediately without deleting history:
```sql
UPDATE admins 
SET is_active = FALSE 
WHERE id = 42;
```

### Investigating Token Reuse Alerts
When a security alert `Refresh token reuse detected` appears in audit logs:
1. Identify `user_id` from the alert log record.
2. Verify all tokens for the user were automatically revoked.
3. Require the user to re-authenticate with credentials.
