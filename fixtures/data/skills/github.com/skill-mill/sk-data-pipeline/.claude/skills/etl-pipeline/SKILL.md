---
name: etl-pipeline
description: "Design and implement ETL/ELT data pipelines. Use when building data ingestion, transformation, or loading workflows."
metadata:
  tags: data, etl, pipeline, transformation, ingestion
---

Choose between ETL and ELT based on your infrastructure and use case. Traditional ETL (Extract-Transform-Load) transforms data before loading into the target system, which is suitable when the target has limited compute or when sensitive data must be filtered before storage. ELT (Extract-Load-Transform) loads raw data into a modern data warehouse like BigQuery, Snowflake, or Redshift and leverages its compute for transformations via dbt or SQL — this is preferred for analytics workloads where schema flexibility and full data retention are valued. In both patterns, design each step to be idempotent so that reruns produce the same result without duplicating data.

Implement robust error handling at every stage of the pipeline. Use dead-letter queues or error tables to capture failed records without blocking the entire pipeline. Apply circuit breaker patterns when calling external APIs during extraction to prevent cascading failures. Log sufficient context with each error (source record ID, timestamp, transformation step) to enable targeted debugging and reprocessing. For scheduling, use Airflow DAGs or Prefect flows with explicit dependency declarations, retry policies with exponential backoff, and SLA-based alerting to detect pipeline delays before they impact downstream consumers.

Build data quality checks into the pipeline as first-class steps rather than afterthoughts. Validate record counts between source and target after each load, check for unexpected null rates in critical columns, and assert referential integrity across related tables. Use checkpoint mechanisms to enable resumable pipelines that can restart from the last successful stage rather than reprocessing everything. Monitor pipeline health with metrics on throughput, latency, error rates, and data freshness, and set up alerts that trigger when these metrics deviate from established baselines.
