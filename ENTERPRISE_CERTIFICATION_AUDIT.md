# Enterprise Certification Audit — Rejected

**Audit date:** 2026-08-03  
**Scope:** 105 repository files (backend, frontend, migrations, deployment/configuration); ignored dependencies and generated build output excluded.  
**Method:** hostile static review, active import check, frontend `typecheck` and production build, package dependency audit. The database was not modified or queried; findings about schema are derived directly from the only versioned migration and SQL consumers.

## Executive decision

**Certification: REJECTED. Do not deploy to production.** The project cannot deterministically initialize a clean database, the public product listing references a nonexistent schema field, the apparent administrative application is unauthenticated mock/local-browser state, and the active dependency tree contains five high-severity advisories. The implementation has no automated tests or CI/CD workflow, no backend container/deployment definition, no durable distributed state, and no operational readiness controls.

## Scores

| Area | Score / 10 | Decision basis |
|---|---:|---|
| Overall architecture | 2.0 | parallel legacy/new implementations; no coherent boundary or migration ownership |
| Backend | 2.0 | basic layering, but fatal schema/API and authorization defects |
| Frontend | 1.5 | build passes but the admin product is mock state and server rendering is broken |
| Database | 1.0 | non-bootstrap migration, no migration ledger, unsafe startup DDL |
| Security | 2.0 | no RBAC enforcement; arbitrary path deletion; vulnerable production dependencies |
| Performance | 2.5 | join amplification, in-memory cache/limiters, synchronous import |
| Scalability | 1.5 | filesystem and memory state prevent safe multi-instance operation |
| Reliability | 1.5 | no graceful shutdown, retries, health/readiness separation, backups, or recovery evidence |
| Maintainability | 2.0 | duplicate legacy code, dead/unused enterprise schema, no tests |
| Testing | 0.0 | no test files or test script |
| Documentation | 1.0 | frontend README is the unmodified template and contradicts the application |
| DevOps / cloud readiness | 1.0 | frontend-only Dockerfile; no CI, deployment manifests, secrets model, or observability |
| AI readiness | 0.0 | no AI implementation, guardrails, evaluation, or operational controls |
| Production readiness | 1.0 | rejected |
| Enterprise readiness | 0.5 | rejected |
| Technical-debt score | 9 / 10 (higher is worse) | foundational rework required |

## Validated checks

* `node --input-type=module -e "import('./src/app.js')"` completed successfully with the local environment.
* `npm.cmd run typecheck` and `npm.cmd run build` completed in `elmuttahida-frontend`. This only proves compilation; it does not validate SSR route execution, authentication, or API behavior.
* `npm audit --omit=dev --json` found **5 high**, 3 moderate, and 1 low production dependency vulnerabilities.
* No versioned test files, test script, GitHub Actions workflow, backend Dockerfile, compose/Kubernetes manifests, or `.env.example` exist. The worktree already contained user modifications to three admin route files; they were not changed by this audit.

## Findings

Each finding supplies the requested fields in compact form. “Example implementation” is a safe implementation direction, not a drop-in patch.

### F-01 — Product list/search is schema-incompatible

* **Severity / confidence / category:** Critical / High / database correctness, availability.
* **Exact files/functions:** `src/modules/products/repositories/product.repository.js:157-174, 323-343` (`listIds`, `_buildWhereClause`); `src/core/database/migrations/001_enterprise_upgrade.sql`.
* **Root cause and evidence:** SQL reads `t.search_vector`, while the sole migration creates functional expression indexes but never creates a `product_translations.search_vector` column or generated column. Repository-wide DDL search found no such column definition.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Any ordinary `GET /api/products` invokes this SQL and fails with PostgreSQL undefined-column error. Catalogue, administration, SEO indexing, and user discovery fail; retries add database load. The mismatch makes schema evolution unmaintainable. Direct security impact is low.
* **Likelihood / reproduction:** Certain on a database initialized from versioned artifacts: migrate, then request `GET /api/products`.
* **Recommended fix / example implementation:** Choose one source of truth: add a stored generated `search_vector tsvector` plus matching GIN indexes and trigger/generated-expression strategy, or change every query to exactly the indexed `to_tsvector(...)` expression. Add migration and integration test that applies migrations to an empty database then executes every endpoint.
* **Breaking-change risk / effort:** Medium / 1–2 days plus migration rehearsal.

