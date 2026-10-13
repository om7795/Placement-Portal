# API Reference

Base URL: `http://localhost:5000/api`

All responses are JSON. Success responses use:
```json
{ "success": true, "message": "...", "data": { }, "meta": { "total": 0, "page": 1, "limit": 12, "pages": 1 } }
```
Errors use:
```json
{ "success": false, "message": "..." }
```

Authenticated routes require the header:
```
Authorization: Bearer <JWT>
```

---

## Auth — `/api/auth`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register a student or alumni |
| POST | `/login` | Public | Login, returns `{ user, token }` |
| GET | `/me` | Private | Current user + role profile |
| PUT | `/me` | Private | Update name / phone / avatar |
| PUT | `/password` | Private | Change password |

**Register body**
```json
{ "name": "Aarav", "email": "a@college.edu", "password": "secret1", "role": "student",
  "department": "CSE", "batch": 2027 }
```

---

## Students — `/api/students`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/me` | student | My profile |
| PUT | `/me` | student | Create/update my profile |
| GET | `/?q=&department=&batch=&minCGPA=&placed=` | admin | List students |
| GET | `/:id` | admin, alumni | One student + their applications |

---

## Alumni — `/api/alumni`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/me` | alumni | My profile |
| PUT | `/me` | alumni | Create/update my profile |
| GET | `/?q=&company=&department=&graduationYear=&mentor=` | Private | Directory (approved only) |
| GET | `/mentors` | Private | Alumni offering mentoring |
| GET | `/pending` | admin | Pending approvals |
| PATCH | `/:userId/approve` | admin | Approve an alumni |

---

## Companies — `/api/companies`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/?q=` | Private | List companies |
| GET | `/:id` | Private | Company + its open jobs |
| POST | `/` | admin | Create |
| PUT | `/:id` | admin | Update |
| DELETE | `/:id` | admin | Delete |

---

## Jobs — `/api/jobs`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/?type=&location=&workMode=&company=&q=&status=&eligible=` | Private | List/search jobs |
| GET | `/mine` | alumni, admin | Jobs I posted |
| GET | `/:id` | Private | One job (+ eligibility for students) |
| POST | `/` | admin, alumni | Create a job / referral |
| PUT | `/:id` | admin / owner | Update |
| DELETE | `/:id` | admin / owner | Delete |

Passing `eligible=true` (as a student) filters to roles the student qualifies for.

**Create body (abridged)**
```json
{ "title": "SDE", "company": "Google", "type": "fulltime", "description": "...",
  "ctc": 24, "skills": ["React"], "openings": 5,
  "eligibility": { "minCGPA": 8, "maxBacklogs": 0, "departments": ["CSE"], "batches": [2027] },
  "deadline": "2026-11-30" }
```
`company` may be an existing company id **or** a name string (auto-created).

---

## Applications — `/api/applications`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | student | Apply to a job (eligibility enforced) |
| GET | `/mine` | student | My applications |
| GET | `/job/:jobId` | admin / owner | Applications for a job |
| PATCH | `/:id/status` | admin / owner | Update status |
| PATCH | `/:id/withdraw` | student | Withdraw |

**Apply body:** `{ "jobId": "...", "coverLetter": "..." }`
**Status body:** `{ "status": "shortlisted", "note": "Cleared screening" }`

---

## Mentorship — `/api/mentorship`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | student | Request mentorship |
| GET | `/mine` | Private | Requests sent (student) / received (alumni) |
| PATCH | `/:id/respond` | alumni | Accept/decline |

---

## Events — `/api/events`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/?type=&upcoming=` | Private | List events |
| GET | `/:id` | Private | One event |
| POST | `/` | admin, alumni | Create |
| PUT | `/:id` | admin / owner | Update |
| DELETE | `/:id` | admin / owner | Delete |
| PATCH | `/:id/register` | Private | Toggle registration |

---

## Notifications — `/api/notifications`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/?unread=true` | Private | My notifications |
| GET | `/unread-count` | Private | Unread badge count |
| PATCH | `/read-all` | Private | Mark all read |
| PATCH | `/:id/read` | Private | Mark one read |

---

## Admin — `/api/admin`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/stats` | admin | Dashboard aggregates |

Returns `totals`, `ctc { highestCTC, averageCTC, offers }`,
`topRecruiters[]`, `byDepartment[]`, `byStatus[]`.

---

## AI (proxy) — `/api/ai`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/health` | Private | FastAPI liveness |
| POST | `/match` | student | Resume ↔ JD score |
| POST | `/recommend` | student | Skill recommendations |

If the FastAPI service is unreachable, these return
`{ "available": false, "message": "AI service is not reachable" }`
with HTTP 200, so the UI never breaks.

---

## Status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation / business-rule error (e.g. not eligible) |
| 401 | Missing/invalid/expired token, bad credentials |
| 403 | Authenticated but role not permitted |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, already applied) |
| 429 | Rate limited |
| 500 | Server error |
