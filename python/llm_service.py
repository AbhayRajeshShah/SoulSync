# llm_service.py
import google.generativeai as genai
from datetime import datetime
import json
from dotenv import load_dotenv
load_dotenv()
import os
import json
from datetime import datetime
from typing import Any

# Configure API Key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel("gemini-2.5-flash")

icons = [
    "wind", "footprints", "sparkles", "zap",
    "heart", "smile", "sun", "flame", "spark", "compass",
    "frown", "meh", "heart_crack", "cloud", "cloud_rain",
    "cloud_drizzle", "cloud_lightning",
    "moon", "feather", "anchor", "leaf",
    "music", "move", "dumbbell", "book", "pen", "timer",
    "activity", "water", "coffee", "rest", "shield",
    "hand_heart", "brain", "cloud_sun"
]


def generate_daily_checkin(article: str, mood_score: int, tags: list[str]):
    """
    Creates structured JSON emotional insights based on:
    - User journal article
    - User mood score (1–10)
    - Extracted tags list
    """

    today = datetime.now().strftime("%Y-%m-%d")

    prompt = f"""
You are an empathetic mental-health assistant.

The user has submitted:
- Article: {article}
- Mood Score (1-10): {mood_score}
- Tags: {", ".join(tags)}

Generate a JSON object EXACTLY in this structure:

{{
  "dailyCheckIn": {{
    "date": "{today}",
    "emotionalTone": "...",
    "validation": "...",
    "quickFixes": [
      {{
        "id": 1,
        "title": "...",
        "description": "...",
        "duration": "...",
        "icon": "..."
      }}
    ],
    "guidedSupport": "...",
    "miniInsight": "...",
    "moodScore": {mood_score}
  }}
}}

Rules:
- Respond ONLY with valid JSON.
- emotionalTone must be 1 word (e.g., "anxious", "stressed", "optimistic").
- quickFixes must contain exactly 4 items.
- Keep wording empathetic, simple, and helpful.
- "validation" should acknowledge user experience based on article.
- "miniInsight" should reflect recurring patterns or keywords.

The "icon" field MUST be strictly one of the following:
["wind","footprints","sparkles","zap","heart","smile","sun","flame","spark","compass","frown","meh","heart_crack","cloud","cloud_rain","cloud_drizzle",
"cloud_lightning","moon","feather","anchor","leaf","music","move","dumbbell",
"book","pen","timer","activity","water","coffee","rest","shield","hand_heart",
"brain","cloud_sun"]

Do NOT return any other icon name outside this list.
Do NOT return emojis. Use only the string keys above.

Return ONLY valid JSON.
Do NOT include triple backticks.
Do NOT include markdown formatting.
Do NOT include ```json fences.

Required JSON schema:
{ ... }
    """

    response = model.generate_content(prompt)

    # Parse JSON safely
    try:
        result = json.loads(response.text)
        return result
    except Exception as e:
        raise ValueError(f"Invalid JSON from model: {response.text}") from e



def _to_datetime(value: Any) -> datetime:
    if isinstance(value, datetime):
        return value
    # handle ISO strings with/without 'Z'
    s = str(value).replace("Z", "")
    return datetime.fromisoformat(s)

def _format_week_label(start: datetime, end: datetime) -> str:
    # Example: "Nov 17-23, 2025" if same month & year
    if start.year == end.year and start.month == end.month:
        month = start.strftime("%b")
        return f"{month} {start.day}-{end.day}, {start.year}"
    # Fallback if week spans months/years
    start_str = start.strftime("%b %d, %Y")
    end_str = end.strftime("%b %d, %Y")
    return f"{start_str} - {end_str}"

def generate_weekly_energy_report(weekly_journals: list[dict]):
    """
    Creates a structured weekly energy report JSON based on:
    - weekly_journals: list of journal-like dicts for a single week.
      Each item is expected to have at least a 'timestamp' and 'text',
      and optionally mood_score, tags, etc.
    """

    if not weekly_journals:
        raise ValueError("weekly_journals must contain at least one entry")

    # Infer week range from timestamps
    dates = [_to_datetime(j["timestamp"]) for j in weekly_journals if "timestamp" in j]
    if not dates:
        raise ValueError("weekly_journals entries must contain 'timestamp' field")

    start_date = min(dates)
    end_date = max(dates)
    week_label = _format_week_label(start_date, end_date)

    # Serialize journals so the model can "see" the raw data
    journals_json = json.dumps(weekly_journals, ensure_ascii=False, indent=2)

    prompt = f"""
You are an empathetic mental-health assistant.

The user has the following journal data for the week:
- Week: {week_label}
- Weekly Journals (raw data as JSON):
{journals_json}

Using this information, generate a weekly energy report as a JSON object
EXACTLY in the following structure:

{{
  "weeklyEnergyData": {{
    "week": "{week_label}",
    "energyDrains": [
      {{
        "id": 1,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }},
      {{
        "id": 2,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }},
      {{
        "id": 3,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }}
    ],
    "energyBoosters": [
      {{
        "id": 1,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }},
      {{
        "id": 2,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }},
      {{
        "id": 3,
        "factor": "...",
        "impact": 0,
        "frequency": "...",
        "icon": "..."
      }}
    ],
    "behavioral": {{
      "averageSleep": 0,
      "exerciseDays": 0,
      "socialActivities": 0,
      "stressfulMoments": 0
    }},
    "summary": "..."
  }}
}}

Rules:
- Respond ONLY with valid JSON.
- Do NOT include any markdown or backticks.
- "week" MUST be "{week_label}".
- "energyDrains" must contain EXACTLY 3 items.
- "energyBoosters" must contain EXACTLY 3 items.
- "impact" should be an integer from 0 to 100 (higher = stronger impact on energy).
- "frequency" should be a short human-readable phrase (e.g., "5 days", "3 nights", "1 incident", "Daily").
- "factor" should be a concise description of the energy drain/booster, inferred from patterns in the journals.
- "behavioral" values should be reasonable numeric estimates based on the week's patterns.
- "summary" should be 2–3 sentences, empathetic, and focused on what drained vs boosted energy, with a gentle suggestion for next week.

The "icon" field for drains and boosters MUST be one of the following strings:
["briefcase","moon","users","activity","heart","smile","sun","coffee","book","music",
"cloud","cloud_rain","dumbbell","rest","brain","shield","compass","leaf","water","zen"]

Do NOT return any other icon name outside this list.
Do NOT return emojis. Use only the string keys above.

Return ONLY valid JSON.
Do NOT include triple backticks.
Do NOT include markdown formatting.
Do NOT include ```json fences.
    """

    response = model.generate_content(prompt)

    # Parse JSON safely
    try:
        result = json.loads(response.text)
        return result
    except Exception as e:
        raise ValueError(f"Invalid JSON from model: {response.text}") from e