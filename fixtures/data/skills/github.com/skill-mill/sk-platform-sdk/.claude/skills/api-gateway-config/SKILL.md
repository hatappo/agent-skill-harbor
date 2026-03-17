---
name: api-gateway-config
description: "Configure API gateway routing, rate limiting, and authentication. Use when setting up or modifying API gateway infrastructure."
metadata:
  tags: api-gateway, routing, rate-limiting, authentication, infrastructure
---

Define route configurations declaratively, mapping incoming request paths and methods to upstream service endpoints. Use path-based routing to direct traffic to the appropriate microservice (e.g., /api/users/* to user-service, /api/orders/* to order-service). Configure path rewriting to strip gateway-specific prefixes before forwarding to upstream services. Set up host-based routing for multi-tenant deployments where each tenant accesses the API through a unique subdomain. Maintain route configurations in version-controlled files and deploy them through the same CI/CD pipeline as application code.

Implement rate limiting at multiple levels to protect backend services from abuse. Apply a global rate limit per IP address (e.g., 1000 requests/minute) as a baseline protection, and add stricter per-endpoint limits for expensive operations like authentication attempts (10/minute) or file uploads (50/hour). Use token bucket or sliding window algorithms depending on whether you need burst tolerance. For authenticated users, apply rate limits per API key or user ID rather than IP address to avoid penalizing shared networks. Return standard 429 responses with Retry-After headers so well-behaved clients can implement backoff automatically.

Configure JWT validation at the gateway to reject unauthenticated requests before they reach backend services. Validate the token signature against the identity provider's JWKS endpoint, check expiration and issuer claims, and extract user identity claims into forwarded headers (X-User-ID, X-User-Roles) for downstream services. Set up CORS with explicit allow-lists for origins, methods, and headers — never use wildcard origins in production. Configure health check endpoints (/health, /ready) that bypass authentication and return structured responses indicating the gateway's status and connectivity to upstream services, enabling load balancers and monitoring systems to detect issues promptly.
