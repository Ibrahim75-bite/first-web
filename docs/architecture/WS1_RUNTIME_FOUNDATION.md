# Workstream 1 Architecture — Secure Runtime Foundation

## Overview
WS1 establishes a hardened, deterministic runtime configuration, trusted proxy normalization, database transport security, scoped header security, and asynchronous lifecycle sequencing.

## Architectural Changes

### 1. Bounded & Frozen Configuration (`src/config/index.js`)
* **Strict Validation**: Fast-fails on startup if required variables (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, `JWT_SECRET`, `BASE_URL`) are missing.
* **Secret Requirements**: Enforces minimum 32-character secret length in production environments.
* **Immutability**: Freezes exported configuration objects to block runtime tampering.

### 2. Database Transport Hardening (`src/core/database/db.js`)
* **Timeouts & Budgets**: Explicitly configures connection timeout (`connectionTimeoutMillis`), idle timeout (`idleTimeoutMillis`), statement timeout (`statement_timeout`), and query timeout (`query_timeout`).
* **Transport TLS**: Applies `ssl` configuration enforcing CA validation when production TLS is required.
* **Health Monitoring**: Exposes `checkDatabaseHealth()` for operational probes.

### 3. Identity & Security Headers (`src/core/middleware/security.js` & `src/app.js`)
* **Trusted Proxy**: Explicitly configures `app.set("trust proxy", config.trustProxy)`.
* **CORP & CORS Scoping**: Public static media routes (`/images`) set `Cross-Origin-Resource-Policy: cross-origin` so multi-origin clients can render images without browser header blocks.
* **Request Tracing**: AsyncLocalStorage binds sanitized trace IDs (`X-Request-Id`) across async call graphs.

### 4. Asynchronous Startup & Graceful Shutdown (`src/server.js`)
* **Readiness Gate**: Awaits database connectivity and initialization before opening the HTTP port (`app.listen`).
* **Process Lifecycle**: Captures `SIGTERM` and `SIGINT`, closes HTTP server to reject new ingress, drains in-flight requests, and closes PostgreSQL pool connection safely.
