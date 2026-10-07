from google import genai
import os
import json

def compile_report(prompt: str, sources: list, depth: int = 1):
    """
    Compiler Agent:
    Takes search results and writes a detailed structured report using Gemini
    """

    GEMINI_API_KEY = os.getenv("GEMINI_API")
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API missing")

    client = genai.Client(api_key=GEMINI_API_KEY)

    system_prompt = f"""
You are a professional research compiler agent.

Task:
Use the provided search results to write a detailed analysis report on:
"{prompt}"

Rules:
1. Base insights ONLY on the provided data.
2. If certain information is not available, explicitly state it instead of guessing.
3. Structure the response clearly, professional tone.
4. Include citations by attaching the source link at the end of relevant sections.
5. Provide key insights, market context, and actionable conclusions.
6. Provide bullet-point summary at end.
7. Depth level = {depth}. Higher depth → more detailed & analytical reporting.

Return strictly in this structure:

Title
Executive Summary
Detailed Insights
Key Data Points
Challenges / Risks
Future Outlook
Conclusion
References (list all source links)

return in markdown format which when presented looks more readable and pretier.
"""

    # Convert sources to readable JSON for Gemini
    sources_text = json.dumps(sources, indent=2)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            system_prompt,
            f"\n\nSources:\n{sources_text}"
        ]
    )

    return response.text.strip()
