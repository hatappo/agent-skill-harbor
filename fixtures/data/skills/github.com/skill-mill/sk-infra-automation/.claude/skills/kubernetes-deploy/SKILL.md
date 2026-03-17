---
name: kubernetes-deploy
description: "Generate Kubernetes deployment manifests and Helm charts. Use when deploying containerized applications to Kubernetes clusters."
metadata:
  tags: kubernetes, k8s, deployment, helm, containers
---

Every Deployment manifest must include explicit resource requests and limits for both CPU and memory. Set requests to the application's typical steady-state consumption and limits to its observed peak plus a 20% buffer. Always define `livenessProbe` and `readinessProbe` with appropriate `initialDelaySeconds`, `periodSeconds`, and `failureThreshold` values tuned to the application's startup time. Use `startupProbe` for applications with variable initialization periods to avoid premature restarts. Configure `PodDisruptionBudget` to ensure at least one replica remains available during voluntary disruptions like node drains.

For rolling updates, set `strategy.rollingUpdate.maxSurge` to 25% and `maxUnavailable` to 0 for zero-downtime deployments in production. Always include `terminationGracePeriodSeconds` long enough for the application to drain in-flight requests, and implement a `preStop` lifecycle hook that pauses briefly before SIGTERM to allow endpoint propagation. When using Helm, structure charts with separate `values-dev.yaml`, `values-staging.yaml`, and `values-prod.yaml` files, and use `helm diff` in CI pipelines before applying changes. Pin chart versions and image tags; never use `latest` in production.

Configure `HorizontalPodAutoscaler` (HPA) with both CPU and custom metrics where applicable, setting `minReplicas` to at least 2 for high-availability workloads. If running a service mesh like Istio or Linkerd, ensure sidecar injection annotations are present and define `DestinationRule` or `TrafficPolicy` resources for circuit breaking and retry logic. Store sensitive configuration in `SealedSecret` or an external secrets operator rather than plain `Secret` manifests. Run `kubeval` or `kubeconform` in CI to validate manifests against the target cluster's API version before deployment.
