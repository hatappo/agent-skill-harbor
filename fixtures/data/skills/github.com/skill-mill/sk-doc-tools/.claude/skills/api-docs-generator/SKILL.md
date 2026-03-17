---
name: api-docs-generator
description: "Generate API documentation from OpenAPI/Swagger specs or code annotations. Use when creating or updating REST API documentation."
metadata:
  tags: documentation, api, openapi, swagger, rest
---

When generating API documentation, always start from an OpenAPI 3.x specification file as the single source of truth. Each endpoint must include a concise `summary`, a detailed `description` explaining business context, and complete `parameters`, `requestBody`, and `responses` schemas with realistic `example` values. Use `$ref` to define reusable components in `components/schemas` for request and response models, avoiding inline schema duplication. Tag endpoints logically by resource or domain area so that generated documentation groups related operations together.

Provide at least one request/response example per endpoint, including both success (2xx) and common error (4xx, 5xx) scenarios. Error responses should use a consistent envelope format with `code`, `message`, and optional `details` fields. Document authentication requirements at both the global `securitySchemes` level and per-operation where overrides exist. For paginated endpoints, clearly describe query parameters like `page`, `per_page`, and `cursor`, and include `Link` headers or pagination metadata in response examples. Use `deprecated: true` with a migration note in the description rather than silently removing endpoints.

Run `spectral lint` in CI to validate the OpenAPI spec against organizational rulesets before generating output. Use tools like `redocly build-docs` or `swagger-ui` for rendering, and publish versioned documentation alongside each API release. When the API evolves, maintain a changelog section noting breaking changes, new endpoints, and deprecations. Ensure generated docs are accessible by including descriptive alt text for diagrams and maintaining sufficient color contrast in the rendered theme.
