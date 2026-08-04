# Workstream 3 Architecture — Identity, Authorization & Contracts

## Overview
WS3 hardens user authentication, introduces Role-Based Access Control (RBAC), guarantees atomic refresh token rotation, eliminates HTTP 500 errors on bodyless requests, and enforces MOQ and bounded pagination contract guarantees.

## Architectural Components

### 1. Bodyless Request Handling (B-01)
* **Safe Cookie & Body Extraction**: Optional chaining (`req.cookies?.refreshToken || req.body?.refreshToken`) prevents TypeError exceptions.
* **Semantic Error Responses**: Missing refresh tokens yield HTTP 401 (`AuthenticationError`), and bodyless logouts clear cookies and return HTTP 200 without raising server exceptions.

### 2. Transactional Session Rotation (F-06)
* **Single Connection Handle**: Session rotation executes inside a PostgreSQL `BEGIN...COMMIT` block using `SELECT ... FOR UPDATE` row-level locks.
* **Reuse Detection Guard**: If a revoked token is re-submitted, all refresh tokens for that user account are invalidated immediately, and a security alert is recorded in audit logs.

### 3. Active Account Status & RBAC (F-07, F-03)
* **Account Status Enforcement**: User authentication queries check `is_active = true` and `deleted_at IS NULL`.
* **RBAC Guard (`requireRole`)**: Middleware inspects JWT claims and enforces required roles (`super-admin`, `admin`, `editor`, `viewer`), returning HTTP 403 (`ForbiddenError`) for insufficient permissions.

### 4. Business Validation & Pagination Constraints (F-16, B-02)
* **Pagination Upper Bounds**: Pagination requests clamp limit values to `[1, 100]` and page values to `>= 1`.
* **MOQ Enforcement**: Inquiry submissions validate variant existence and compare requested line-item quantities against `min_order_qty`.
