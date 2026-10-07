# Mercury — AI-Powered Research & Learning Notebook

> An intelligent research workspace that transforms unstructured academic documents into structured, searchable, and navigable knowledge.

Mercury is an AI-powered research notebook designed to help students and researchers process academic papers, lecture notes, textbooks, and other educational documents.

Instead of treating a PDF as a static document, Mercury extracts its underlying structure and converts it into an interactive knowledge workspace. Users can upload research material, extract content using document parsing and OCR, organize the extracted information into a structured curriculum, and navigate through the resulting knowledge graph.

---

## ✨ Key Features

### 📄 Intelligent PDF Processing

Mercury accepts academic PDFs and processes them automatically using a document-processing pipeline.

The backend can:

- Parse PDF documents
- Extract text and document structure
- Process scanned documents using OCR
- Handle documents containing images and non-selectable text
- Convert unstructured document content into structured information

---

### 🧠 AI-Powered Content Structuring

Mercury uses an LLM-powered pipeline to transform extracted document content into meaningful academic structures.

The system can identify:

- Topics
- Subtopics
- Concepts
- Sections
- Relationships between concepts
- Learning/navigation hierarchy

The extracted information is converted into structured JSON that can be stored and consumed by the application.

This allows a large academic document to be represented as a navigable learning structure rather than simply a collection of pages.

---

### 🗺️ Intelligent Navigation

One of Mercury's primary components is its navigation system.

After processing a document, Mercury generates a structured representation of the material that can be used to navigate through the content.

A typical workflow is:

```text
Academic PDF
     │
     ▼
Document Parser
     │
     ▼
Text / Image Extraction
     │
     ▼
OCR (when required)
     │
     ▼
LLM Processing
     │
     ▼
Structured Curriculum
     │
     ▼
MongoDB
     │
     ▼
Interactive Navigation
```

This makes it possible to move from a high-level topic to increasingly specific concepts without manually searching through hundreds of pages.

---

### 🔬 Research Notebook

Mercury includes a dedicated Research Notebook component for working with processed academic material.

The notebook is intended to provide a workspace where users can:

- Explore extracted research material
- Navigate through document structures
- Work with generated knowledge representations
- Access processed content programmatically
- Experiment with AI-powered research workflows

---

## 🏗️ Architecture

Mercury follows a modular full-stack architecture.

```text
                        ┌───────────────────────┐
                        │        USER           │
                        │                       │
                        │  Upload / Explore PDF │
                        └───────────┬───────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │       FRONTEND        │
                        │                       │
                        │  Document Interface   │
                        │  Navigation UI       │
                        │  Research Workspace  │
                        └───────────┬───────────┘
                                    │
                              REST API
                                    │
                                    ▼
                 ┌─────────────────────────────────┐
                 │             BACKEND              │
                 │                                  │
                 │             FastAPI              │
                 │                                  │
                 │  ┌────────────────────────────┐  │
                 │  │     Document Pipeline      │  │
                 │  │                            │  │
                 │  │ PDF → Parse → OCR → Text   │  │
                 │  └─────────────┬──────────────┘  │
                 │                │                 │
                 │                ▼                 │
                 │  ┌────────────────────────────┐  │
                 │  │       AI Processing        │  │
                 │  │                            │  │
                 │  │ LLM → Curriculum /        │  │
                 │  │ Knowledge Extraction       │  │
                 │  └─────────────┬──────────────┘  │
                 │                │                 │
                 └────────────────┼─────────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │       MongoDB         │
                       │                       │
                       │ Documents             │
                       │ Curriculum            │
                       │ Navigation Data       │
                       └───────────────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │   Research Notebook   │
                       │                       │
                       │ Exploration / Analysis│
                       └───────────────────────┘
```

---

## 🔄 Document Processing Pipeline

The core processing pipeline can be summarized as:

```text
                ┌───────────────┐
                │  Upload PDF   │
                └───────┬───────┘
                        │
                        ▼
              ┌───────────────────┐
              │   PDF Extraction  │
              │    PyMuPDF        │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │ Is text available?│
              └───────┬─────┬─────┘
                      │     │
                    YES      NO
                      │     │
                      │     ▼
                      │  ┌─────────┐
                      │  │   OCR   │
                      │  └────┬────┘
                      │       │
                      └───┬───┘
                          ▼
                ┌───────────────────┐
                │ Extracted Content │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   LLM Analysis    │
                │                   │
                │ Topic Extraction  │
                │ Hierarchy         │
                │ Relationships     │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Curriculum JSON   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │     MongoDB       │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Navigation Layer  │
                └───────────────────┘
```

---

## 🧩 Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Modern component-based UI architecture

### Backend

- Python
- FastAPI
- REST APIs
- PyMuPDF for PDF processing

### Artificial Intelligence

- Large Language Models for document understanding
- LLM-based curriculum and concept extraction
- Structured JSON generation

### Database

- MongoDB
- MongoDB collections for processed documents and navigation structures

### Research / Data Processing

- Python
- Jupyter Notebook
- PDF processing
- OCR pipeline
- JSON-based knowledge representation

---

