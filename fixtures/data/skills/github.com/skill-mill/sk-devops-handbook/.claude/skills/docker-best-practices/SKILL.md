---
name: docker-best-practices
description: "Write optimized Dockerfiles and configure Docker Compose for development and production. Use when containerizing applications or optimizing Docker builds."
metadata:
  tags: docker, containers, dockerfile, optimization, devops
---

Write Dockerfiles using multi-stage builds to separate build-time dependencies from the final runtime image. Use a full SDK or build image in the first stage to compile code and install dependencies, then copy only the built artifacts into a minimal runtime image (alpine, distroless, or slim variants). Order Dockerfile instructions from least to most frequently changing — copy lockfiles and install dependencies before copying source code so that dependency layers are cached across builds when only application code changes. Always pin base image versions with specific tags or SHA digests to ensure reproducible builds.

Configure a comprehensive .dockerignore file to exclude .git directories, node_modules, build outputs, local environment files, and documentation from the build context — this reduces context transfer time and prevents secrets from being accidentally included in images. Add HEALTHCHECK instructions that verify the application is responding correctly, not just that the process is running. Run containers as a non-root user by creating a dedicated user in the Dockerfile and switching to it with the USER directive. Scan built images with tools like Trivy or Grype in CI to detect OS-level and application-level vulnerabilities before pushing to a registry.

For Docker Compose, maintain separate override files for development (docker-compose.dev.yml with volume mounts, debug ports, hot-reload) and production (docker-compose.prod.yml with resource limits, restart policies, production environment variables). Define explicit healthcheck configurations and depends_on conditions so that services start in the correct order and wait for dependencies to be ready. Use named volumes for persistent data and tmpfs mounts for ephemeral scratch space. Set memory and CPU limits on all services to prevent a single misbehaving container from consuming all host resources, and configure logging drivers to ship container logs to your centralized logging infrastructure.
