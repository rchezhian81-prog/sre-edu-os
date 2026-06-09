# Deployment Checklist

## Before Deploying

- [ ] All CI checks passing (tests, lint, security scan)
- [ ] Code review approved by at least 1 engineer
- [ ] Change reviewed by on-call SRE for high-risk changes
- [ ] Rollback plan documented and tested
- [ ] Feature flags configured (if applicable)
- [ ] Database migrations reviewed (are they backwards compatible?)
- [ ] Deployment window confirmed (avoid peak traffic hours)
- [ ] Runbook updated if operational procedures changed

## During Deployment

- [ ] Deploy to staging first, verify health
- [ ] Monitor error rate and latency for 10 minutes on staging
- [ ] Deploy to 10% production (canary) if supported
- [ ] Watch dashboards — error rate, latency, saturation
- [ ] Proceed to full rollout only if metrics are stable

## After Deployment

- [ ] Verify all services healthy in production
- [ ] Run smoke tests on critical user flows
- [ ] Monitor for 30 minutes post-deploy
- [ ] Update deployment log / release notes
- [ ] Close change request ticket
- [ ] Notify stakeholders of successful deployment
