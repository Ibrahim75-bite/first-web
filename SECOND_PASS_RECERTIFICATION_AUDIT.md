# Second-Pass Enterprise Recertification Audit — Rejected

**Date:** 2026-08-03  
**Scope and rule:** independent zero-trust pass over the same repository. This report contains only new findings, corrections, and revisions to the first report; it does not restate first-pass findings.

## Validation performed

* Re-read active services, repositories, routers, storage, migration, cache, authentication, SSR loaders, and legacy artifacts.
* Ran the frontend production server and directly requested `/admin/products/new`: it returned **HTTP 500**, confirming—not merely inferring—the SSR failure in the first report.
* Executed a Sharp metadata regression: a JPEG containing an `audit-marker` EXIF value was processed with the exact `.rotate().keepMetadata(false)` chain. Output was `{inputHasExif:true, outputHasExif:true, outputCopyright:true}`.
* Traced transaction handles versus pool calls, endpoint paths, state transitions, and schema declarations. No database was mutated.

## New findings

### R2-01 — Image sanitization preserves EXIF/GPS metadata

* **Severity / confidence / CWE / OWASP:** High / High / CWE-200 / OWASP A02:2021 Cryptographic Failures (sensitive-data exposure).
* **Category; exact files/functions:** privacy, file processing; `src/core/utils/image.js:30-46`, `validateAndProcessImage`.
* **Root cause and evidence:** Sharp's `keepMetadata()` takes no disabling parameter; its source sets `keepMetadata = 0b11111`. Passing `false` still invokes it. The dynamic regression preserved a deliberately injected EXIF `audit-marker`.
* **Why prior audit missed it:** the first pass accepted the security comment without verifying the library call semantics.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Uploaded product images can disclose GPS, device, author, copyright, or embedded metadata through public `/images` URLs. Privacy/compliance exposure is high; performance/scalability impact is low, while the misleading comment makes recurrence likely.
* **Reproduction:** Process a JPEG with EXIF through `validateAndProcessImage`, then read output metadata using `sharp(output).metadata()`; EXIF remains.
* **Recommended fix:** remove `.keepMetadata(false)` entirely (Sharp strips metadata by default), re-encode to an explicitly controlled format, and add fixture tests that assert EXIF/IPTC/XMP absence. Reprocess existing public assets.
* **Breaking-change risk / effort:** Low / 1–2 days plus media migration.

### R2-02 — Import tag linking escapes the row transaction and fails for new products

* **Severity / confidence / CWE / OWASP:** High / High / CWE-703 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** transaction integrity; `src/modules/imports/service.js:79-127`, `ImportService.importCsv`; `src/modules/products/repositories/tag.repository.js:20-35,71-74`.
* **Root cause and evidence:** The import inserts a new product through `client` inside `BEGIN`, then calls tag lookup/link methods that use global `pool.query`, not that transaction. A different connection cannot see the uncommitted product; the foreign-key insert into `product_tags` can fail. The link is also not atomically tied to the row transaction.
* **Why prior audit missed it:** F-10 identified row-level partial imports but did not trace repository connection ownership.
* **Production / enterprise / security / performance / scalability / maintainability impact:** A valid newly imported product with tags can fail or behave connection-pool-dependently. It produces data-loss/partial-import incidents and destroys determinism under scale. Security impact is indirect; retry pressure and debugging cost increase.
* **Reproduction:** On a pool with a separate free connection, import a new model with an existing `tags` value; observe the foreign-key visibility failure and row rollback.
* **Recommended fix:** every repository method participating in a unit of work must accept/use the same `client`; start one explicit row transaction, or redesign imports as durable batch jobs. Add a test that forces distinct pool connections.
* **Breaking-change risk / effort:** Medium / 2–4 days.

### R2-03 — SKU/model identity collisions are silently reported as successful and imports bypass the variant cap

* **Severity / confidence / CWE / OWASP:** High / High / CWE-840 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** business/data integrity; `product.service.js:192-246`; `imports/service.js:83-173`.
* **Root cause and evidence:** Both flows locate a product by `model_code` then locate a variant globally by `sku`. If that SKU belongs to another product, they skip insert and return a success response without checking ownership. The import path does not call `countByProductId`, so it can add more than the API's claimed four-variant maximum.
* **Why prior audit missed it:** first pass assessed transaction/file failures, not the cross-entity identity state machine.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Operators receive false success; imports can create a product with translations but no intended variant, or violate catalog policy. Replays conceal conflicts instead of requiring resolution. Data remediation, customer catalog accuracy, and auditability suffer; direct security/performance impact is low.
* **Reproduction:** Create product A/SKU A. Submit product B with SKU A via API or CSV; response reports success while SKU A remains attached to A. Import five unique SKUs for one model and observe cap bypass.
* **Recommended fix:** enforce database `UNIQUE(sku)` and ownership-aware conflict handling; return 409 if SKU belongs elsewhere; enforce the variant limit in a transaction/database constraint for every write path. Define idempotency as same model+same SKU only.
* **Breaking-change risk / effort:** Medium / 3–5 days plus remediation.

