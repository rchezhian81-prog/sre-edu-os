# Incident Communication Templates

## Initial Alert (Internal)
```
🚨 [SEV-X INCIDENT] <Service Name>
Time: <HH:MM UTC>
Impact: <brief description of user impact>
Status: Investigating
IC: @<name>
Bridge: <link>
```

## Status Update (Every 30 min for SEV-1, 1hr for SEV-2)
```
⏱ UPDATE [SEV-X] <Service Name>
Status: Investigating | Identified | Mitigating
Current situation: <what's happening>
Next steps: <what team is doing>
ETA: <if known, else "unknown">
Next update: <time>
```

## Resolution Message (Internal)
```
✅ RESOLVED [SEV-X] <Service Name>
Duration: <X hours Y minutes>
Root cause: <brief>
Fix applied: <brief>
Postmortem: <link or "scheduled for YYYY-MM-DD">
```

## External Status Page Message
```
We experienced an issue with <service> between <time> and <time> UTC.
<X>% of users were affected.
The issue has been resolved. We apologize for the inconvenience.
A full incident report will be published within 48 hours.
```
