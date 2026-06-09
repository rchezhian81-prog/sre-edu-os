# Error Budget Guide

## What is an Error Budget?
The error budget is the allowable amount of unreliability for a service, calculated as:
```
Error Budget = 1 - SLO target
Example: SLO = 99.9% → Error Budget = 0.1%
```

## Monthly Error Budget by SLO Target

| SLO | Monthly downtime allowed |
|-----|--------------------------|
| 99% | ~7.3 hours |
| 99.5% | ~3.65 hours |
| 99.9% | ~43.8 minutes |
| 99.95% | ~21.9 minutes |
| 99.99% | ~4.38 minutes |

## Error Budget Policy

### Budget Healthy (> 50% remaining)
- Normal feature velocity
- Experimentation allowed
- Planned maintenance OK

### Budget at Risk (10–50% remaining)
- Reduce risky deployments
- Increase monitoring
- Focus on reliability improvements

### Budget Exhausted (< 10% remaining)
- Freeze non-critical feature launches
- All hands on reliability
- No risky changes until budget recovers

## Burn Rate Alerts
- **1x burn rate** = consuming budget at exactly the SLO rate
- **14.4x burn rate** = will exhaust monthly budget in 2 days → page immediately
- **6x burn rate** = will exhaust budget in 5 days → ticket alert
