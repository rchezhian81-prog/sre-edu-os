# Rollback Runbook

## When to Rollback
- Error rate increases > 1% above baseline
- P99 latency doubles
- Critical functionality broken
- Data integrity risk

## Application Rollback

### Kubernetes
```bash
# View rollout history
kubectl rollout history deployment/<app> -n <namespace>

# Rollback to previous version
kubectl rollout undo deployment/<app> -n <namespace>

# Rollback to specific revision
kubectl rollout undo deployment/<app> --to-revision=<N> -n <namespace>

# Verify
kubectl rollout status deployment/<app> -n <namespace>
```

### Database Migrations
- Never auto-rollback DB migrations
- Consult DBA before reverting schema changes
- Apply compensating migration if needed

## Post-Rollback
1. Confirm metrics return to baseline
2. Notify stakeholders
3. Open incident ticket
4. Root cause analysis before re-deploying