### F-02 — Migration cannot bootstrap a clean database and has no version ledger

* **Severity / confidence / category:** Critical / High / database migration, deployment.
* **Exact files/functions:** `src/core/database/init.js:9-62` (`initializeDatabase`); `src/core/database/migrations/001_enterprise_upgrade.sql:11-39`.
* **Root cause and evidence:** The first committed migration begins with `ALTER TABLE admins/products/...`; no committed base-table creation exists. It is rerun at every application startup, with no migration history/checksum/lock.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Fresh environments fail before serving. Existing deployments rerun DDL, hold locks, and can race across replicas; a changed file retroactively changes history. Availability and data-integrity risk are severe; security impact is indirect through failed recovery. This precludes repeatable DR and horizontal rollout.
* **Likelihood / reproduction:** Certain for an empty PostgreSQL database: start application and observe `relation "admins" does not exist`. Start multiple instances against an existing database to exercise concurrent DDL.
* **Recommended fix / example implementation:** Adopt a real migration runner (Prisma/Knex/Flyway/node-pg-migrate), commit baseline schema as migration 000, maintain a migration table with checksums, apply migrations in CI/CD as a singleton job, and never execute schema DDL in web-process startup.
* **Breaking-change risk / effort:** High / 1–2 weeks including backup/rollback rehearsals.

### F-03 — Unauthenticated mock “admin” application and missing backend authorization

* **Severity / confidence / category:** Critical / High / access control, product integrity.
* **Exact files/functions:** `elmuttahida-frontend/app/routes.ts:14-23`; `app/routes/admin/_layout.tsx`; `admin.products.new.tsx:143-178`; `admin.products.edit.tsx:121-239`; `admin.orders._index.tsx:38+`; `src/core/middleware/auth.js:8-30`.
* **Root cause and evidence:** All `/admin/*` routes are publicly routable with no loader/guard/session check. Product writes are explicitly simulated and stored in `localStorage`; orders are hard-coded. Backend checks only token validity and never authorizes `role`, permission, tenant, active, or deleted status.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Anyone can view a deceptive administrator UI; operators believe mutations occurred when no server state changed. Any account that can obtain a valid JWT has unrestricted product/tag/import/inquiry admin access. Browser-local state diverges across users/devices and is not auditable. Security and business-operation impact are severe.
* **Likelihood / reproduction:** Certain: browse `/admin/orders` anonymously; create/edit a product and refresh or inspect API/database—only browser storage changed. Use a JWT for any role against `POST /api/products`.
* **Recommended fix / example implementation:** Implement server-side authenticated sessions/route guards and a permission matrix enforced by backend middleware (`requirePermission('products:write')`). Replace every mock/local mutation with authenticated API calls and server persistence; derive UI from API states only.
* **Breaking-change risk / effort:** High / 2–4 weeks.

### F-04 — SSR crashes on admin routes

* **Severity / confidence / category:** High / High / frontend availability.
* **Exact files/functions:** `admin.products.new.tsx:12`, `admin.products.edit.tsx:14`, `admin.products._index.tsx:41`, `admin.orders._index.tsx:87`, `admin.settings._index.tsx:28-31`; `react-router.config.ts:5`.
* **Root cause and evidence:** SSR is enabled while these component render paths dereference browser-only `localStorage` outside effects/guards.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Node SSR has no `localStorage`, so direct admin-route requests return 500 instead of HTML. This blocks the admin surface and makes behavior differ between client navigation and refresh. Security impact is low; support and reliability impact high.
* **Likelihood / reproduction:** Certain: run frontend production server, request `/admin/products/new` directly.
* **Recommended fix / example implementation:** Move browser storage reads into `useEffect` with initial server-safe state, or remove browser storage. Prefer authenticated server loaders for settings/data; add SSR smoke tests for every route.
* **Breaking-change risk / effort:** Low / 1–3 days after F-03 design.

