"""
AI microservice for the College Placement & Alumni Portal.

This is a working STUB: the endpoints, request/response contracts and
scoring logic are in place, so the Express API can proxy to it today.
Swap the simple heuristics for a real model (embeddings, an LLM, etc.)
without changing the API surface.

Run:
    uvicorn main:app --reload --port 8000
Docs:
    http://localhost:8000/docs
"""
from datetime import datetime
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Placement Portal AI Service",
    description="Resume matching and job recommendation microservice (stub).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------- Schemas -----------------------------

class ResumeMatchRequest(BaseModel):
    resumeText: str = ""
    jobDescription: str = ""
    skills: List[str] = Field(default_factory=list)


class ResumeMatchResponse(BaseModel):
    available: bool = True
    score: int
    matchedSkills: List[str]
    missingSkills: List[str]
    summary: str


class RecommendRequest(BaseModel):
    skills: List[str] = Field(default_factory=list)
    department: str = ""
    interests: List[str] = Field(default_factory=list)


class RecommendResponse(BaseModel):
    available: bool = True
    recommendedSkills: List[str]
    suggestions: List[str]


# ----------------------------- Helpers -----------------------------

def _normalize(items: List[str]) -> List[str]:
    return [i.strip().lower() for i in items if i and i.strip()]


def _extract_known_skills(text: str, vocabulary: List[str]) -> List[str]:
    lowered = (text or "").lower()
    return [skill for skill in vocabulary if skill.lower() in lowered]


# A small starter vocabulary. Replace with a real skills taxonomy.
SKILL_VOCAB = [
    "react", "node.js", "express", "mongodb", "python", "java", "spring boot",
    "sql", "aws", "azure", "docker", "kubernetes", "typescript", "redux",
    "django", "fastapi", "go", "system design", "git", "rest api", "graphql",
]


# ----------------------------- Routes -----------------------------

@app.get("/health")
def health():
    """Liveness probe used by the Express API's /api/ai/health proxy."""
    return {
        "status": "ok",
        "service": "placement-ai",
        "version": "1.0.0",
        "time": datetime.utcnow().isoformat(),
    }


@app.post("/match/resume", response_model=ResumeMatchResponse)
def match_resume(payload: ResumeMatchRequest):
    """
    Score how well a resume matches a job description.

    STUB LOGIC: keyword overlap between (resumeText + skills) and the
    job description, over a small skill vocabulary.
    """
    job_skills = _normalize(_extract_known_skills(payload.jobDescription, SKILL_VOCAB))
    resume_skills = set(_normalize(payload.skills) + _extract_known_skills(payload.resumeText, SKILL_VOCAB))

    matched = [s for s in job_skills if s in resume_skills]
    missing = [s for s in job_skills if s not in resume_skills]

    if job_skills:
        score = round(100 * len(matched) / len(job_skills))
    else:
        # Fall back to counting distinct skills present
        score = min(100, len(resume_skills) * 10)

    summary = (
        f"Matched {len(matched)} of {len(job_skills)} required skills."
        if job_skills
        else "No specific skills found in the job description; scored on breadth."
    )

    return ResumeMatchResponse(
        score=score,
        matchedSkills=matched,
        missingSkills=missing,
        summary=summary,
    )


@app.post("/recommend/jobs", response_model=RecommendResponse)
def recommend_jobs(payload: RecommendRequest):
    """
    Suggest skills to learn and next steps based on the student's profile.

    STUB LOGIC: recommend in-demand skills the student does not yet have,
    biased by their department and stated interests.
    """
    have = set(_normalize(payload.skills))
    interests = set(_normalize(payload.interests))

    dept_hints = {
        "cse": ["system design", "docker", "aws", "typescript"],
        "it": ["sql", "rest api", "docker", "aws"],
        "ece": ["python", "git", "rest api"],
        "aiml": ["python", "fastapi", "docker"],
    }
    base = dept_hints.get((payload.department or "").lower(), ["git", "rest api", "sql"])

    recommended = [s for s in base if s not in have]
    for interest in interests:
        if interest and interest not in have and interest not in recommended:
            recommended.append(interest)

    suggestions = [
        f"Build a project using {s}." for s in recommended[:3]
    ] or ["Your core skills look solid \u2014 focus on interview preparation."]

    return RecommendResponse(recommendedSkills=recommended[:8], suggestions=suggestions)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