### R2-04 — Multi-tag link requests are non-atomic and race-prone

* **Severity / confidence / CWE / OWASP:** High / High / CWE-362 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** concurrency/consistency; `src/modules/products/services/tag.service.js:103-139`; `tag.repository.js:32-35,71-74`.
* **Root cause and evidence:** `linkProduct` acquires a client but starts no transaction and uses global-pool check-then-insert calls for each tag. Concurrent calls can both see no link; one then violates the composite primary key. Earlier inserts from the same request remain committed when a later insertion fails.
* **Why prior audit missed it:** it was hidden behind the apparently transactional service abstraction.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Clients receive a failure with an unknown partially linked tag set, retry and conflict, and lose all-or-nothing behavior. Incidents rise as concurrent admin/import activity grows. Security impact is low; maintainability is poor because the client handle signals a transaction that does not exist.
* **Reproduction:** Send two parallel `POST /api/products/{id}/tags` requests with the same new tag plus different second tags; inspect links after one conflict response.
* **Recommended fix:** use a single transaction client; insert the normalized complete set via `INSERT ... ON CONFLICT DO NOTHING`, then return final state. Decide/document whether absent tags are an atomic validation failure.
* **Breaking-change risk / effort:** Low–Medium / 2–3 days.

### R2-05 — Trusted-client identity is neither configured nor normalized

* **Severity / confidence / CWE / OWASP:** High / High / CWE-290, CWE-117 / OWASP A09:2021 Security Logging and Monitoring Failures.
* **Category; exact files/functions:** networking, rate-limit correctness, audit integrity; `src/app.js:24-74`; `src/core/common/context.js:6-22`; `rateLimiter.js:3-43`.
* **Root cause and evidence:** no `app.set('trust proxy', ...)` policy exists. Rate limiter uses Express `req.ip`, which will collapse users behind a reverse proxy to the proxy address when proxy trust is not configured. Separately, audit context directly records attacker-supplied `X-Forwarded-For` and `X-Request-Id` without selecting/validating a trusted hop or limiting size/format.
* **Why prior audit missed it:** F-12 covered in-memory rate-limit sharing but not the contradictory per-request proxy identity logic.
* **Production / enterprise / security / performance / scalability / maintainability impact:** One client can exhaust the shared proxy bucket and deny service to all users; audit records can be forged, undermining forensic/legal evidence and correlation. Bad headers grow logs/audit rows. Inconsistent proxy deployment changes behavior without code changes.
* **Reproduction:** Deploy behind a reverse proxy without trust-proxy configuration; requests from distinct external IPs share one limiter key. Send a request with `X-Forwarded-For: 203.0.113.99` and observe that value recorded in audit context.
* **Recommended fix:** define an explicit trusted proxy CIDR/hop configuration per environment, derive canonical client IP through framework support only, reject/normalize oversized correlation IDs, and test direct/proxied request behavior.
* **Breaking-change risk / effort:** Medium / 2–4 days plus infrastructure config.

### R2-06 — Public image delivery is incompatible with the intended separate frontend origin

* **Severity / confidence / CWE / OWASP:** High / High / CWE-693 / OWASP A05:2021 Security Misconfiguration.
* **Category; exact files/functions:** browser/network integration; `src/core/middleware/security.js:35-58`; `src/app.js:35-64`; product image URL construction in `product.service.js:13-22`.
* **Root cause and evidence:** Helmet sends `Cross-Origin-Resource-Policy: same-origin` globally, including `/images`. Product JSON emits absolute `BASE_URL` image URLs, while CORS explicitly supports a distinct `FRONTEND_URL`. Browser CORP blocks a no-CORS image response requested from a different origin; CORS headers do not override CORP for ordinary `<img>` loads.
* **Why prior audit missed it:** headers were reviewed for presence, not for their interaction with the frontend deployment topology.
* **Production / enterprise / security / performance / scalability / maintainability impact:** In the designed API/frontend split deployment, catalogue/product images fail to render. Users get broken product pages; support load and conversion loss are high. Security hardening becomes a functional outage; multi-origin/CDN scalability is blocked.
* **Reproduction:** Host frontend and API on different origins, call the catalogue, and inspect browser console/network for CORP-blocked image responses.
* **Recommended fix:** serve media through the same site/CDN origin or use `Cross-Origin-Resource-Policy: cross-origin` only on intentionally public media, with a narrowly scoped static middleware and documented threat model. Add browser integration tests.
* **Breaking-change risk / effort:** Medium / 2–4 days.

