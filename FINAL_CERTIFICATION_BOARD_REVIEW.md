# Final Enterprise Certification Board Review — Certification Rejected

**Board method:** The two prior reports were treated as untrusted hypotheses. Code paths were reread, dependencies inspected, a production SSR request was made, and the Sharp metadata behavior was exercised. This is an evidence adjudication, not a third copy of either audit.

## Adjudication summary

The first and second audits are directionally correct but incomplete. One F-10 subclaim is false: temporary CSV files are removed in `ImportService.importCsv`'s `finally`. Several claims are conditional on unobserved production topology and are therefore downgraded to **partial**, not asserted as unconditional outages. The remaining independently verified defects still require rejection.

## Evidence validation matrix

| Finding | Status | Confidence | Evidence directly in implementation | Updated severity / recommendation |
|---|---|---:|---|---|
| F-01 | Confirmed | High | repository reads `t.search_vector`; no versioned DDL creates it | Critical; add exact column/query migration and empty-DB integration test |
| F-02 | Confirmed | High | only migration begins `ALTER TABLE`; init reruns it without ledger | Critical; baseline + real migration runner |
| F-03 | Confirmed | High | public admin routes; mock local state; no role check | Critical; real admin auth/API + permission middleware |
| F-04 | Partially Correct | High | direct production request to `/admin/products/new` returned HTTP 500; not every route dynamically tested | High; SSR smoke-test all routes and remove render-time browser globals |
| F-05 | Confirmed | High | arbitrary `image_name` reaches `path.join` then unlink on Sharp error | High; enforce server-issued media IDs/path containment; valid token is required |
| F-06 | Confirmed | High | refresh read/revoke/insert are separate pool operations | High; atomic conditional rotation and revocation model |
| F-07 | Confirmed | High | login does not select active/deleted fields; no authorization by role | High; active-account and permission enforcement |
| F-08 | Confirmed | High | public queries have no published/deleted predicates | High; central public-visibility predicate |
| F-09 | Confirmed at audit time | High | executed `npm audit --omit=dev` reported 5 high advisories | High; upgrade/re-audit in CI; advisory state must be rechecked per release |
| F-10 | Partially Correct | High | synchronous, per-row commit and no durable job use are real; `finally` deletes temp CSV | High; rewrite without the false temp-file claim; see R2-02/R2-10 |
| F-11 | Confirmed | Medium | validate-once DNS then hostname `fetch`; incomplete native range logic | High; egress policy/IP pinning; dynamic rebinding test required |
| F-12 | Confirmed | High | process memory/disk state and relative static path | High; managed object/cache/rate-limit stores |
| F-13 | Confirmed | High | `app.listen` proceeds before initialization promise resolves; no drain hooks | High; await readiness and graceful shutdown |
| F-14 | Confirmed | High | filesystem deletion precedes commit; image process failure can still persist record | High; staged media + outbox/reconciler |
| F-15 | Confirmed | High | multiplicative joins and fuzzy-result/total mismatch | Medium; aggregate query and consistent count/cursor tests |
| F-16 | Confirmed, understated | High | `limit=-1` passes controller and PostgreSQL treats `LIMIT -1` as unlimited | **High**; normalize `1..100` before repository call and validate all input |
| F-17 | Partially Correct | Medium | incomplete audit coverage is proven; external retention/PII classification is not | Medium; define event/redaction/retention controls |
| F-18 | Confirmed | High | no test scripts/files, backend container/IaC/CI, or accurate project docs | High; delivery/recovery control baseline |
| R2-01 | Confirmed | High | dynamic Sharp result retained injected EXIF marker | High; remove `keepMetadata(false)`, reprocess assets |
| R2-02 | Confirmed | High | import transaction client is bypassed by tag repository pool calls | High; pass one client/unit of work |
| R2-03 | Confirmed | High | global SKU collision silently succeeds; import skips cap check | High; ownership conflict + DB invariant |
| R2-04 | Confirmed | High | link operation has no transaction and check/insert race | High; atomic upsert/transaction |
| R2-05 | Confirmed | High | no trust-proxy policy; raw XFF stored | High; canonical trusted proxy configuration |
| R2-06 | Partially Correct | High | global CORP same-origin plus absolute API media URLs is proven; actual deployed origins are not | High when frontend/API origins differ; scope CORP or co-locate/CDN media |
| R2-07 | Confirmed | High | public SSR fetches have no AbortSignal and are sequential | High; deadline, cancellation, aggregate endpoint |
| R2-08 | Confirmed | High | hard-coded demo items link to API-missing `demo-*` products | Medium; remove fabricated catalogue fallback |
| R2-09 | Confirmed | High | token table has no FK, purge process, or queried lineage | Medium; FK/lifecycle/index design |
| R2-10 | Confirmed | High | unlimited URL list; failures logged then row still succeeds | High; quotas and durable per-image result contract |
| R2-11 | Confirmed | High | generator includes same product's old slug; no version predicate | Medium; exclude own product and optimistic concurrency |
| R2-12 | Confirmed | High | advertised enterprise tables lack listed invariants | Medium; add constraints before feature use |

