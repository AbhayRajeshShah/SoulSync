# app.py
import re
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from llm_service import generate_daily_checkin, generate_weekly_energy_report
from fastapi.middleware.cors import CORSMiddleware


class JournalInput(BaseModel):
    article: str
    mood_score: int
    tag: str 

class WeeklyJournal(BaseModel):
    # Match your Journal schema — add/remove fields as needed
    _id: str | None = None
    user: str | None = None
    text: str
    timestamp: str  # ISO string
    mood_score: int | None = None
    tag: str | None = None
    article_length: int | None = None
    createdAt: str | None = None
    updatedAt: str | None = None

class WeeklyJournalsRequest(BaseModel):
    weekly_journals: List[WeeklyJournal]

class WeeklyEnergyResponse(BaseModel):
    weeklyEnergyData: dict

# ---------- Model Setup ----------

MODEL_NAME = "SamLowe/roberta-base-go_emotions"  # small-ish GoEmotions model

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
emotion_pipeline = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    top_k=None,  # return all scores
)


# ---------- FastAPI Setup ----------

app = FastAPI(title="Emotion Analyzer API")


class TextInput(BaseModel):
    text: str


class EmotionResponse(BaseModel):
    text: str
    top_emotion: str
    confidence: float
    mood_score: float
    color: str

VALENCE_MAP = {
    "admiration": 1.0,
    "amusement": 1.0,
    "approval": 0.8,
    "caring": 0.8,
    "desire": 0.8,
    "optimism": 1.0,
    "joy": 1.0,
    "love": 1.0,
    
    "neutral": 0.5,
    "realization": 0.5,
    "confusion": 0.4,
    "curiosity": 0.6,
    "surprise": 0.6,

    "anger": 0.0,
    "annoyance": 0.2,
    "disapproval": 0.2,
    "fear": 0.0,
    "disgust": 0.0,
    "grief": 0.0,
    "embarrassment": 0.2,
    "nervousness": 0.2,
    "sadness": 0.0,
}


def label_to_mood_score(preds: list[dict]) -> float:
    """
    preds is a list like: [{"label": "...", "score": 0.32}, ...]
    Returns a float between 0 and 1.
    """
    total = 0.0
    weight = 0.0

    for p in preds:
        label = p["label"]
        score = p["score"]
        valence = VALENCE_MAP.get(label, 0.5)  # fallback = neutral
        total += valence * score
        weight += score

    # normalize (should normally sum to ~1 because GoEmotions is multi-label)
    if weight == 0:
        return 0.5
    return total / weight


# ---------- Helpers ----------

def clean_text(text: str) -> str:
    # basic cleaning – you can extend this
    text = text.strip()
    text = re.sub(r"http\S+", "", text)  # urls
    text = re.sub(r"[@#]\S+", "", text)  # handles/hashtags
    text = re.sub(r"\s+", " ", text)
    return text


# group emotions into coarse “mood families”
POSITIVE_EMOTIONS = {
    "admiration",
    "amusement",
    "approval",
    "caring",
    "desire",
    "excitement",
    "gratitude",
    "joy",
    "love",
    "optimism",
    "pride",
    "relief",
    "satisfaction",
    "trust",
}

ANXIOUS_OR_NEGATIVE = {
    "anger",
    "annoyance",
    "disappointment",
    "disapproval",
    "embarrassment",
    "fear",
    "grief",
    "nervousness",
    "remorse",
    "sadness",
}

# everything else → reflective / mixed


def mood_to_color(mood: float) -> str:
    if mood > 0.7:
        return "#91BE78"  # calm / green
    if mood > 0.6:
        return "#F5A623"  # anxious / orange
    return "#5B9BD5"      # reflective / blue



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # MUST include OPTIONS
    allow_headers=["*"],
)
# ---------- API Route ----------

@app.post("/analyze", response_model=EmotionResponse)
def analyze_text(payload: TextInput):
    cleaned = clean_text(payload.text)

    if not cleaned:
        # fallback response
        return EmotionResponse(
            text=payload.text,
            top_emotion="neutral",
            confidence=1.0,
            mood_score=0.55,
            color=mood_to_color(0.55),
        )

    preds = emotion_pipeline(cleaned)[0]  # list of {label, score}
    top = max(preds, key=lambda x: x["score"])
    label = top["label"]
    confidence = float(top["score"])

    mood_score = label_to_mood_score(preds)  # <-- use all predictions
    color = mood_to_color(mood_score)

    return EmotionResponse(
        text=payload.text,
        top_emotion=label,
        confidence=confidence,
        mood_score=mood_score,
        color=color,
    )

@app.post("/generate-checkin")
async def generate_checkin(data: JournalInput):
    tags = [t.strip() for t in data.tag.split(",") if t.strip()]

    result = generate_daily_checkin(
        article=data.article,
        mood_score=data.mood_score,
        tags=tags
    )

    return result


@app.post("/weekly-report", response_model=WeeklyEnergyResponse)
async def get_weekly_energy_report(payload: WeeklyJournalsRequest):
    weekly_journals = [j.dict() for j in payload.weekly_journals]

    result = generate_weekly_energy_report(weekly_journals)

    return result