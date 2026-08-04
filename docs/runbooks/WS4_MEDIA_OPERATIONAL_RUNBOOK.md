# WS4 Operational Runbook — Media Library & SSRF Controls

## Operational Procedures

### Media Directory Storage Maintenance
Uploaded media assets and generated WebP thumbnails reside in:
* `uploads/`
* `uploads/thumbnails/`

### Cleaning Orphaned Upload Files
If temporary image processing fails during file uploads:
```bash
# Purge temporary sanitized upload files older than 24 hours
find uploads/ -name "*.sanitized" -mtime +1 -delete
```

### SSRF Whitelist Configuration
Outbound remote fetches (e.g. bulk CSV product image imports) validate target domains against DNS resolution rules. Ensure cloud egress rules do not bypass DNS lookup guards.
