# College Placement & Alumni Portal

A full-stack MERN + FastAPI web application that connects **students**, **alumni**, and the **Training & Placement Office (TPO)** of a college in one place.

Students discover and apply to jobs/internships, track applications, and find alumni mentors. Alumni give back by posting referrals, mentoring juniors, and staying connected through the directory and events. The placement cell manages companies, drives, and placement analytics from an admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), Redux Toolkit, React Router v6, Axios |
| Backend (main API) | Node.js, Express.js, MongoDB (Mongoose), JWT |
| AI microservice (stub) | Python 3, FastAPI, Uvicorn |
| Auth | JWT (access token) + bcrypt password hashing |
| Tooling | npm, Vite, nodemon, dotenv, CORS |

---

## Features

### Placement (Student side)
- JWT authentication with role-based access (student / alumni / admin)
- Student profile with CGPA, department, batch, skills, and resume link
- Browse and filter jobs & internships by type, location, and eligibility
- One-click apply with cover letter; eligibility checks (CGPA, department, batch)
- Application tracker with a per-application status timeline

### Alumni
- Alumni directory with search by company, department, and graduation year
- Alumni can post job openings / referrals directly to students
- Mentor listing and mentorship request workflow (student → alumni)
- Events: placement drives, webinars, and reunions

### Admin / TPO
- Manage companies, jobs, and events
- Review and approve alumni registrations
- Update application statuses (shortlist → interview → selected/rejected)
- Placement dashboard: totals, offers, highest/average CTC, top recruiters

### AI service (FastAPI stub)
- `/health`, `/match/resume`, `/recommend/jobs` endpoints ready to be filled in
- The Express API proxies to it, so the frontend integration is already wired

---

## Repository Layout

```
college-placement-alumni-portal/
├── backend/            # Express + MongoDB + JWT REST API
│   └── src/
│       ├── config/     # DB connection
│       ├── models/     # Mongoose schemas
│       ├── controllers/# Route handlers
│       ├── routes/     # Express routers
│       ├── middleware/ # auth, roles, error handling
│       ├── utils/      # token helpers, async wrapper
│       └── seed/       # demo data seeder
├── ai-service/         # Python FastAPI microservice (stub)
├── frontend/           # React (Vite) + Redux + Router + Axios
│   └── src/
│       ├── app/        # Redux store
│       ├── api/        # Axios instance + endpoint modules
│       ├── features/   # Redux slices
│       ├── components/ # Reusable UI
│       ├── pages/      # Route pages
│       └── routes/     # Router + protected routes
└── docs/               # Architecture, API spec, DB design, setup
```

---

## Quick Start

Full instructions are in [`docs/SETUP.md`](docs/SETUP.md). Short version:

### 1. Backend
```bash
cd backend
cp .env.example .env        # set MONGO_URI and JWT_SECRET
npm install
npm run seed                # optional: load demo users/jobs/events
npm run dev                 # http://localhost:5000
```

### 2. AI service (optional)
```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # http://localhost:8000/docs
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

### Demo accounts (after `npm run seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin (TPO) | admin@college.edu | admin123 |
| Student | student@college.edu | student123 |
| Alumni | alumni@college.edu | alumni123 |

---

## Documentation
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design & request flow
- [`docs/API.md`](docs/API.md) — full REST API reference
- [`docs/DATABASE.md`](docs/DATABASE.md) — collections, relationships, ER diagram
- [`docs/SETUP.md`](docs/SETUP.md) — detailed local setup & troubleshooting

---

## License
MIT — free to use for academic projects.