## 📁 Repository Structure

```text
Mercury/
│
├── Backend/
│   │
│   ├── API / server implementation
│   ├── PDF processing
│   ├── AI processing pipeline
│   ├── Database integration
│   └── Navigation generation
│
├── Frontend/
│   │
│   ├── React application
│   ├── User interface
│   ├── Document interaction
│   └── Navigation interface
│
├── Mercury_Reserch_NB/
│   │
│   └── Research notebook and
│       experimentation components
│
├── .venv/
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Sudhanshu012588/Mercury.git
cd Mercury
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

> Never commit API keys, database credentials, or other secrets to GitHub.

---

## 4. Start the Backend

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API should then be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation can typically be accessed at:

```text
http://localhost:8000/docs
```

---

## 5. Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will provide the interface for interacting with Mercury.

---

# 🔌 Core API Workflow

A typical document-processing request follows this pattern:

```text
Client
  │
  │ Upload PDF
  ▼
POST /parsePDF
  │
  ▼
PDF Processing
  │
  ├── Text Extraction
  │
  └── OCR
  │
  ▼
LLM Processing
  │
  ▼
Curriculum JSON
  │
  ▼
MongoDB
  │
  ▼
Navigation API
  │
  ▼
Frontend
```

---

# 🧠 AI-Powered Curriculum Generation

Mercury converts extracted document content into a structured representation.

For example, a document containing:

```text
Machine Learning
├── Supervised Learning
│   ├── Linear Regression
│   ├── Logistic Regression
│   └── Decision Trees
│
├── Unsupervised Learning
│   ├── Clustering
│   └── Dimensionality Reduction
│
└── Neural Networks
    ├── Perceptron
    ├── Backpropagation
    └── CNN
```

can be represented as machine-readable JSON:

```json
{
  "title": "Machine Learning",
  "topics": [
    {
      "name": "Supervised Learning",
      "subtopics": [
        "Linear Regression",
        "Logistic Regression",
        "Decision Trees"
      ]
    },
    {
      "name": "Unsupervised Learning",
      "subtopics": [
        "Clustering",
        "Dimensionality Reduction"
      ]
    }
  ]
}
```

This structured representation forms the foundation of Mercury's navigation system.

---

# 🎯 Design Goals

Mercury is built around several key principles:

### 1. Structure Unstructured Knowledge

Academic documents contain valuable information but are often difficult to navigate. Mercury attempts to expose the underlying structure of that information.

### 2. Reduce Manual Research

Instead of manually reading and categorizing large documents, AI-assisted processing performs the initial organization automatically.

### 3. Create Navigable Knowledge

Extracted content is transformed into a hierarchy that allows users to move through related concepts.

### 4. Combine Traditional Document Processing with LLMs

Mercury combines deterministic document-processing tools with generative AI:

```text
Deterministic Processing
        +
OCR / PDF Extraction
        +
LLM Reasoning
        +
Structured Data
        =
Intelligent Research Workspace
```

---

# 🛠️ Development Workflow

The project can be developed as three major components:

```text
                MERCURY
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
   Frontend     Backend     Research NB
       │           │           │
       │           │           │
       ▼           ▼           ▼
    React       FastAPI     Jupyter
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       MongoDB             LLM
```

This separation allows the AI/document-processing pipeline to evolve independently from the user interface and research experiments.

---

# 🔮 Future Improvements

Potential future directions include:

- [ ] Automatic document classification
- [ ] Automatic query/intention classification
- [ ] Semantic search across processed documents
- [ ] Retrieval-Augmented Generation (RAG)
- [ ] Citation-aware question answering
- [ ] Vector database integration
- [ ] Knowledge graph generation
- [ ] Cross-document concept linking
- [ ] AI-generated research summaries
- [ ] Automatic prerequisite detection between concepts
- [ ] Personalized learning paths
- [ ] Multi-document research workspaces
- [ ] Agentic research workflows
- [ ] Improved OCR for complex academic documents
- [ ] Streaming document processing
- [ ] Background processing for large documents

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

```bash
git clone https://github.com/Sudhanshu012588/Mercury.git
cd Mercury

git checkout -b feature/your-feature

# Make your changes

git add .
git commit -m "Add: your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# ⚠️ Notes

Mercury is an active research/development project. AI-generated structures should be treated as assistive outputs and verified against the original source material when accuracy is important.

LLM outputs may occasionally contain incorrect classifications, missing concepts, or inaccurate relationships.

---

# 📜 License

Add the project's license information here once a license has been selected for the repository.

---

# 👨‍💻 Author

**Sudhanshu Jha**

IIT Bhubaneswar

GitHub: [@Sudhanshu012588](https://github.com/Sudhanshu012588)

---

## ⭐ Mercury

Mercury aims to turn the traditional research workflow from:

```text
Search → Open PDF → Read → Search Again → Take Notes
```

into:

```text
                Upload
                  │
                  ▼
              Understand
                  │
                  ▼
               Structure
                  │
                  ▼
               Navigate
                  │
                  ▼
                Explore
                  │
                  ▼
                Research
```

**From static documents to structured knowledge.**