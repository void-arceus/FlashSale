# Flash Sale

A **full-stack, backend-focused** flash-sale application built to explore how backend systems handle concurrent purchases, inventory consistency, database transactions, and load testing.

> 🚧 **Status: In Development**

## Why I'm Building This

I built this project to move beyond simple CRUD applications and understand backend problems that appear when many users try to purchase the same limited-stock product at the same time.

The main things I want to learn are:

- Concurrent requests
- Race conditions
- Inventory consistency
- Database transactions
- Transaction conflicts
- Load testing
- Backend performance

The project is being developed incrementally, using load-test results to find and solve real problems.

## Tech Stack

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### Testing & Infrastructure

- k6 - API load testing
- Redis - planned for reservations/caching

## What I've Built

### Frontend

The project also includes a React.js frontend for interacting with the backend API.

It currently includes:

- Product and flash-sale views
- Admin interface for scheduling and managing flash sales
- Forms and UI for managing flash-sale products

The frontend is mainly used to interact with and test the backend functionality, while the main focus of this project is the backend architecture and concurrent purchase handling.

### Flash Sale Flow

### Product Management

- Product creation and management
- Inventory tracking
- Purchase quantity validation

### Flash Sale Management

- Admin can schedule flash sales
- Flash sales have start and end times
- Prevents overlapping flash sales for the same product

### Normal Purchase Flow

The current purchase flow:

1. Authenticate the user
2. Validate the requested quantity
3. Start a MongoDB transaction
4. Atomically decrease inventory
5. Create an order
6. Commit the transaction
7. Roll back if the transaction fails

Inventory is updated only when:

productQuantity >= purchaseQuantity

This prevents the database from reducing inventory below the requested amount.

## MongoDB Transactions

The inventory update and order creation are handled inside the same transaction.

Without a transaction, a failure could leave the system like this:

```text
Inventory reduced
       ↓
Order creation fails
       ↓
Inventory is incorrect
```

With a transaction:

```text
Start
  ↓
Decrease Inventory
  ↓
Create Order
  ↓
Success → Commit
Failure → Rollback
```

This keeps inventory and orders consistent.

## Transaction Retry Handling

While testing concurrent purchases, MongoDB returned errors such as:

```text
WriteConflict (code 112)
TransientTransactionError
```

These occurred when multiple transactions tried to modify the same product document.

The purchase flow now detects transient transaction errors and retries the transaction instead of immediately returning an error.

Retry behaviour is still being tuned because retries can improve reliability while also increasing latency under heavy contention.

## Load Testing

I use **k6** to test how the purchase API behaves when multiple users send requests concurrently.

A k6 **virtual user (VU)** represents a simulated user running the test scenario.

Tests have included gradual concurrency such as:

```text
1 VU → 5 VUs → 10 VUs → 20 VUs
```

and earlier experiments with spikes up to 200 VUs.

The tests target the same product so that requests compete for the same inventory.

For some tests, I used large inventory so that stock exhaustion would not hide the concurrency behaviour I was trying to measure.

## What Testing Has Revealed

Load testing exposed a problem that was not visible during normal manual testing:

```text
Many concurrent requests
          ↓
Same product document
          ↓
Concurrent transactions
          ↓
MongoDB WriteConflict
```

Before retry handling, many concurrent requests could return `500 Internal Server Error`.

After adding retry handling, transient conflicts can be retried, but high contention can still cause significant request latency.

### Recent Test Result

One recent 20-VU test produced:

```text
HTTP requests:        814
Successful checks:    322
Failed checks:        491
Failure rate:         ~60%
Average duration:     ~568ms
p(95):                ~1.01s
```

This is **not intended as a final benchmark**. The test is being used to identify bottlenecks and concurrency problems.

## Problems I've Overcome

### Inventory Consistency

**Problem:** Inventory and order creation could become inconsistent if handled separately.

**Solution:** Put both operations inside a MongoDB transaction.

### Overselling

**Problem:** Multiple users can attempt to buy the same product simultaneously.

**Solution:** Use a conditional atomic inventory update:

```text
productQuantity >= purchaseQuantity
```

followed by an atomic decrement.

### MongoDB Write Conflicts

**Problem:** Concurrent transactions can produce `WriteConflict` / `TransientTransactionError`.

**Solution:** Retry transient transaction failures.

### Understanding Real API Load

**Problem:** Manual requests do not show how the API behaves under concurrency.

**Solution:** Added k6 tests with multiple virtual users and different concurrency levels.

## Current Problems

The main problems I am currently investigating are:

- High latency when many transactions target the same product
- Database contention under higher concurrency
- Finding a good retry limit and backoff strategy
- Distinguishing expected business failures from real server failures
- Improving k6 metrics and test scenarios
- Understanding the trade-off between correctness and performance

The goal is not simply to make every request succeed. I want to understand how the system behaves as concurrency increases.

## Current Architecture

```text
Client
  ↓
Purchase API
  ↓
Validate Request
  ↓
MongoDB Transaction
  ├── Atomic Inventory Update
  ├── Create Order
  ↓
Commit
  ↓
Response
```

For transient conflicts:

```text
Transaction Conflict
        ↓
Check Error
        ↓
Retry
   ├── Success → Commit
   └── Exhausted → Error
```

## Next Goals

### Short Term

- Improve transaction retry and backoff
- Continue testing different concurrency levels
- Improve k6 checks and metrics
- Separate expected business responses from actual API failures
- Investigate database contention and latency

### Flash Sale Purchase Flow

After stabilizing the normal purchase flow, the next major step is implementing and testing the dedicated flash-sale purchase flow.

The flash-sale flow will introduce additional constraints such as limited sale inventory and allowing only one purchase per user during a sale.

### Later

- Add Redis where it makes sense for reservation/caching
- Add rate limiting
- Improve monitoring
- Compare different approaches to high-concurrency purchases
- Continue performance testing at higher loads

## Current Status

**Completed**

- Product management
- Flash-sale scheduling
- Normal purchase flow
- MongoDB transactions
- Atomic inventory updates
- Transaction retry handling
- Initial k6 load testing

**In Progress**

- Concurrency handling
- Transaction contention
- Retry behaviour
- Performance testing

**Next Major Milestone**

> Build and load-test the dedicated flash-sale purchase flow.

## Final Note

This is a learning project, so the load-test failures are not something I am hiding. They are one of the most useful parts of the project.

The goal is to find a problem, understand why it happens, improve the implementation, test it again, and learn how the system behaves under increasing concurrency.
