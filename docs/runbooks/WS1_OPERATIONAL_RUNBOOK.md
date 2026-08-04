# WS1 Operational Runbook — Secure Runtime Foundation

## Operating Guidelines

### Environment Setup
Set environment variables in `.env` or system environment:
* `NODE_ENV`: `production` | `development` | `test`
* `PORT`: `5000` (or target ingress port)
* `BASE_URL`: `https://api.elmuttahida.com`
* `FRONTEND_URL`: `https://elmuttahida.com`
* `JWT_SECRET`: Minimum 32 characters in production.
* `TRUST_PROXY`: Set to `1` (or number of reverse proxy hops / proxy CIDR).
* `DB_SSL`: `true` | `false`
* `DB_SSL_REJECT_UNAUTHORIZED`: `true`

### Diagnostics & Monitoring
* **Database Pool Status**: Query `/` root or run `checkDatabaseHealth()` in code.
* **Request Correlation**: Trace requests across microservices using the `X-Request-Id` HTTP response header.
* **Graceful Drain Verification**: Trigger a rolling update; observe log line `⚠️ Received SIGTERM. Starting graceful shutdown...` followed by clean termination.

### Rollback Procedure
If runtime configuration errors occur on deployment:
1. Revert environment variable modifications.
2. Restart container or PM2 process (`pm2 restart server`).
3. Verify `/` returns `{"message": "Server running"}` and HTTP status 200.