### F-05 — Arbitrary filesystem deletion via image name

* **Severity / confidence / category:** High / High / application security (CWE-22, CWE-73).
* **Exact files/functions:** `src/modules/products/validators/variant.validator.js:19-27`; `services/variant.service.js:50-59`; `src/core/common/storage.js:37-46`; `src/core/utils/image.js:9-49`.
* **Root cause and evidence:** `image_name` only requires a nonempty string. It is joined to upload paths without basename/allowlist containment validation. Image validation error cleanup unlinks the resolved input path.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** An authenticated but unprivileged-in-practice token holder can use traversal such as `../../.env` (relative to `uploads/images`) to target a file reachable by the service identity. `sharp` fails, then cleanup deletes it. This is loss of configuration/data and a service outage vector.
* **Likelihood / reproduction:** High where the service identity can modify the target: send `POST /api/products/variants/{validId}/images` with Bearer token and `{ "image_name": "../../.env" }`.
* **Recommended fix / example implementation:** Do not accept a filename endpoint for local files. Accept only server-issued opaque media IDs; validate `path.basename(name) === name`, a strict UUID+extension regexp, resolve and verify the absolute result remains under the intended root, and use media metadata in the database.
* **Breaking-change risk / effort:** Medium / 2–4 days.

### F-06 — Refresh-token rotation has a race and cannot revoke issued access tokens

* **Severity / confidence / category:** High / High / authentication, concurrency.
* **Exact files/functions:** `src/modules/auth/service.js:64-116`; `repository.js:17-52`.
* **Root cause and evidence:** `findRefreshToken`, revocation/replacement, and insertion are separate pool queries with no transaction or compare-and-swap predicate. Two concurrent refreshes can both observe `revoked=false` and issue separate valid descendants. Logout-all only revokes refresh records; signed access JWTs remain valid until expiry.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Token replay/session control is nondeterministic under network retries or an attacker with a copied token. Incident response cannot immediately terminate active access. Multi-instance behavior worsens because state is not atomically changed.
* **Likelihood / reproduction:** High: issue two parallel `POST /api/auth/refresh` requests with the same refresh token; both can pass the pre-revocation read.
* **Recommended fix / example implementation:** In one transaction, `SELECT ... FOR UPDATE` (or conditional `UPDATE ... WHERE revoked=false AND expires_at>now() RETURNING`) then insert the replacement. Store a session/token-version claim and check it on privileged requests, or use a short denylist/session lookup for immediate revocation. Add concurrency tests.
* **Breaking-change risk / effort:** Medium / 3–5 days.

### F-07 — Disabled/deleted accounts and RBAC are not enforced

* **Severity / confidence / category:** High / High / authorization.
* **Exact files/functions:** `src/modules/auth/repository.js:4-8`; `service.js:27-57`; `src/core/database/migrations/001_enterprise_upgrade.sql:11-16`; all protected routes in `src/modules/*/router.js`.
* **Root cause and evidence:** Login selects `id, username, password_hash, role` only and ignores `is_active` and `deleted_at`. Auth middleware validates the signature only; no route checks a role/permission.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Deprovisioned accounts can continue to authenticate; any assigned role gains destructive CMS/import functions. This violates least privilege and audit/compliance expectations.
* **Likelihood / reproduction:** Certain given an inactive admin row with a valid password; login succeeds. Authenticate a non-admin role and call a protected write route.
* **Recommended fix / example implementation:** Query active/not-deleted status at login and enforce it per request/session. Define roles and permissions centrally; test an allow/deny matrix for every endpoint.
* **Breaking-change risk / effort:** Medium / 1–2 weeks.

