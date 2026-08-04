# WS2 Operational Runbook — Database Migrations & Rollback

## Operational Instructions

### Running Migrations
To execute all pending database migrations:
```bash
npm run migrate
```
Or programmatically at server bootstrap via `initializeDatabase()`.

### Checking Migration Status
To inspect currently applied migrations and checksums:
```bash
npm run migrate:status
```

### Adding New Migrations
1. Create a new `.sql` file in `src/core/database/migrations/` using zero-padded 3-digit prefixes (e.g. `004_new_feature.sql`).
2. Write idempotent, transactional DDL.
3. Test applying against a fresh database instance.
4. **Never edit an existing migration file** after it has been executed in any environment; create a forward-fix migration script instead.

### Disaster Recovery & Migration Rollback
If a migration fails during deployment:
1. The transaction automatically rolls back via database transaction boundaries.
2. Check `schema_migrations` to identify the last successful version.
3. Restore DB from Point-In-Time-Recovery (PITR) backup if structural corruption occurred prior to migration attempt.
