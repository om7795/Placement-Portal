# Architecture

## Overview

The College Placement & Alumni Portal is a three-tier application:

1. **Presentation tier** — a React SPA (Vite) using Redux Toolkit for
   state, React Router for navigation, and Axios for HTTP.
2. **Application tier** — an Express.js REST API that owns authentication,
   business rules (eligibility, approvals, notifications) and data access.
3. **Data tier** — MongoDB (accessed via Mongoose).

A separate **Python FastAPI microservice** hosts AI/ML-style features
(resume matching, recommendations). It is optional and isolated: the
Express API proxies to it and degrades gracefully when it is offline.

```
┌────────────────────────┐        ┌──────────────────────────┐
│  React SPA (Vite)      │  HTTP  │  Express API             │
│  Redux · Router · Axios│ ─────► │  JWT auth · REST · rules │
└────────────────────────┘  /api  └───────────┬──────────────┘
                                              │ Mongoose
                                              ▼
                                     ┌──────────────────┐
                                     │  MongoDB         │
                                     └──────────────────┘
                                              ▲
                              ┌───────────────┴──────────────┐
                              │  FastAPI AI service (stub)   │
                              │  /match/resume /recommend    │
                              └──────────────────────────────┘
```

## Backend structure

| Folder | Responsibility |
|--------|----------------|
| `config/` | MongoDB connection with retry logic |
| `models/` | Mongoose schemas (User, profiles, Job, Application, …) |
| `controllers/` | Request handlers — one file per domain |
| `routes/` | Express routers, wired to controllers + middleware |
| `middleware/` | `protect` (JWT), `authorize` (roles), error handling |
| `utils/` | token signing, async wrapper, pagination, eligibility, notify |
| `seed/` | Demo-data seeder |

### Request lifecycle

```
Request → helmet → cors → json parser → morgan → rate limit
        → router → protect (JWT) → authorize (role) → controller
        → response | errorHandler
```

## Authentication & authorization

- Passwords are hashed with **bcrypt** in a Mongoose `pre('save')` hook.
- On login/register the server returns a **JWT** (`{ id, role }`) that the
  client stores in `localStorage` and sends as `Authorization: Bearer …`.
- `protect` verifies the token and loads the user onto `req.user`.
- `authorize(...roles)` enforces role-based access per route.
- Roles: **student**, **alumni**, **admin** (Training & Placement Office).
- Alumni accounts start unapproved and must be approved by an admin before
  they appear in the directory or can post referrals.

## Key business rules

- **Eligibility** (`utils/eligibility.js`) is evaluated before a student can
  apply: minimum CGPA, max backlogs, allowed departments and batches.
- **One application per job per student** (unique compound index).
- **Application status** moves through a timeline
  (applied → shortlisted → interview → selected/rejected/withdrawn), and
  each change creates a notification for the student.
- **Job ownership**: alumni can edit/delete only the jobs they posted;
  admins can manage all.

## Frontend structure

| Folder | Responsibility |
|--------|----------------|
| `app/` | Redux store configuration |
| `api/` | Axios instance (interceptors) + grouped endpoint functions |
| `features/` | Redux Toolkit slices (auth, jobs, applications, …) |
| `components/` | Reusable UI (Navbar, JobCard, Badge, Toast, …) |
| `pages/` | Route-level screens |
| `routes/` | Router + `ProtectedRoute` guard |

The Axios instance attaches the JWT to every request and auto-logs-out on a
`401`. `ProtectedRoute` blocks unauthenticated access and role-gates admin
screens.

## AI microservice

`ai-service/main.py` exposes `/health`, `/match/resume` and
`/recommend/jobs`. The Express API exposes them under `/api/ai/*`. The stub
uses keyword-overlap heuristics so the whole path is demonstrable; replace
the internals with a real model without touching the contracts.

## Design decisions

- **Two backends, clear split**: Express owns transactional/relational logic
  and auth; FastAPI is reserved for compute-heavy or ML features, which
  keeps the core API free of Python dependencies.
- **Redux Toolkit** over hand-written Redux for less boilerplate and
  built-in async thunk status handling.
- **Graceful degradation**: if the AI service is down, `/api/ai/*` returns
  an `available: false` payload rather than an error, so the UI keeps working.
- **Plain CSS** with design tokens instead of a UI framework, to keep the
  build simple and dependency-light for a college submission.