### F-08 — Public queries disclose drafts/soft-deleted content

* **Severity / confidence / category:** High / High / data exposure, business logic.
* **Exact files/functions:** `product.repository.js:24-54, 157-222, 250-284, 323-343`; migration `001...sql:20-23`.
* **Root cause and evidence:** Migration introduces `published_status`, scheduling, and `deleted_at`, but public repository queries never filter them.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Draft, scheduled, or logically deleted products are returned by ID, slug, listing, search, and recommendations. This creates embargo/privacy/commercial exposure and makes soft deletion ineffective.
* **Likelihood / reproduction:** Certain: mark an existing product draft/deleted, call public listing or direct lookup.
* **Recommended fix / example implementation:** Centralize a public visibility predicate (`deleted_at IS NULL AND published_status='published' AND published_at<=now()`) in all public reads; expose privileged preview explicitly. Add DB partial indexes matching it and contract tests.
* **Breaking-change risk / effort:** Medium / 2–4 days.

### F-09 — Vulnerable production dependency tree

* **Severity / confidence / category:** High / High / supply chain security.
* **Exact files/functions:** `package.json`, `package-lock.json`.
* **Root cause and evidence:** Verified `npm audit --omit=dev` reports high advisories for `express-rate-limit` (IPv4-mapped IPv6 limiter bypass), `multer` (multiple DoS defects), `sharp`/libvips, and transitive `lodash` and `path-to-regexp`; moderate advisories for Morgan, qs, and ip-address.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Attackers can bypass request controls or consume resources on exposed upload/routing surfaces. Unpatched image parsing compounds upload risk. Operations cannot claim a maintained vulnerability posture.
* **Likelihood / reproduction:** High for exposed services; advisory versions are installed according to lockfile/audit.
* **Recommended fix / example implementation:** Upgrade to audit-fixed releases (including Multer >=2.2.0, express-rate-limit fixed release, Sharp >=0.35.0 or current supported), regenerate lockfile, run regression/security tests, and enforce CI dependency scanning/SBOM.
* **Breaking-change risk / effort:** Medium / 2–5 days.

### F-10 — Import pipeline is synchronous, non-transactional across rows, and leaks temporary files

* **Severity / confidence / category:** High / High / reliability, resource exhaustion, privacy.
* **Exact files/functions:** `src/modules/imports/router.js:9-39`; `service.js:32-205`; `src/core/common/storage.js:16-24`.
* **Root cause and evidence:** A 10MB CSV is read fully into memory then processed serially in the HTTP request. Each row commits separately; temp CSVs are never deleted; no import job/status/log tables are used despite migration creating them. No import-specific rate limit is applied.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Client disconnects and restarts leave partial, non-idempotent imports and PII-bearing files. Large/slow imports exhaust workers, DB connections, and disk; horizontal replicas cannot coordinate a local job. Recovery and auditability are absent.
* **Likelihood / reproduction:** High: upload a large valid CSV, interrupt/retry it, then inspect `uploads/temp`; rows may be duplicated/partially committed and file remains.
* **Recommended fix / example implementation:** Persist an import job/idempotency key, stream to managed object storage, enqueue a worker, process bounded batches with durable per-row log/status and cleanup lifecycle; apply upload limiter and quotas.
* **Breaking-change risk / effort:** High / 2–3 weeks.

### F-11 — SSRF validation is vulnerable to DNS rebinding and incomplete address classification

