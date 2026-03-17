---
name: migration-strategy
description: "Plan and execute database migrations safely. Use when adding columns, changing schemas, or performing zero-downtime migrations."
metadata:
  tags: database, migration, schema-change, zero-downtime
---

Use the expand-contract pattern for all non-trivial schema changes in production. In the expand phase, add the new column or table alongside the existing structure, deploy application code that writes to both old and new locations, and backfill historical data. In the contract phase — only after all application instances are using the new structure and the backfill is verified — remove the old column or table. This two-phase approach ensures zero downtime because the old and new schemas coexist during the transition, and any deployment rollback remains safe since the old structure is still intact.

Design every migration to be backwards-compatible with the currently running application code. Never rename or drop a column that the current application version reads from. Adding a new NOT NULL column requires a default value or must be initially nullable with a subsequent migration to add the constraint after backfill. For large tables (millions of rows), avoid ALTER TABLE operations that rewrite the entire table — instead, use CREATE INDEX CONCURRENTLY for index additions, and pg_repack or online DDL tools for table restructuring. Always test migrations against a production-sized dataset to estimate lock duration and execution time before running in production.

Prepare a rollback plan for every migration before executing it. For additive changes (new tables, new nullable columns), rollback simply means deploying the previous application version since the new structures are ignored. For destructive changes, maintain a rollback migration script that has been tested in staging. Implement data backfill as a separate idempotent operation that can be paused and resumed — use batch processing with configurable batch sizes and progress tracking to avoid long-running transactions that block other operations. After completing a migration, verify data integrity by comparing row counts, checking constraint violations, and running application-level smoke tests against the migrated schema.
