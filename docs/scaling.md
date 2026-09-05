# PulseWatch Scaling Strategy Blueprint

## Overview
PulseWatch is designed to scale horizontally from 10 users to 1,000,000+ concurrent active investors.

## 1. Multi-Tier Scaling Path

### Tier 1: 10 to 10,000 Users
- Single Express Backend instance behind Nginx.
- SQLite or single-node PostgreSQL DB with Prisma connection pooling.
- Redis in-memory quote cache (TTL: 5 seconds).

### Tier 2: 10,000 to 100,000 Users
- **Stateless Backend Nodes**: Deploy Express instances horizontally behind AWS ALB / Nginx load balancer.
- **PostgreSQL Read Replicas**: Route snapshot writes to primary DB and dashboard reads to read replicas.
- **BullMQ Background Workers**: Delegate background Market Memory scoring jobs to dedicated worker processes.

### Tier 3: 1,000,000+ Users
- **Distributed Redis Pub/Sub**: WebSockets scale out horizontally across multiple WebSocket nodes synchronized via Redis adapter.
- **Batch Market Data Aggregation**: Aggregate quote requests into 100-ticker batch jobs rather than 1 call per stock.
- **Partitioning & Sharding**: Partition `WatchlistSnapshot` table by `createdAt` monthly range and hash shard `UserId`.

---

## Failure Handling Matrix

| Scenario | System Defense | User Impact |
| :--- | :--- | :--- |
| External API Down | Market Simulator Provider Fallback | Data Freshness badge shows "Delayed" or "Simulated" |
| Redis Connection Failure | Graceful Memory Cache Fallback | System degrades to direct DB queries without crash |
| WebSocket Disconnect | Auto-reconnect with exponential backoff | Real-time tag changes to "Offline", auto-syncs on reconnect |