* **Severity / confidence / category:** High / Medium / SSRF (CWE-918).
* **Exact files/functions:** `src/core/common/ssrf.js:36-101`; `src/modules/imports/service.js:142-160`.
* **Root cause and evidence:** It validates one DNS lookup then calls `fetch` with the hostname, which can resolve again to a private address. Native checks omit reserved/internal ranges (for example carrier-grade NAT and benchmark ranges) and do not pin a validated IP.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** An allowed import URL can reach internal services after DNS changes, exposing metadata/admin endpoints or consuming internal resources. Sequential imports magnify availability impact.
* **Likelihood / reproduction:** Medium: attacker controls DNS for an import-image hostname, returns public IP for validation then private IP for fetch.
* **Recommended fix / example implementation:** Use a maintained IP parser, resolve all A/AAAA records, reject every non-public range, and connect to the validated IP with HTTPS SNI/hostname verification or route outbound fetch through an egress proxy with network deny rules. Revalidate redirect targets.
* **Breaking-change risk / effort:** Medium / 3–5 days plus infrastructure.

### F-12 — Local disk, in-process cache, and in-memory rate limiting are not horizontally safe

* **Severity / confidence / category:** High / High / scalability, consistency.
* **Exact files/functions:** `src/core/common/storage.js:5-59`; `src/core/common/cache.js:1-51`; `src/core/middleware/rateLimiter.js:3-43`; `src/app.js:63-64`.
* **Root cause and evidence:** Media, cache invalidation, and rate-limit counters live only in a process/container filesystem/memory. The app statically serves a relative local path inconsistent with configurable storage paths.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** A request routed to another instance can return missing images/stale products; rate limits are bypassed by distributing requests; cache growth is unbounded; Vercel `/tmp` is ephemeral. State is lost on restart and cannot support multi-region.
* **Likelihood / reproduction:** Certain with two replicas: upload on A then request image through B; send 200 requests per replica to exceed intended global rate.
* **Recommended fix / example implementation:** Use object storage/CDN with immutable keys, Redis or a managed distributed cache, and a shared rate-limit store keyed on trustworthy proxy identity. Bound cache memory and metrics.
* **Breaking-change risk / effort:** High / 2–4 weeks.

### F-13 — Startup race, no graceful shutdown, no readiness/liveness contract

* **Severity / confidence / category:** High / High / SRE, deployment.
* **Exact files/functions:** `src/server.js:8-30`; `src/app.js:79-96`; `ecosystem.config.js`.
* **Root cause and evidence:** DB initialization is launched asynchronously, then `app.listen` executes immediately rather than after it resolves. Startup exits on one transient DB failure, has no SIGTERM connection drain/server close, and exposes no explicit health/readiness endpoint.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Traffic can hit a partially migrated schema; deployments flap on temporary DB/network faults; rolling deployments can terminate in-flight writes and exhaust/recycle connections. Recovery and alerting cannot distinguish dependency failure from process availability.
* **Likelihood / reproduction:** High during fresh/restarted deployment: add latency to initialization and request API immediately; send SIGTERM during a write.
* **Recommended fix / example implementation:** Make bootstrap `await initializeDatabase()` before binding/marking ready; migrate out of process; expose minimal live and dependency-aware ready endpoints; implement SIGTERM stop-accepting, request drain, pool close, timeout, and retry/backoff policy.
* **Breaking-change risk / effort:** Medium / 3–5 days.

### F-14 — Data/file mutations violate transaction boundaries and create orphaned state

* **Severity / confidence / category:** High / High / consistency.
* **Exact files/functions:** `product.service.js:335-356`; `variant.service.js:25-42, 73-87`; `imports/service.js:142-160`.
* **Root cause and evidence:** Files are deleted before product DB `COMMIT`; database image records are written separately from filesystem upload/thumbnail work. Import may insert an image record after `processImage` swallows failure and deletes its source.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** A database rollback after file deletion permanently loses live media; storage failures leave dangling DB URLs; successful imports can advertise nonexistent images. No outbox/compensation/reconciler exists.
* **Likelihood / reproduction:** High under forced I/O/database failure: delete product with storage error or import an invalid-content URL labeled image; compare DB row and storage.
* **Recommended fix / example implementation:** Stage uploads under immutable keys, commit metadata transaction, then promote asynchronously; use an outbox/retry worker and a reconciliation job. Delete media only after committed reference removal with retryable tombstones.
* **Breaking-change risk / effort:** High / 2–3 weeks.