### R2-07 — Frontend SSR loaders have no timeout/cancellation and create avoidable API waterfalls

* **Severity / confidence / CWE / OWASP:** High / High / CWE-400 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** availability/performance; `elmuttahida-frontend/app/routes/product.$slug.tsx:7-91`; `catalogue.tsx:9-23`.
* **Root cause and evidence:** Server loaders call `fetch` without `AbortSignal`/deadline. Product page makes a product request then up to two sequential recommendation requests. A stalled backend connection holds SSR capacity for the platform default fetch timeout; requests are not deduplicated or bounded by a page-level latency budget.
* **Why prior audit missed it:** first pass focused on broken admin SSR and did not evaluate the public SSR dependency chain.
* **Production / enterprise / security / performance / scalability / maintainability impact:** A slow/unavailable API can pin frontend workers, create cascading retries, and make product pages unavailable. Each page view amplifies backend load by up to three requests. This degrades autoscaling and creates a simple availability attack surface.
* **Reproduction:** Blackhole or delay the API response, request `/product/{slug}`, and measure the frontend request remains open until the fetch runtime timeout; observe sequential API calls in traces.
* **Recommended fix:** use an AbortController/page deadline, request recommendations in parallel or expose a single bounded backend endpoint, apply circuit breakers and stale/empty fallback, and propagate request cancellation.
* **Breaking-change risk / effort:** Medium / 3–5 days.

### R2-08 — Product detail fabricates inventory recommendations and routes them to guaranteed 404s

* **Severity / confidence / CWE / OWASP:** Medium / High / CWE-840 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** frontend business integrity; `elmuttahida-frontend/app/routes/product.$slug.tsx:56-84,520-523`.
* **Root cause and evidence:** When no recommendations are returned, the loader inserts three hard-coded `demo-*` products with external Unsplash images. Links resolve to `/product/demo-*`; loader subsequently requests API records that do not exist.
* **Why prior audit missed it:** it was concealed as a UI fallback, outside the admin mock flow already reported.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Customers see non-existent products and are routed to errors; content integrity and SEO trust suffer. External image fetches introduce an ungoverned third-party dependency and tracking exposure. Performance/scalability impact is low to medium.
* **Reproduction:** View a product when it has no related catalog items; click any recommendation.
* **Recommended fix:** render an empty recommendations state, or only link real, API-supplied published products. Govern any third-party media through approved storage/CDN and CSP.
* **Breaking-change risk / effort:** Low / <1 day.

### R2-09 — Refresh token table has no referential integrity, lifecycle cleanup, or usable replacement lineage

* **Severity / confidence / CWE / OWASP:** Medium / High / CWE-404 / OWASP A07:2021 Identification and Authentication Failures.
* **Category; exact files/functions:** database authentication lifecycle; `src/core/database/init.js:17-28`; `auth.repository.js:10-52`; `auth.service.js:64-116`.
* **Root cause and evidence:** `refresh_tokens.user_id` is only `INT NOT NULL`; the comment claims an admin reference but no foreign key is declared. `replaced_by_token_hash` has no foreign key/constraint and is never queried. No cleanup job/index by expiry/revoked state exists.
* **Why prior audit missed it:** F-06 addressed atomic rotation but not the underlying table's lifecycle and integrity model.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Deleted users leave durable credential records; orphan/revoked rows grow indefinitely; investigations cannot reliably traverse session lineage. Login/refresh scans and revoke-all work degrade over time. Security and compliance retention/deprovisioning controls are incomplete.
* **Reproduction:** Delete an admin row (or use an ID that no longer maps), inspect `refresh_tokens`; row remains valid structurally. Repeated login/refresh grows records with no deletion process.
* **Recommended fix:** add a foreign key with a deliberate deletion policy, session ID and replacement FK/lineage design, expiry/revocation indexes, and scheduled purge compliant with retention requirements. Couple to the atomic rotation fix.
* **Breaking-change risk / effort:** Medium / 3–5 days.

### R2-10 — CSV import bypasses media quotas and misreports failed images as successful rows

