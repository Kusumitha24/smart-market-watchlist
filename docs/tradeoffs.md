# PulseWatch - Engineering Trade-Offs & Rationale

This document details key architectural decisions made while designing and building PulseWatch for the **Groww CODE 2026 Build Challenge**.

---

## 1. Deterministic Scoring vs. Black-Box LLM / AI

### Decision
We deliberately built a **deterministic scoring algorithm** for change detection and explainability rather than relying solely on LLMs.

### Rationale
- **Predictability & Financial Trust**: Financial applications require 100% reproducible and audit-explainable results. An LLM might hallucinate why a stock price dropped or assign arbitrary importance scores.
- **Latency**: Deterministic scoring completes in $< 2\text{ms}$, whereas LLM API calls take $500\text{ms} - 2000\text{ms}$.
- **Role of AI**: AI is strictly reserved for optional high-level executive summarization ("Explain My Watchlist"), while core decision-making remains deterministic.

---

## 2. PostgreSQL / SQLite via Prisma vs. Document DB (MongoDB)

### Decision
We chose PostgreSQL (with SQLite for zero-config local dev) through Prisma ORM over MongoDB.

### Rationale
- **Relational Integrity**: Watchlists, Stock Quotes, Snapshots, and Historical Change Events have strong relational structures with foreign key constraints.
- **Transactional Consistency**: Snapshot creation requires multi-row atomic transactions across `WatchlistSnapshot` and `SnapshotStock`.
- **Prisma DX**: Type safety across backend services and instant migration support.

---

## 3. WebSockets with Granular Subscriptions vs. Polling

### Decision
We implemented a WebSocket Pub/Sub layer that pushes stock updates **only for stocks present in active user watchlists**, rather than global broadcast or HTTP polling.

### Rationale
- **Bandwidth Efficiency**: Polling every 2 seconds consumes unnecessary server CPU and network overhead for unchanged stocks.
- **User Experience**: WebSocket delivers sub-second visual updates for price spikes without re-rendering the whole page.

---

## 4. Market Data Simulator & Offline Mode

### Decision
We built an embedded **Market Data Simulator** capable of mocking real-time fluctuations, volume spikes, earnings news, and stale network conditions.

### Rationale
- **Hackathon & Demo Reliability**: Live financial APIs (NSE, Yahoo Finance) often enforce strict rate limits or experience weekend market closures. The simulator guarantees realistic 24/7 testing and reproducible demo presentations.

---

## 5. Noise Filtering & Quiet Market Principle

### Decision
PulseWatch actively suppresses sub-1% price fluctuations and surfaces a "Quiet Market Mode" banner when scores remain below threshold.

### Rationale
- Groww's product philosophy emphasizes **customer-first transparency** without manufacturing artificial user engagement or anxiety.
