---
name: sql-optimization
description: "Optimize SQL queries for performance. Use when troubleshooting slow queries, designing indexes, or improving database performance."
metadata:
  tags: sql, optimization, performance, indexing, database
---

Begin optimization by analyzing the query execution plan using EXPLAIN ANALYZE (PostgreSQL) or EXPLAIN FORMAT=JSON (MySQL). Look for sequential scans on large tables, nested loop joins where hash joins would be more efficient, and sort operations that spill to disk. Pay attention to the estimated versus actual row counts — large discrepancies indicate stale statistics that should be refreshed with ANALYZE. For complex queries, break down the execution plan node by node, identifying which operations consume the most time and buffer reads.

Design indexes strategically based on query patterns rather than adding indexes reactively. Create composite indexes with columns ordered by selectivity — place equality-filtered columns first, followed by range-filtered columns, with sort columns last. Use partial indexes to cover filtered subsets of data (e.g., `WHERE status = 'active'`) and expression indexes for computed lookups. Be aware of the write overhead that each index introduces; remove unused indexes identified through pg_stat_user_indexes or sys.dm_db_index_usage_stats. For read-heavy analytical queries, consider covering indexes that include all selected columns to enable index-only scans.

Rewrite queries to eliminate common anti-patterns. Replace correlated subqueries with JOINs or lateral joins where possible. Detect N+1 query patterns in application code by examining ORM-generated SQL and adding eager loading or batch queries. Use EXISTS instead of IN for subqueries that only need to check existence. For partitioned tables, ensure query predicates include the partition key to enable partition pruning — without it, the database must scan all partitions. Consider materializing expensive aggregations as materialized views with periodic refresh for dashboards and reports that tolerate slight staleness.
