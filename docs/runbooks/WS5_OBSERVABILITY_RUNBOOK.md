# WS5 Operational Runbook — Observability & Monitoring

## Operating Instructions

### Log Aggregation Setup
Configure log collectors (Datadog, AWS CloudWatch, Elasticsearch/Fluentbit) to parse standard stdout/stderr JSON lines.
Key fields to index:
* `requestId`
* `userId`
* `status`
* `durationMs`
* `level`

### Health Check Endpoint Probe Setup
* **Kubernetes Liveness Probe**:
  - Path: `/health`
  - InitialDelaySeconds: 5
  - PeriodSeconds: 10
* **Kubernetes Readiness Probe**:
  - Path: `/ready`
  - InitialDelaySeconds: 10
  - PeriodSeconds: 5
  - FailureThreshold: 3