## Newly discovered and independently verified issues

### B-01 — Refresh and logout without a JSON body throw instead of returning an authentication error

* **Severity / confidence / category:** Medium / High / API reliability, authentication error handling.
* **Files/functions:** `src/modules/auth/controller.js:28-31,49-51`, `AuthController.refresh`, `AuthController.logout`.
* **Root cause/evidence:** `express.json()` does not guarantee `req.body` for a bodyless request. Both methods evaluate `req.body.refreshToken` before their `try` block and without optional chaining. A cookie-less `POST /api/auth/refresh` or `/logout` with no JSON body can throw `TypeError`, bypassing intended `AuthenticationError` handling.
* **Reproduction:** Send `POST /api/auth/refresh` with no cookie, content type, or body; observe 500 rather than a deterministic 401/400.
* **Production/security/performance/scalability/maintainability impact:** Clients cannot distinguish invalid credentials from server fault; error telemetry is polluted and retry loops can result. Direct privilege escalation is not shown. The defect is cheap but pervasive for mobile/network-edge clients.
* **Recommended fix / effort / breaking risk:** use `req.cookies?.refreshToken || req.body?.refreshToken`, move extraction inside `try`, and return a stable 401; add bodyless endpoint tests. Low / <1 day.

### B-02 — Inquiry endpoint permits unbounded order quantities and ignores variant minimum order quantity

* **Severity / confidence / category:** Medium / High / business validation, data integrity.
* **Files/functions:** `src/modules/inquiries/validator.js:5-19`; `service.js:4-30`; `repository.js:3-24`.
* **Root cause/evidence:** validation only requires `quantity` to be integer >=1; it neither caps it nor reads `product_variants.min_order_qty`. Repository verifies SKU existence only, then stores client supplied item JSON.
* **Reproduction:** Submit a valid SKU with `quantity: 1` when its minimum is >1, or a very large integer. Response is 201 and value is retained.
* **Production/security/performance/scalability/maintainability impact:** Quotes and fulfilment can be based on impossible/abusive requests; very large values are accepted into downstream workflows. Direct security impact is low; commercial/data integrity and support impact are material.
* **Recommended fix / effort / breaking risk:** query SKU and minimum quantity in one set query, enforce/cap quantity, snapshot only permitted product data, and define an explicit partial/invalid-item contract. Medium / 2–3 days.

### B-03 — Database transport and failure budgets are unspecified in active pool configuration

* **Severity / confidence / category:** High / High / database security, availability.
* **Files/functions:** `src/core/database/db.js:6-12`; `src/config/index.js:38-45`.
* **Root cause/evidence:** active `pg.Pool` config supplies credentials/host/port only—no `ssl`, `connectionTimeoutMillis`, `idleTimeoutMillis`, `statement_timeout`, `query_timeout`, `max`, or application name. No infrastructure source establishes a compensating control.
* **Reproduction:** Configure a remote PostgreSQL endpoint that requires TLS; connection fails. Against a slow/blocked database, requests hold sockets/pool resources until driver/server defaults rather than a defined service budget.
* **Production/security/performance/scalability/maintainability impact:** If database traffic crosses an untrusted network, credentials and data lack application-enforced TLS. Slow queries exhaust the implicit pool and cascade into API/SSR timeouts. Behavior changes across environments and is not operationally tunable.
* **Recommended fix / effort / breaking risk:** require validated TLS (`ssl` CA/rejectUnauthorized policy) outside explicitly local development; define pool and statement/connection timeouts from validated config; set database-side roles/timeouts. Medium / 2–4 days plus infrastructure validation.

### B-04 — Root document permanently declares English/LTR despite client Arabic mode

