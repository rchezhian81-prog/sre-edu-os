# Incident Response Runbook

## Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| SEV-1 | Complete outage, all users affected | Immediate |
| SEV-2 | Major degradation, most users affected | < 15 min |
| SEV-3 | Partial degradation, some users affected | < 1 hour |
| SEV-4 | Minor issue, few users affected | < 4 hours |

## Steps

### 1. Detect & Acknowledge
- Acknowledge the alert within SLA time
- Join the incident channel: `#incidents`
- Assign an Incident Commander (IC)

### 2. Assess
- Determine severity level
- Identify affected services and users
- Check dashboards and logs

### 3. Communicate
- Post initial update in `#incidents` within 5 minutes
- Notify stakeholders for SEV-1/SEV-2
- Update status page

### 4. Mitigate
- Apply immediate fix (rollback, redirect, scale)
- Verify mitigation is working
- Monitor for 15 minutes post-fix

### 5. Resolve
- Confirm full recovery
- Post all-clear message
- Schedule postmortem (within 48 hours for SEV-1/SEV-2)

## Communication Template
```
[SEV-X] <Service> is experiencing <issue>
Impact: <who/what is affected>
Status: Investigating | Mitigating | Resolved
Next update: <time>
```