### F-15 — Query design has unbounded join amplification and pagination inconsistency

* **Severity / confidence / category:** Medium / High / performance, API correctness.
* **Exact files/functions:** `product.repository.js:250-284, 157-222`; `product.service.js:130-171`.
* **Root cause and evidence:** Full product retrieval joins variants × images × tags, materializes all cross-product rows, then deduplicates in JS. Fuzzy fallback changes returned IDs but keeps `total` from the original FTS query. Offset pagination has no snapshot/keyset guarantee.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Products with many media/tags cause row/memory explosion and slow responses. Search pagination reports a total/pages inconsistent with actual fuzzy results; concurrent writes cause duplicates/skips. Cache only masks and multiplies stale state per instance.
* **Likelihood / reproduction:** High with products containing multiple tags/images or a fuzzy-only search.
* **Recommended fix / example implementation:** Use aggregate/lateral JSON queries or bounded follow-up queries, compute total using the same search predicate, add query-plan/load tests, and use cursor/keyset pagination for growing catalogs.
* **Breaking-change risk / effort:** Medium / 1–2 weeks.

### F-16 — Input validation is incomplete and contract-inconsistent

* **Severity / confidence / category:** Medium / High / API integrity.
* **Exact files/functions:** `product.validator.js:27-42`; `variant.validator.js:5-27`; `tag.validator.js:4-36`; `inquiries/controller.js:16-24`; `variant.controller.js:28-43`.
* **Root cause and evidence:** Update validators accept arbitrary lengths and formats for several fields; product metadata fields sent by service are not validated; route IDs/slug/lang/status query values are not normalized centrally. `display_order` upload is parsed with `|| 1`, converting valid 0 and invalid values alike. Inquiry `limit` allows negative values because only a maximum is applied.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Invalid states leak to database behavior and API semantics; negative/incorrect pagination and media ordering complicate clients and operations. Unsanitized free text is later persisted/logged; output encoding responsibility is inconsistent.
* **Likelihood / reproduction:** High: call inquiry list with `limit=-1`; upload `display_order=0`; send oversized/unbounded optional fields.
* **Recommended fix / example implementation:** Define versioned OpenAPI/JSON Schema/Zod contracts; validate every parameter/body field, cap sizes/arrays, use strict language and UUID/integer schemas, and reject unknown keys. Apply database constraints as defense in depth.
* **Breaking-change risk / effort:** Medium / 1–2 weeks.

### F-17 — Audit/observability claims are incomplete and sensitive data is retained

* **Severity / confidence / category:** Medium / High / observability, privacy.
* **Exact files/functions:** `src/core/common/audit.js:4-40`; `logging.js:3-17`; `imports/service.js`; `inquiries/repository.js:11-23`.
* **Root cause and evidence:** Audit logger records full `data` snapshots for product events and failed-login usernames/hashed token attempt context, but only selected actions call it. Inquiry/import mutations and read access are not fully audited. Logs are console/Morgan only; no structured metrics, traces, alerting, retention, redaction, or audit immutability.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** PII/business data may be stored indefinitely in mutable audit DB/logs without governance, while material operations cannot be reconstructed. Failures are swallowed, creating false assurance. No service-level signals exist to detect DB, queue, upload, security, or latency incidents.
* **Likelihood / reproduction:** Certain by submitting inquiry/import and inspecting audit records; no corresponding event is written.
* **Recommended fix / example implementation:** Create a documented event taxonomy, redaction/classification policy, retention/DSAR controls, append-only managed audit sink, structured logs with correlation IDs, metrics/traces, SLOs and alerts. Do not log raw secrets/PII unless justified and protected.
* **Breaking-change risk / effort:** Medium / 2–4 weeks.

### F-18 — No verification, deployment, recovery, or compliance delivery system

