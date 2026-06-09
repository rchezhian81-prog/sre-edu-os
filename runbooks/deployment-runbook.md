# Deployment Runbook

## Pre-Deployment
- [ ] All tests passing in CI
- [ ] Change request approved
- [ ] Rollback plan documented
- [ ] On-call engineer notified
- [ ] Deploy during low-traffic window

## Deployment Steps

1. **Tag the release**
   ```bash
   git tag -a v1.x.x -m "Release v1.x.x"
   git push origin v1.x.x
   ```

2. **Deploy to staging**
   ```bash
   kubectl apply -f k8s/staging/
   kubectl rollout status deployment/<app> -n staging
   ```

3. **Smoke test staging** — verify key user flows

4. **Deploy to production**
   ```bash
   kubectl apply -f k8s/production/
   kubectl rollout status deployment/<app> -n production
   ```

5. **Monitor for 30 minutes**
   - Error rate
   - Latency (p50, p95, p99)
   - Saturation metrics

## Rollback
```bash
kubectl rollout undo deployment/<app> -n production
kubectl rollout status deployment/<app> -n production
```
