# Workstream 5 Architecture — Telemetry, Observability & Probes

## Overview
WS5 introduces structured JSON telemetry, sensitive parameter masking, request correlation context, and standardized health/readiness HTTP probes for production operations.

## Telemetry Components

### 1. Structured JSON Logging (`src/core/middleware/logging.js`)
* **Standard JSON Output**: Every log entry emits a single-line JSON string containing `timestamp`, `level`, `requestId`, `userId`, `ip`, `message`, and request metadata.
* **Correlation Propagation**: Binds to `AsyncLocalStorage` context from WS1 to attach trace IDs (`requestId`) across async execution graphs.

### 2. Sensitive Parameter Masking
* Automatically redacts sensitive fields (`password`, `token`, `refreshToken`, `authorization`, `secret`, `creditCard`, `cvv`) in request logs and telemetry payloads.

### 3. Kubernetes / Cloud Native Health Probes (`src/app.js`)
* **`/health` (Liveness)**: Fast, lightweight endpoint returning `200 OK` with system timestamp and environment.
* **`/ready` (Readiness)**: Evaluates PostgreSQL database pool connection latency and status via `checkDatabaseHealth()`. Returns `200 OK` when healthy, or `503 Service Unavailable` if database connectivity degrades.
