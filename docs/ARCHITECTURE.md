
# Architecture: repid

This repository manages the RepID computation flow.

```mermaid
graph TD
    Action --> Weight
    Weight --> ZKPCommitment
    ZKPCommitment --> AuditChain
```
