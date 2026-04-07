#!/usr/bin/env python3
"""
Lightweight CV-to-internship ranking model.

This script builds a TF-IDF representation from internship posts and then
scores a student CV against each post with a hybrid formula:
- semantic similarity (TF-IDF cosine)
- required skill coverage
- role keyword alignment

Input: JSON on stdin
Output: JSON on stdout
"""

import json
import math
import re
import sys
from collections import Counter
from typing import Dict, List, Set, Tuple

TOKEN_RE = re.compile(r"[a-z0-9+#.\\-]+")

ROLE_KEYWORDS: Dict[str, Set[str]] = {
    "qa": {"qa", "quality", "assurance", "test", "testing", "selenium", "cypress"},
    "data": {"data", "analyst", "analysis", "sql", "powerbi", "tableau", "excel", "python"},
    "frontend": {"frontend", "front", "end", "react", "next", "javascript", "typescript", "css"},
    "backend": {"backend", "back", "end", "node", "api", "django", "flask", "java", "spring"},
    "fullstack": {"fullstack", "full", "stack", "frontend", "backend", "react", "node"},
}


def normalize_text(value: str) -> str:
    text = (value or "").lower()
    text = re.sub(r"\\bqa\\b", "quality assurance", text)
    text = re.sub(r"\\bsqa\\b", "software quality assurance", text)
    text = re.sub(r"\\s+", " ", text).strip()
    return text


def tokenize(value: str) -> List[str]:
    return TOKEN_RE.findall(normalize_text(value))


def infer_resume_role(tokens: Set[str]) -> str:
    best_role = ""
    best_hits = 0

    for role, keywords in ROLE_KEYWORDS.items():
        hits = len(tokens.intersection(keywords))
        if hits > best_hits:
            best_hits = hits
            best_role = role

    return best_role


def safe_div(a: float, b: float) -> float:
    if b == 0:
        return 0.0
    return a / b


def compute_idf(job_documents: List[List[str]]) -> Dict[str, float]:
    doc_count = len(job_documents)
    if doc_count == 0:
        return {}

    df: Counter = Counter()
    for doc in job_documents:
        for token in set(doc):
            df[token] += 1

    idf: Dict[str, float] = {}
    for token, freq in df.items():
        # Smoothed IDF to avoid division by zero and dampen outliers.
        idf[token] = math.log((1 + doc_count) / (1 + freq)) + 1.0

    return idf


def tfidf_vector(tokens: List[str], idf: Dict[str, float]) -> Dict[str, float]:
    if not tokens:
        return {}

    tf = Counter(tokens)
    total = float(sum(tf.values()))
    vec: Dict[str, float] = {}

    for token, count in tf.items():
        vec[token] = safe_div(float(count), total) * idf.get(token, 1.0)

    return vec


def cosine_similarity(a: Dict[str, float], b: Dict[str, float]) -> float:
    if not a or not b:
        return 0.0

    common = set(a.keys()).intersection(b.keys())
    dot = sum(a[token] * b[token] for token in common)
    norm_a = math.sqrt(sum(v * v for v in a.values()))
    norm_b = math.sqrt(sum(v * v for v in b.values()))

    return safe_div(dot, norm_a * norm_b)


def build_job_text(job: Dict) -> str:
    title = job.get("title") or ""
    description = job.get("description") or ""
    responsibilities = job.get("responsibilities") or ""
    requirements = job.get("keyRequirements") or ""
    stack = job.get("techStack") or ""

    # Boost title signal for role-sensitive matching.
    return f"{title} {title} {description} {responsibilities} {requirements} {stack}".strip()


def normalize_skill(value: str) -> str:
    skill = normalize_text(value)
    skill = skill.replace("quality-assurance", "quality assurance")
    return skill


def role_alignment_bonus(resume_role: str, job_tokens: Set[str]) -> float:
    if not resume_role:
        return 0.0

    role_terms = ROLE_KEYWORDS.get(resume_role, set())
    hits = len(job_tokens.intersection(role_terms))
    return min(1.0, hits / 4.0)


def required_coverage(required_skills: List[str], resume_skill_set: Set[str], resume_token_set: Set[str]) -> float:
    if not required_skills:
        return 0.7

    matched = 0
    for skill in required_skills:
        normalized = normalize_skill(skill)
        if not normalized:
            continue

        skill_tokens = set(tokenize(normalized))
        if normalized in resume_skill_set:
            matched += 1
            continue

        if skill_tokens and skill_tokens.issubset(resume_token_set):
            matched += 1

    return safe_div(float(matched), float(len(required_skills)))


def score_jobs(payload: Dict) -> Dict:
    resume_text = payload.get("resume_text") or ""
    resume_skills = payload.get("resume_skills") or []
    jobs = payload.get("jobs") or []

    resume_tokens = tokenize(resume_text)
    resume_token_set = set(resume_tokens)
    resume_skill_set = {normalize_skill(skill) for skill in resume_skills if isinstance(skill, str)}

    job_docs = [tokenize(build_job_text(job)) for job in jobs]
    idf = compute_idf(job_docs)
    resume_vec = tfidf_vector(resume_tokens, idf)
    resume_role = infer_resume_role(set(resume_tokens).union(resume_skill_set))

    results = []
    for idx, job in enumerate(jobs):
        job_id = str(job.get("id") or "")
        job_tokens = job_docs[idx]
        job_token_set = set(job_tokens)
        job_vec = tfidf_vector(job_tokens, idf)

        semantic = cosine_similarity(resume_vec, job_vec)
        required = required_coverage(
            job.get("requiredSkills") or [],
            resume_skill_set,
            resume_token_set,
        )
        role_bonus = role_alignment_bonus(resume_role, job_token_set)

        # Weighted hybrid score in [0, 100]
        raw_score = (semantic * 0.55) + (required * 0.35) + (role_bonus * 0.10)
        python_score = max(0.0, min(100.0, raw_score * 100.0))

        reason = (
            f"semantic={semantic:.2f}, required={required:.2f}, "
            f"role_bonus={role_bonus:.2f}, role={resume_role or 'unknown'}"
        )

        results.append(
            {
                "id": job_id,
                "pythonScore": round(python_score, 2),
                "confidence": round(min(100.0, (semantic * 80.0) + (required * 20.0)), 2),
                "reason": reason,
            }
        )

    results.sort(key=lambda row: row["pythonScore"], reverse=True)

    return {"scores": results, "model": "python-tfidf-hybrid-v1", "resumeRole": resume_role or None}


def main() -> int:
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw or "{}")
        output = score_jobs(payload)
        sys.stdout.write(json.dumps(output))
        return 0
    except Exception as exc:  # pragma: no cover
        err = {"error": str(exc), "scores": []}
        sys.stdout.write(json.dumps(err))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