* **Severity / confidence / CWE / OWASP:** High / High / CWE-400 / OWASP API4:2023 Unrestricted Resource Consumption.
* **Category; exact files/functions:** import validation/resource accounting; `imports/service.js:141-168,172-190`; `core/utils/image.js:62-69`.
* **Root cause and evidence:** The 10MB CSV can contain an unbounded pipe-delimited image URL list. Each URL can download up to 10MB and is written to disk; the normal upload's 5MB limit and image-count quota do not apply. `processImage` catches validation failures and returns `null`; the service still inserts the image record and increments row success. Fetch failures are merely logged and do not mark the row failed.
* **Why prior audit missed it:** F-10 correctly identified synchronous import pressure but did not identify the separate per-row media-limit bypass and false success accounting.
* **Production / enterprise / security / performance / scalability / maintainability impact:** A privileged importer can consume arbitrary disk/CPU/network over one accepted CSV, create dangling image records, and receive a misleading successful import result. Monitoring, reconciliation, and customer catalog accuracy fail. Horizontal instances magnify resource demand.
* **Reproduction:** Import one valid row with many pipe-separated inaccessible/non-image URLs or enough valid large image URLs; response counts row success and database can contain image names missing from storage.
* **Recommended fix:** set max URLs/row and aggregate byte/image quotas; require `processImage` success before persistence; classify every image failure in durable row status and fail/explicitly partial the row by contract; enforce quotas in worker/object storage.
* **Breaking-change risk / effort:** Medium / 3–5 days (or include in import redesign).

### R2-11 — Product rename needlessly changes an unchanged slug and has no lost-update protection

* **Severity / confidence / CWE / OWASP:** Medium / High / CWE-362 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** catalog consistency; `product.service.js:255-325`; `core/utils/slug.js:16-35`; `product.repository.js:282-303`.
* **Root cause and evidence:** `generateUniqueSlug` tests every existing translation without excluding the product currently being updated. Renaming a product to its current name therefore produces `name-2`; repeated unchanged updates produce `name-3`, etc. No row version, `updated_at` predicate, ETag, or lock prevents last-writer-wins updates.
* **Why prior audit missed it:** first pass found general write/cache risks but did not trace self-collision behavior and concurrent editor semantics.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Stable public URLs silently churn, breaking SEO, backlinks, and caches. Concurrent editors overwrite each other's fields with no conflict signal. Security/performance impact is low; enterprise content governance and maintainability impact are material.
* **Reproduction:** Update product English name to its existing value twice; inspect slug becomes suffixed each time. Send two updates based on the same representation; later request wins silently.
* **Recommended fix:** generate uniqueness excluding `product_id`, retain slugs when normalized name is unchanged, maintain redirects/history, and add optimistic `version`/`updated_at` conditional writes with 409 on conflict.
* **Breaking-change risk / effort:** Medium / 3–5 days.

### R2-12 — Versioned schema permits invalid relationship graphs and duplicate media associations

* **Severity / confidence / CWE / OWASP:** Medium / High / CWE-20 / OWASP A04:2021 Insecure Design.
* **Category; exact files/functions:** database integrity; `001_enterprise_upgrade.sql:44-113,140-145,162-170,196-205`.
* **Root cause and evidence:** `media_folders.parent_id` permits cycles; `product_relations` permits self-relations and inverse duplicates; `variant_media` has no unique `(variant_id, media_id)`; article/category translated slugs lack appropriate scoped uniqueness; `entity_revisions` lacks a unique `(entity_type, entity_id, revision_number)`.
* **Why prior audit missed it:** the initial migration assessment focused on bootstrap and missing FTS field, not the newly advertised enterprise tables' invariant set.
* **Production / enterprise / security / performance / scalability / maintainability impact:** Once these tables are used, cycles can break recursive traversal, duplicate relationships/media produce inconsistent UI, and revision numbers cease to be authoritative. Cleanup queries and access checks become increasingly expensive. Direct security impact is low; data governance impact is medium.
* **Reproduction:** Insert a folder then make it its own ancestor; insert product relation `(p,p,'related')`; insert same variant/media pair twice; insert two revisions with same number.
* **Recommended fix:** add CHECK constraints (no self relation), unique constraints, reverse-pair policy, recursive-cycle prevention trigger/application transaction, scoped slug uniqueness, and revision uniqueness. Add migration tests.
* **Breaking-change risk / effort:** Medium / 3–5 days plus data cleanup.

## Corrections and changes to the first report