* **Severity / confidence / category:** High / High / QA, DevOps, governance.
* **Exact files/functions:** root `package.json:6-9`; `elmuttahida-frontend/package.json:6-11`; repository root; `elmuttahida-frontend/README.md`.
* **Root cause and evidence:** Backend has only `start`/`dev`; frontend has typecheck/build but no test command. No tests, CI workflow, backend Dockerfile, infrastructure-as-code, image scanning, SBOM, secret scanning, deployment policy, backup/restore test, DR runbook, or API documentation exists. README remains a generic React Router template.
* **Why / enterprise, production, security, performance, scalability, maintainability impact:** Changes cannot be validated, promoted, rolled back, or recovered with evidence. Vulnerabilities and schema drift reach production undetected. Regulatory/enterprise due diligence cannot establish data handling, RTO/RPO, change control, or ownership.
* **Likelihood / reproduction:** Certain: inspect scripts/files; only frontend Dockerfile and template README are present.
* **Recommended fix / example implementation:** Establish CI gates (lint, unit/integration/contract/e2e, migration-on-empty-DB, SAST, dependency/license/secret/container scans), immutable deploy artifacts/IaC, environment promotion/rollback, backup encryption plus restore drills, SLO runbooks, OpenAPI and ownership docs.
* **Breaking-change risk / effort:** Medium / 3–6 weeks for an initial platform baseline.

## Risk matrix

| Priority | Count | Findings |
|---|---:|---|
| Critical | 3 | F-01, F-02, F-03 |
| High | 12 | F-04 through F-14, F-18 |
| Medium | 3 | F-15, F-16, F-17 |
| Low | 0 | — |

## Immediate blockers

1. Replace/repair the migration system and prove clean-database bootstrap plus rollback/restore.
2. Repair public product SQL/schema mismatch and add endpoint integration tests.
3. Remove mock browser-only admin behavior; implement authenticated, authorized server-backed administration.
4. Fix path traversal deletion and the refresh-token concurrency flaw.
5. Patch high-severity dependencies and make dependency scanning a release gate.

## Must fix before production

All immediate blockers, F-08 through F-18, a shared durable storage/cache/rate-limit architecture, real health/readiness/graceful shutdown, import job processing, observability/alerting, test coverage, and a repeatable deployment/recovery system.

## Must fix before enterprise certification

Demonstrate independently reproducible evidence for: role/permission tests; tenant/data isolation if multi-tenant is planned; full migration/rollback/restore drills; load/soak/failure/chaos tests; SAST/DAST/dependency/SBOM controls; encrypted secret management and rotation; audit/retention/privacy controls; documented RTO/RPO; operational ownership/on-call; accessibility and browser test evidence; and a governed API contract.

## Quick wins

* Upgrade vulnerable packages and lock exact reviewed versions.
* Stop executing DDL in `src/server.js`; make startup await readiness.
* Add public visibility predicates and strict path/ID/input validation.
* Add `requirePermission` middleware and reject inactive/deleted accounts.
* Add a test script, CI workflow, `.env.example`, and accurate README.

## Long-term refactoring

Consolidate the legacy root implementation and `src/` implementation into one bounded architecture. Introduce a migration tool, API contract, managed media/object storage, Redis/queue/outbox, server-side admin BFF/session model, background import/media workers, structured telemetry, and automated verification/recovery discipline. Do not add AI features until the data, authorization, observability, and evaluation foundations are certified.

## Pass coverage and conclusion

Architecture, backend, frontend, database, security, performance, reliability, DevOps, testing, documentation, AI integration, cross-system consistency, production readiness, and enterprise certification were reviewed. Several concerns cannot be positively certified because no implementation/evidence exists: multi-region design, tenancy, backups, restore testing, monitoring/alerts, accessibility audits, load tests, compliance controls, or AI integration. Absence of evidence is a certification failure, not a pass.

No further static findings were needed to establish rejection. This report does not assert that the listed items are exhaustive of runtime defects; it records the actionable defects established from the available implementation.
