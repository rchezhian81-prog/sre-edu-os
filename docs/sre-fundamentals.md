# SRE Fundamentals

## What is SRE?
Site Reliability Engineering applies software engineering practices to infrastructure and operations problems. Coined by Google, SRE bridges the gap between development and operations.

## Core Principles

### 1. Embracing Risk
- 100% reliability is impossible and undesirable
- Use error budgets to balance reliability and velocity
- Accept that some failures will happen

### 2. Service Level Objectives
- Define clear reliability targets
- Measure what users care about
- Use data to make reliability decisions

### 3. Eliminating Toil
- Toil = manual, repetitive, automatable work
- Goal: keep toil < 50% of SRE time
- Automate everything that can be automated

### 4. Monitoring & Alerting
- Monitor symptoms, not causes
- Alert on SLO burn rate, not individual metrics
- Reduce alert fatigue — every alert should be actionable

### 5. Blameless Postmortems
- Focus on systems, not people
- Extract learnings, not blame
- Share postmortems widely across teams

### 6. On-Call Best Practices
- Sustainable on-call load (< 25% of time)
- Rotate on-call regularly
- Compensate on-call engineers fairly
- Provide clear escalation paths

## The SRE Hierarchy of Reliability
```
          [Product Features]
         [Incident Response]
        [Postmortems & Learning]
       [Testing & Release Process]
      [Monitoring & Observability]
     [Capacity Planning & Automation]
    [Development Environment & Tooling]
```
