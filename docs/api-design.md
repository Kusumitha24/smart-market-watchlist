# PulseWatch API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoint

### `POST /auth/register`
Register a new user account.
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123"
}
```

### `POST /auth/login`
Authenticate and obtain JWT token pair.
```json
{
  "email": "demo@pulsewatch.dev",
  "password": "password123"
}
```

---

## Watchlists Endpoint

### `GET /watchlists`
Fetch all user watchlists with items and latest market snapshots.

### `POST /watchlists`
Create a new watchlist.
```json
{
  "name": "High Growth Tech",
  "description": "Top technology sector stocks"
}
```

### `POST /watchlists/:id/stocks`
Add stock ticker to watchlist.
```json
{
  "symbol": "TCS"
}
```

---

## Market Insights & Change Detection

### `GET /insights/dashboard`
Fetches the Market Memory comparative engine results for the logged-in user:
- Last checked timestamp
- Categorized Priority Sections (`Needs Attention`, `Worth Watching`, `Stable`)
- Meaningful Change Scores & Explainability reasons.

### `GET /insights/replay?watchlistId=:id`
Returns animated market snapshot time-series sequence from market open (9:15 AM) to current visit.

### `POST /insights/simulator`
Trigger simulator events (Demo mode):
```json
{
  "symbol": "TCS",
  "event": "PRICE_DROP",
  "magnitude": 4.5
}
```
