# Enterprise Remediation Roadmap

## WS1 — Secure runtime foundation

**Purpose:** enforce configuration, trusted proxy identity, bounded requests, database TLS/timeouts, safe cookies, and security headers.  
**Dependencies:** none. **Effort:** 3–5 days. **Risk:** medium (environment configuration must be supplied).  
**Files:** config, app, database pool, security/context/rate-limit middleware, package scripts, tests.  
**Acceptance/verification:** invalid production config fails fast; trusted proxy tests pass; body/query/connection deadlines are enforced; public image policy is browser-tested.

## WS2 — Schema and migration ownership

**Purpose:** replace startup DDL with a versioned, locked migration process; establish base schema and invariants.  
**Dependencies:** WS1 configuration. **Effort:** 1–2 weeks. **Risk:** high (requires production data inventory and migration rehearsal).  
**Files:** migrations, migrator, database init removal, package scripts, rollback/runbook, integration tests.  
**Acceptance/verification:** empty DB migrates; upgrade path is checksum-verified; no web process performs DDL; rollback/restore rehearsal succeeds.

## WS3 — Identity, authorization, and API contracts

**Purpose:** enforce account status/permissions, atomic session rotation, structured validation, and correct error semantics.  
**Dependencies:** WS1/WS2. **Effort:** 1–2 weeks. **Risk:** medium (role matrix/client token contract).  
**Files:** auth repository/service/middleware/router, validators/controllers, schemas/tests/docs.  
**Acceptance/verification:** role matrix, inactive account, bodyless auth, refresh replay, and negative-pagination tests pass.

## WS4 — Catalog, media, and import consistency

**Purpose:** correct visibility/search, optimistic writes, slug ownership, path safety, transactional tags, durable bounded imports, and media lifecycle.  
**Dependencies:** WS2/WS3. **Effort:** 2–4 weeks. **Risk:** high (data migration/object storage/worker deployment).  
**Files:** product/tag/variant/import repositories/services, storage, image/SSRF, migrations, worker/tests/runbook.  
**Acceptance/verification:** concurrency, rollback, image corpus, SSRF, quota, and reconciliation tests pass.

## WS5 — Frontend administrative and localized delivery

**Purpose:** replace mock/local persistence with authenticated API workflows; make SSR, locale, accessibility, and media delivery correct.  
**Dependencies:** WS3/WS4. **Effort:** 2–3 weeks. **Risk:** medium (UI/API transition).  
**Files:** routes/loaders/contexts/root, API client, browser/SSR/accessibility tests.  
**Acceptance/verification:** anonymous admin access redirects; direct SSR routes work; real writes persist; Arabic root semantics and image delivery pass browser tests.

## WS6 — Delivery, observability, and recovery

**Purpose:** introduce CI quality/security gates, deployment artifacts, structured telemetry, SLOs, backup/restore and operational runbooks.  
**Dependencies:** WS1–WS5. **Effort:** 2–4 weeks. **Risk:** medium/high (cloud account and production operations required).  
**Files:** workflows, Docker/IaC, telemetry, docs/runbooks, load/chaos/DR evidence.  
**Acceptance/verification:** CI gates, signed deploy evidence, alerts, load/chaos results, and measured restore/RTO/RPO evidence exist.

## Breaking-change strategy

The work requires an explicit API/version and data-migration transition: add v2 contracts alongside legacy endpoints, dual-read media/catalog data where necessary, backfill/validate, switch clients behind feature flags, then retire legacy paths after a monitored rollback window. Database migrations must be forward-only and reviewed with a backup/PITR checkpoint; rollback is application traffic rollback plus restore/forward-fix, never destructive schema reversal against live data.
