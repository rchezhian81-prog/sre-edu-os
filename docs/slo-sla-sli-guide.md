# SLO / SLA / SLI Guide

## Definitions

| Term | Full Name | Meaning |
|------|-----------|---------|
| SLI | Service Level Indicator | A metric that measures service behavior (e.g., request success rate) |
| SLO | Service Level Objective | A target for an SLI (e.g., 99.9% success rate) |
| SLA | Service Level Agreement | A contract with consequences if SLO is missed |

## Common SLIs

- **Availability**: `successful_requests / total_requests`
- **Latency**: % of requests served under threshold (e.g., < 200ms)
- **Error rate**: `error_requests / total_requests`
- **Throughput**: requests per second

## Setting SLOs

1. Start with user journey mapping
2. Pick SLIs that reflect user experience
3. Set realistic targets based on historical data
4. Leave room for an **error budget**

### Example
```
SLI: HTTP success rate (non-5xx / total)
SLO: 99.9% over a rolling 30-day window
Error budget: 0.1% = ~43.8 minutes/month
```

## Error Budget
- Error budget = 100% - SLO target
- When budget is depleted → freeze feature work, focus on reliability
- Track burn rate: how fast you're spending the budget

## Good SLO Targets by Service Type
| Service Type | Typical SLO |
|-------------|-------------|
| Public API | 99.9% |
| Internal API | 99.5% |
| Batch jobs | 99% |
| Data pipelines | 95% |
