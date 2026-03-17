---
name: sdk-client-generator
description: "Generate type-safe SDK client code from API specifications. Use when creating client libraries for internal or external APIs."
metadata:
  tags: sdk, codegen, api-client, typescript, openapi
---

Generate client code from OpenAPI 3.0+ specifications using established code generation tools like openapi-typescript for TypeScript type definitions or openapi-generator for full client SDKs. Ensure the OpenAPI spec is the single source of truth — any divergence between the spec and the actual API behavior is a bug that must be fixed in the spec, not worked around in generated code. Configure the generator to produce clients with strongly-typed request parameters, response bodies, and error types so that API contract violations are caught at compile time rather than runtime.

Implement consistent error handling across all generated client methods. Wrap HTTP errors in typed exception classes that include the status code, response body, and request context for debugging. Configure sensible defaults for retry logic — retry on 429 (rate limited) and 5xx (server error) responses with exponential backoff and jitter, but never retry on 4xx client errors. Set connection and read timeouts appropriate for each endpoint's expected latency profile; background batch endpoints may tolerate 30-second timeouts while user-facing endpoints should fail fast at 5 seconds. Expose these configurations as constructor options so consumers can override defaults.

Version the SDK client independently from the API it consumes, using semantic versioning based on the client's public surface area. A new optional parameter is a minor version bump; a changed response type or removed method is a major version bump. Publish generated types as a separate package that can be consumed by both client and server code to ensure shared type safety. When the API introduces a new version (v2, v3), generate a new client namespace rather than modifying the existing one, allowing consumers to migrate incrementally. Include integration tests that run against a mock server to verify the generated client behaves correctly for common request/response scenarios.
