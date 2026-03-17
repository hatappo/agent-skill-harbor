---
name: data-validation
description: "Implement data validation and quality checks for data pipelines. Use when ensuring data integrity, schema conformance, or building data contracts."
metadata:
  tags: data, validation, quality, schema, contracts
---

Define schemas explicitly at pipeline boundaries using typed validation libraries. For Python pipelines, use Pydantic models to validate incoming records with strict type coercion, custom validators for business rules, and clear error messages when validation fails. For TypeScript/Node.js pipelines, use Zod schemas that provide runtime validation with static type inference. Schema definitions should live alongside the pipeline code and be versioned — when a schema changes, the change should be reviewed as a breaking or non-breaking modification to the data contract between producer and consumer.

Establish data contracts between upstream producers and downstream consumers to set expectations about data shape, freshness, and quality. A data contract should specify the schema (column names, types, nullability), SLAs for delivery frequency and latency, and quality thresholds (e.g., null rate below 1% for required fields, uniqueness constraints on key columns). Implement contract checks as automated tests that run after each pipeline execution and publish results to a centralized data quality dashboard. Use Great Expectations or similar frameworks to define expectation suites that are reusable across datasets and environments.

For anomaly detection, establish statistical baselines for key data characteristics — row counts, value distributions, cardinality of categorical columns — and flag deviations that exceed configurable thresholds. Implement both hard validations (which fail the pipeline and prevent bad data from propagating) and soft validations (which log warnings but allow processing to continue). Maintain a validation history to distinguish between genuine data quality issues and expected seasonal variations. When validation failures occur, provide actionable diagnostics including sample failing records, the specific rule violated, and suggested remediation steps.