* **Severity / confidence / category:** Medium / High / accessibility, localization, SEO.
* **Files/functions:** `elmuttahida-frontend/app/root.tsx:42-63`; `context/LanguageContext.tsx:17-54`.
* **Root cause/evidence:** document root is hard-coded `<html lang="en" dir="ltr">`. Language provider changes an inner wrapper only after hydration from local storage; it cannot update document language/direction or provide language-specific SSR/URLs.
* **Reproduction:** select Arabic, inspect `document.documentElement.lang` and `dir`, or view server HTML: values remain `en`/`ltr`.
* **Production/security/performance/scalability/maintainability impact:** screen readers, search engines, browser text handling, and bidirectional layout receive incorrect document semantics; Arabic response is not indexable/deliverable as a stable localized representation. Security impact is none; maintainability suffers from client-only locale state.
* **Recommended fix / effort / breaking risk:** negotiate locale server-side (path/domain/cookie), set root document attributes from loader data, expose canonical/hreflang localized URLs, and test RTL keyboard/screen-reader flows. Medium / 1–2 weeks.

### B-05 — External font delivery is an undocumented third-party privacy/availability dependency

* **Severity / confidence / category:** Low / High / privacy, resilience.
* **Files/functions:** `elmuttahida-frontend/app/root.tsx:18-34`.
* **Root cause/evidence:** every page preconnects to and loads Google Fonts/Google static assets. No consent, vendor assessment, self-hosted fallback, SRI/pinning, or documented privacy basis is present.
* **Reproduction:** load any frontend route with network inspector; requests go to `fonts.googleapis.com` and `fonts.gstatic.com`.
* **Production/security/performance/scalability/maintainability impact:** visitor IP/user agent is disclosed to a third party, regulated deployments may require a legal basis, and render quality depends on external availability. It adds latency and a vendor outage path.
* **Recommended fix / effort / breaking risk:** self-host licensed font subsets with `font-display`, document vendor/data-processing decision if retained, and test offline/CSP behavior. Low / 1–3 days.

## Remaining issue counts after adjudication

* **Critical:** 3 (F-01, F-02, F-03).
* **High:** 21 (F-04–F-14, F-16, F-18; R2-01–R2-05, R2-07, R2-10; B-03). These counts are issue-level, not dependency-advisory count. R2-06 remains a high-severity conditional deployment risk until deployed origins are evidenced.
* **Medium:** 9 (F-15, F-17, R2-08, R2-09, R2-11, R2-12, B-01, B-02, B-04).
* **Low:** 1 (B-05).

## Missing evidence and controls

* **Enterprise/security:** role/permission model, external secret manager/rotation, cloud IAM/network/TLS configuration, SBOM/license/SAST/DAST evidence, privacy retention/DSAR controls, penetration-test results.
* **Operational/reliability/observability:** production health/readiness contract, structured logs/metrics/traces/alerts, SLOs and on-call ownership, graceful deployment evidence, queue/outbox design, incident/runbook records.
* **Testing:** unit, API, database-migration-from-empty, contract, browser/SSR, accessibility/RTL, concurrency, security regression, load/soak, and failure-recovery tests are absent.
* **Documentation/compliance/DR:** accurate architecture/API/data-flow documents; system/data owners; classification and retention; backup encryption; verified point-in-time restore; RTO/RPO evidence; regional and credential-compromise recovery drills.
* **Scalability:** query plans and cardinality data, representative throughput/latency/error targets, pool limits, cache/rate-limit store behavior, object-storage/CDN design, multi-instance and multi-region tests.

## Required dynamic verification before reconsideration

1. Apply migrations to an empty disposable PostgreSQL instance and run every endpoint contract.
2. Run authenticated role matrix, inactive/deleted account, refresh-replay, path traversal, SSRF DNS rebinding, XFF/proxy, CORS/CORP, and multipart/image corpus tests.
3. Load/soak catalogue/search, image upload, import fan-out, concurrent tag/product updates, database slowness, cache pressure, and SSR dependency outage scenarios.
4. Execute chaos experiments for process kill during writes/imports, disk/object storage failure, database failover/slow query, network/DNS outage, rolling deploy, and rate-limit-store outage after redesign.
5. Demonstrate encrypted backup restore, PITR, media/database reconciliation, migration rollback, session/secret compromise response, and measured RTO/RPO.

## Final enterprise certification decision

**REJECT.** Certification cannot be granted: three critical defects remain, no high-severity defect has been remediated or justified with production evidence, and foundational security, database, testing, operational, recovery, and scalability controls are absent. The required path is a verifiable architecture and delivery-system remediation followed by a fresh independent assessment—not attestation based on these reports.
