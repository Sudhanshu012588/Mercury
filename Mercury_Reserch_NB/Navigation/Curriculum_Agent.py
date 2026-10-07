import json
import re
from pathlib import Path
from google import genai


def clean_json(raw: str):
    """
    Safely extract JSON if Gemini wraps it inside text or code fences.
    """
    raw = raw.strip()

    # Remove Markdown ```json fences
    if raw.startswith("```"):
        raw = re.sub(r"```[a-zA-Z]*", "", raw)
        raw = raw.replace("```", "").strip()

    # Extract JSON block if extra text exists
    json_match = re.search(r"\{[\s\S]*\}", raw)
    if json_match:
        return json_match.group(0)

    return raw


def generate_learning_curriculum(txt_path: str, api_key: str):
    txt_path = Path(txt_path).resolve()

    if not txt_path.exists():
        raise FileNotFoundError(f"Study text file not found: {txt_path}")

    study_text = txt_path.read_text(encoding="utf-8")

    prompt = f"""
You are a JSON generator.

You MUST output VALID JSON.
You MUST NOT explain your reasoning.
You MUST NOT rewrite questions.
You MUST NOT self-correct.
You MUST NOT add text outside JSON.
If you are unsure, write "insufficient information".
You will be given the full study text below. Convert it into a structured learning curriculum.


STRICT RULES:
- Output ONLY valid JSON.
- NO markdown.
- NO extra explanation.
- NO comments.
- If information is missing, write "insufficient information".
- DON'T LEFT OPTION EMPTY LIKE JUST A,B,C,D WRITE SOMETHING ON THOSE OPTION LIKE A MCQ 

JSON STRUCTURE:
{{
  "topic": "<topic name>",
  "modules": [
    {{
      "module_number": <number>,
      "title": "<short title>",
      "description": "<short explanation>",
      "coverage_source_text_range": "<approx section covered>",
      "test": {{
        "instructions": "short instruction",
        "questions": [
          {{
            "question": "<deep conceptual question>",
            "options": ["A ...","B ...","C ...","D...."],
            "correct_answer": "<A/B/C/D>",
            "explanation": "<why answer is correct>"
          }}
        ]
      }}
    }}
  ]
}}
THE DESCRIPTION OF EACH MODULE SHOULD CONTAIN A DETAILED EXPLANATION OF THE TOPIC THAT IT IS COVERING
STUDY TEXT:
======================
{study_text}
======================
"""

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    raw_output = response.text or ""

    # Try cleaning response
    cleaned = clean_json(raw_output)

    try:
        return json.loads(cleaned)

    except Exception as e:
        print("\n======= GEMINI RAW OUTPUT =======")
        print(raw_output)
        print("=================================\n")
        raise ValueError(
            f"Gemini did not return valid JSON. "
            f"Parsing failed: {str(e)}"
        )