1. **F-10 must be rewritten.** `src/modules/imports/service.js:193-200` does remove the temporary CSV in `finally`; the earlier statement that temp CSVs are never deleted was incorrect. Retain the findings on synchronous HTTP processing, row-level partial commits, no durable job/log use, and resource exhaustion. Replace the deleted-file assertion with R2-02 and R2-10.
2. **F-04 is now dynamically proven.** Production frontend direct request to `/admin/products/new` returned HTTP 500.
3. **F-05 should be narrowed.** The path traversal deletion is real, but exploitation requires a valid bearer token and filesystem write rights to the target. Its severity remains High because F-07 grants broad write capability to any valid role, but it is not an anonymous deletion.
4. **F-11 should be strengthened with R2-10, not duplicated.** SSRF itself remains a distinct concern; unbounded media fan-out is a separate resource-control defect.
5. **F-12 should be split in remediation.** Distributed storage/cache/rate-limit state is distinct from proxy identity correctness (R2-05) and CORP/media delivery (R2-06).

## Required answers

1. **Is the previous audit complete?** No. It missed twelve new, actionable defects and contained one incorrect temporary-file assertion.
2. **Critical issues previously missed?** No additional issue is rated Critical under the evidence available; R2-02, R2-03, R2-04, R2-05, R2-06, R2-07, and R2-10 are High and independently sustain rejection.
3. **Which findings should be rewritten?** F-10, F-04, F-05, F-11, and F-12 as specified above.
4. **Which findings should be merged?** Merge F-10's removed temp-file subclaim into R2-10's quota/accounting remediation only after correcting it; keep F-11 SSRF separate. Link F-12 and R2-05/R2-06 under a deployment-topology workstream, but do not merge their root causes.
5. **Which findings were overstated?** F-10's statement that temporary CSV files are never cleaned up. The dynamic test did not prove every SSR route fails—only the tested admin route—so describe F-04 by affected route rather than all admin rendering.
6. **Which findings were understated?** F-04 is now proven; F-05's precondition should be explicit; F-10 omitted connection-boundary, image fan-out, and false-success failures; F-12 omitted proxy identity and browser CORP interaction.
7. **Areas still with insufficient evidence?** Actual base schema/data constraints, production proxy/CDN configuration, database query plans, deployed TLS/secrets, backup/restore capability, cloud IAM/network policy, real traffic/load, and whether any external systems consume this API.
8. **Additional dynamic tests required:** disposable PostgreSQL migration-from-empty and upgrade tests; API contract/error tests; cross-origin browser tests; SSR route sweep; transaction/concurrency harness; image corpus tests; import restart/disconnect tests; and storage-failure reconciliation tests.
9. **Penetration tests:** authenticated path traversal/delete validation; RBAC role matrix and inactive-account tests; refresh replay race; SSRF DNS-rebinding/redirect/private-range tests; multipart parser DoS after upgrade; proxy/XFF audit spoofing; CORS/CORP origin tests; dependency exploitation validation in isolated environment.
10. **Load tests:** catalogue search with large tag/image cardinality; cache-key cardinality/stampede; concurrent refresh/login; import media fan-out; upload/image processing CPU/memory; rate limiter behind representative proxy; frontend SSR API latency saturation.
11. **Chaos experiments:** terminate API during SSR; kill worker/process during import; database failover/slow query; object-storage failures; cache/rate-limit-store outage after redesign; DNS rebinding/egress failure; disk-full and Sharp failure; rolling restart under writes.
12. **DR tests:** point-in-time restore to isolated environment, encrypted backup restore, media/database consistency restore, migration rollback rehearsal, region/site loss simulation, credential compromise/session revocation, and documented RTO/RPO measurement.
13. **Manual reviews still required:** baseline DB schema and every existing constraint; deployment/IAM/network/TLS manifests; secret rotation; legal privacy/retention; accessibility keyboard/screen-reader/RTL review; API versioning; admin workflow/product ownership; code-review history and third-party licenses.
14. **Evidence still missing for certification:** all testing/operational/deployment/DR evidence above, a secure architecture decision record, control owners, change-management records, SLOs, monitoring evidence, and verified remediation results.
15. **Top reasons to reject again:** non-repeatable database state, broken/non-authoritative admin workflow, broad authorization failure, transaction/data-integrity defects, unbounded import/media resource consumption, browser media outage topology, and absence of demonstrable test/operations/DR controls.

## Second-pass decision

**Recertification is rejected.** The first report was directionally correct but incomplete. The newly found high-severity defects show that remediation must be validated through a redesigned, tested delivery system—not by isolated code edits.
