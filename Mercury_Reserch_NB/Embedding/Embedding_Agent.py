from google import genai
import os
import textwrap

def chunk_report(text: str, chunk_size=1200):
    return textwrap.wrap(text, chunk_size)


def get_embedding(text: str):
    GEMINI_API_KEY = os.getenv("GEMINI_API")
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API missing")

    client = genai.Client(api_key=GEMINI_API_KEY)

    res = client.models.embed_content(
        model="text-embedding-004",
        contents=text
    )

    return res.embeddings[0].values
