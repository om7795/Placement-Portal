# AI Service (FastAPI) — Stub

A small FastAPI microservice that the Express API proxies to for
"smart" features. It is intentionally a stub: the contracts and
scoring heuristics are real, so everything is wired end-to-end, but
the logic is simple keyword overlap that you can replace with a real
model later.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/health` | Liveness probe |
| POST | `/match/resume` | Score a resume against a job description |
| POST | `/recommend/jobs` | Suggest skills/next steps for a student |

## Run

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Example

```bash
curl -X POST http://localhost:8000/match/resume \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"React and Node developer","jobDescription":"Looking for React, Redux and AWS","skills":["React","Node.js"]}'
```

## Wiring into the app

The Express API exposes these behind `POST /api/ai/match` and
`POST /api/ai/recommend`. Set `AI_SERVICE_URL` in `backend/.env`
(defaults to `http://localhost:8000`). If the service is down the API
degrades gracefully instead of erroring.
