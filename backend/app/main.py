from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from io import BytesIO
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

import PyPDF2

# ---------- FastAPI app setup ----------

app = FastAPI(title="AI Resume Screening Backend")

# Allow frontend on localhost:3000 to call this API
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- NLP utilities ----------

STOPWORDS = set(stopwords.words("english"))

# Vocabulary of possible skills (works for DS + SDE; you can extend)
SKILL_LIST = [
    # Data / ML
    "python",
    "pandas",
    "numpy",
    "sql",
    "machine learning",
    "deep learning",
    "statistics",
    "probability",
    "data visualization",
    "matplotlib",
    "seaborn",
    "power bi",
    "tableau",
    "scikit-learn",
    "nlp",
    "tensorflow",
    "pytorch",
    # SDE / CS
    "data structures",
    "algorithms",
    "object-oriented programming",
    "oop",
    "java",
    "c++",
    "operating systems",
    "os",
    "dbms",
    "system design",
    "git",
    "github",
]


def extract_text_from_file(upload_file: UploadFile) -> str:
    """
    Read uploaded file as text.
    Supports PDF and plain text.
    """
    filename = upload_file.filename.lower()
    file_bytes = upload_file.file.read()

    # PDF file
    if filename.endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(BytesIO(file_bytes))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            return text
        except Exception:
            return ""

    # Assume text for others (txt, etc.)
    try:
        return file_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def clean_text(text: str) -> str:
    """
    Lowercase, tokenize, remove stopwords and non-alphabetic tokens.
    """
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t.isalpha() and t not in STOPWORDS]
    return " ".join(tokens)


def extract_skills_from_text(cleaned_text: str) -> List[str]:
    """
    Detect which known skills from SKILL_LIST appear in the given text.
    cleaned_text should already be preprocessed.
    """
    text = cleaned_text.lower()
    detected = []

    for skill in SKILL_LIST:
        if skill in text:
            detected.append(skill)

    return detected


def compute_scores(job_desc: str, resume_texts: List[str]):
    """
    TF-IDF + cosine similarity + JD-based skill overlap scoring.
    Returns a list of final scores, matched_skills, missing_skills per resume.
    """

    # Clean texts
    jd_clean = clean_text(job_desc)
    resumes_clean = [clean_text(t) for t in resume_texts]

    # 1) TF-IDF on [JD + resumes]
    documents = [jd_clean] + resumes_clean
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # cosine similarity of each resume vs job description
    jd_vec = tfidf_matrix[0:1]
    resume_vecs = tfidf_matrix[1:]
    cos_sims = cosine_similarity(resume_vecs, jd_vec).flatten()

    # 2) Skills required according to the job description
    required_skills = extract_skills_from_text(jd_clean)

    # If JD doesn't mention any known skill, fall back to full list
    if not required_skills:
        required_skills = SKILL_LIST.copy()

    scores = []
    matched_all = []
    missing_all = []

    for i, resume_clean in enumerate(resumes_clean):
        # Skills present in this resume
        resume_skills = extract_skills_from_text(resume_clean)

        # Intersection & difference with JD-required skills
        matched_skills = [s for s in resume_skills if s in required_skills]
        missing_skills = [s for s in required_skills if s not in resume_skills]

        # Skill overlap ratio
        if len(required_skills) > 0:
            skill_overlap = len(matched_skills) / len(required_skills)
        else:
            skill_overlap = 0.0

        # Combine cosine similarity + skill overlap
        sim_score = float(cos_sims[i])  # 0–1
        final_score = (0.4 * sim_score + 0.6 * skill_overlap) * 100

        scores.append(final_score)
        matched_all.append(matched_skills)
        missing_all.append(missing_skills)

    return scores, matched_all, missing_all


def verdict_from_score(score: float) -> str:
    if score >= 75:
        return "Selected"
    elif score >= 50:
        return "Review"
    else:
        return "Reject"


# ---------- API endpoints ----------


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """
    Accepts multiple resume files + job description,
    returns match scores and verdicts.
    """

    if not job_description.strip():
        return {"error": "Job description is empty."}

    if not resumes:
        return {"error": "No resumes uploaded."}

    # Read and extract text from each resume
    resume_texts = []
    candidate_names = []

    for file in resumes:
        text = extract_text_from_file(file)
        if not text.strip():
            # skip completely empty files
            continue
        resume_texts.append(text)
        # use filename (without extension) as candidate name
        candidate_names.append(os.path.splitext(file.filename)[0])

    if not resume_texts:
        return {"error": "Could not read any resume content."}

    # Compute scores + skills
    scores, matched_list, missing_list = compute_scores(job_description, resume_texts)

    # Build response
    results = []
    for name, score, matched_skills, missing_skills in zip(
        candidate_names, scores, matched_list, missing_list
    ):
        verdict = verdict_from_score(score)
        results.append(
            {
                "candidate_name": name,
                "match_score": round(score, 2),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "verdict": verdict,
            }
        )

    return results
