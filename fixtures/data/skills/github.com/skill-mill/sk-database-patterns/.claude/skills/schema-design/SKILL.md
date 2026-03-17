---
name: schema-design
description: "Design relational database schemas following normalization and performance best practices. Use when creating new tables or refactoring existing schemas."
metadata:
  tags: database, schema, design, normalization, postgresql
---

Start schema design at Third Normal Form (3NF) to eliminate data redundancy and update anomalies. Ensure every non-key column depends on the whole primary key (2NF) and only on the primary key (3NF). Identify candidate keys carefully — natural keys like email addresses or SKUs may seem unique but can change over time, so prefer surrogate keys (UUIDs or auto-incrementing integers) as primary keys while enforcing natural key uniqueness via unique constraints. Define explicit foreign key constraints to maintain referential integrity, and choose appropriate ON DELETE behaviors (RESTRICT for critical references, CASCADE for owned child records, SET NULL for optional associations).

Apply controlled denormalization only when query performance demands it and the trade-offs are well understood. Common denormalization patterns include adding a computed count column to avoid expensive COUNT queries, storing a cached full name alongside first/last name columns, or embedding frequently-joined lookup values directly in the parent table. Document every denormalization decision with the justification and the mechanism that keeps the denormalized data consistent — whether that is application-level logic, database triggers, or periodic reconciliation jobs. Use JSONB columns sparingly for truly semi-structured data, not as a shortcut to avoid proper schema modeling.

Follow consistent naming conventions across the entire schema: use snake_case for all identifiers, plural table names (users, orders, line_items), and suffix foreign keys with _id. Include created_at and updated_at timestamp columns on every table with appropriate defaults and triggers. Plan migrations incrementally — each migration should be small, reversible, and deployable independently. For large tables, consider partitioning by date range or tenant ID from the beginning, as retrofitting partitioning onto an existing table is significantly more complex than designing for it upfront.
