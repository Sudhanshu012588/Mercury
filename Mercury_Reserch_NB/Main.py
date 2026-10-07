from fastapi import FastAPI,UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from DB.config import connect
from DB.config import save_to_mongo
from Types.Reserch_request import ResearchReq
from Types.Reserch_request import SaveReportRequest
from google import genai
import os
from Reserch_Agent.Agent_config import search_google_custom
from Reserch_Agent.Compiler_Agent import compile_report
from Embedding.Embedding_Agent import get_embedding
from Embedding.Embedding_Agent import chunk_report
from Types.Reserch_request import AskRequest
from DB.config import get_collection
from Embedding.Embedding_Agent import get_embedding
from DB.config import get_collection
from fastapi.middleware.cors import CORSMiddleware
import uuid
from Navigation.extract_pdf import parsePDF
from pathlib import Path
from Navigation.OCR_agent import ocr_image,process_txt
from Navigation.Curriculum_Agent import generate_learning_curriculum
from pathlib import Path
import shutil


app = FastAPI()
load_dotenv()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
# UPLOAD_DIR = "uploads"

# os.makedirs(UPLOAD_DIR, exist_ok=True)
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI missing")
connect(MONGODB_URI)

GEMINI_API_KEY = os.getenv("GEMINI_API")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API missing")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],           
    allow_methods=["*"],              
    allow_headers=["*"],              
)
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/research")
def research(req: ResearchReq):

    client = genai.Client(api_key=GEMINI_API_KEY)

    # Step 1 — Generate Search Query
    query_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are a query generator. Convert this prompt into a short Google search query only: {req.prompt}"
    )

    query = query_response.text.strip()

    # Step 2 — Google Search
    search_results = search_google_custom(query)

    # Step 3 — Compiler Agent (Final Report)
    report = compile_report(
        prompt=req.prompt,
        sources=search_results,
        depth=req.depth
    )

    return {
        "prompt": req.prompt,
        "search_query": query,
        "depth": req.depth,
        "sources_used": search_results,
        "report": report
    }


@app.post("/save_report")
def save_report(req: SaveReportRequest):
    chunks = chunk_report(req.report)

    embedded_chunks = []

    for idx, chunk in enumerate(chunks):
        vector = get_embedding(chunk)
        embedded_chunks.append({
            "index": idx,
            "text": chunk,
            "embedding": vector
        })

    saved_count = save_to_mongo(
        topic=req.topic,
        depth=req.depth,
        chunks=embedded_chunks
    )

    return {
        "message": "Report stored successfully",
        "topic": req.topic,
        "depth": req.depth,
        "chunks_saved": saved_count
    }


@app.post("/ask")
def ask(req: AskRequest):
    collection = get_collection()

    query_embedding = get_embedding(req.question)

    vector_stage = {
        "$vectorSearch": {
            "index": "vector_index",
            "queryVector": query_embedding,
            "path": "embedding",
            "numCandidates": 50,
            "limit": 4
        }
    }

    filters = {}
    if req.topic:
        filters["topic"] = req.topic
    if req.depth:
        filters["depth"] = req.depth

    if filters:
        vector_stage["$vectorSearch"]["filter"] = filters

    pipeline = [vector_stage]

    results = list(collection.aggregate(pipeline))

    if not results:
        return {"answer": "No relevant knowledge found in database yet."}

    context = "\n\n".join([doc["text"] for doc in results])

    client = genai.Client(api_key=GEMINI_API_KEY)

    answer = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
Only answer using the provided context.

Context:
{context}

Question:
{req.question}

Give a clear, concise response.
"""
    )

    return {
        "question": req.question,
        "topic": req.topic,
        "answer": answer.text,
        "sources_used": [
            {"chunk_index": r["chunk_index"], "topic": r["topic"]}
            for r in results
        ]
    }


@app.post("/upload/pdf")
async def upload_pdf(
    docId: str = Form(...),
    file: UploadFile = File(...)
):
    # Validate UUID format
    try:
        uuid.UUID(docId)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid docId format")

    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()

    # Size validation (25MB)
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 25MB)")

    filename = f"{docId}.pdf"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    return {
        "status": "success",
        "docId": docId,
        "filename": filename,
        "message": "PDF uploaded successfully"
    }


@app.post("/parsePDF")
async def parse_route(
    docId: str = Form(...),
    file: UploadFile = File(...)
):
    # =========================
    # 1️⃣ Validate UUID
    # =========================
    try:
        uuid.UUID(docId)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid docId")

    # =========================
    # 2️⃣ Validate PDF
    # =========================
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    contents = await file.read()
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 25MB)")

    # =========================
    # 3️⃣ Create UUID Workspace
    # =========================
    work_dir = UPLOAD_DIR / docId
    work_dir.mkdir(parents=True, exist_ok=True)

    pdf_path = work_dir / "source.pdf"
    with open(pdf_path, "wb") as f:
        f.write(contents)

    try:
        # =========================
        # 4️⃣ Parse PDF
        # =========================
        parse_result = parsePDF(pdf_path)

        txt_path = Path(parse_result["txt_path"])

        # =========================
        # 5️⃣ OCR Processing
        # =========================
        creds_path = (
            os.getenv("GOOGLE_APPLICATION_JSON")
            or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        )
        if not creds_path:
            raise RuntimeError("Google credentials missing")

        final_txt_path = process_txt(txt_path, creds_path)

        # =========================
        # 6️⃣ Gemini Curriculum
        # =========================
        gemini_key = os.getenv("GEMINI_API")
        if not gemini_key:
            raise RuntimeError("Gemini API key missing")

        curriculum = generate_learning_curriculum(final_txt_path, gemini_key)

        return {
            "status": "success",
            "docId": docId,
            "final_text_with_ocr": final_txt_path,
            "curriculum": curriculum
        }

    finally:
        # =========================
        # 7️⃣ CLEANUP UUID FOLDER
        # =========================
        shutil.rmtree(work_dir, ignore_errors=True)

