# Architecture

Reputation Computation Flow.

```mermaid
graph TD
    Action --> Weight
    Weight --> ZKPCommitment
    ZKPCommitment --> AuditChain
```