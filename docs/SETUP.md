# Setup Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ (20 recommended) |
| npm | 9+ |
| MongoDB | 6+ (local, or a free MongoDB Atlas cluster) |
| Python | 3.10+ (only for the optional AI service) |

---

## 1. Backend (Express + MongoDB)

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/placement_portal
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

Install and run:
```bash
npm install
npm run seed     # optional — loads demo users, jobs, events
npm run dev      # http://localhost:5000
```

Health check: open http://localhost:5000/ — you should see the API banner.

> **MongoDB Atlas:** replace `MONGO_URI` with your connection string, e.g.
> `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/placement_portal?retryWrites=true&w=majority`.

### Demo accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Student | student@college.edu | student123 |
| Alumni | alumni@college.edu | alumni123 |

---

## 2. AI service (FastAPI) — optional

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Docs at http://localhost:8000/docs. If you skip this step, the app still
works — the AI widgets simply show an "unavailable" notice.

---

## 3. Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Install and run:
```bash
npm install
npm run dev      # http://localhost:5173
```

Production build:
```bash
npm run build    # output in frontend/dist
npm run preview
```

---

## Run order

1. MongoDB (or Atlas)
2. `backend` — `npm run dev`
3. `ai-service` — `uvicorn main:app --port 8000` (optional)
4. `frontend` — `npm run dev`

Open http://localhost:5173 and log in with a demo account.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `MongoDB connection failed` | Ensure MongoDB is running, or the Atlas URI/IP allowlist is correct. |
| Frontend shows network errors | Confirm `VITE_API_URL` matches the backend URL and the backend is running. |
| CORS error in the browser | Add your frontend origin to `CLIENT_URL` in `backend/.env`. |
| 401 immediately after login | `JWT_SECRET` changed between runs — log out and back in. |
| "AI service is not reachable" | Start the FastAPI service, or ignore it (core features are unaffected). |
| Port already in use | Change `PORT` (backend) / Vite `server.port`. |

---

## Project scripts

| Location | Command | Purpose |
|----------|---------|---------|
| backend | `npm run dev` | Run API with nodemon |
| backend | `npm start` | Run API (production) |
| backend | `npm run seed` | Load demo data |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Production bundle |
| ai-service | `uvicorn main:app --reload` | Run AI service |
