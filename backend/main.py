import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Shahrukh Faisal Portfolio Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-custom-domain.com",      # PLACEHOLDER: Change to your custom domain (e.g. shahrukhfaisal.com)
        "https://www.your-custom-domain.com",  # PLACEHOLDER: Change to your custom domain with www
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # Matches all Vercel previews and production deployments!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# ---------------------------------------------------------------------------
# RAG Retriever Initialization
# ---------------------------------------------------------------------------
_retriever = None

def get_retriever():
    """Lazy-load the Chroma vector store retriever (top-3 similarity)."""
    global _retriever
    if _retriever is not None:
        return _retriever

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_PLACEHOLDER":
        return None

    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    from langchain_community.vectorstores import Chroma

    chroma_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
    if not os.path.isdir(chroma_dir):
        print(f"WARNING: ChromaDB directory not found at {chroma_dir}. Run rag/ingest.py first.")
        return None

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=api_key,
    )
    vector_store = Chroma(
        persist_directory=chroma_dir,
        embedding_function=embeddings,
    )
    _retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 8},
    )
    return _retriever

# ---------------------------------------------------------------------------
# System Prompt Template
# ---------------------------------------------------------------------------
SYSTEM_TEMPLATE = """\
You are an advanced terminal automation agent embedded inside the interactive portfolio website IDE of Shahrukh Faisal. Your sole responsibility is to accurately answer questions about Shahrukh's projects, technical stack, skills, certifications, and academic background using the verified text fragments provided in the Context block below.

Strict Directives & Guardrails:
1. Grounded Factual Accuracy: Answer the user's question using ONLY the explicit information provided in the Context fragments. Do not extrapolate, assume, or hallucinate career details.
2. The Strict Out-of-Bounds Fallback: If a user asks a question that cannot be answered using the provided context fragments, or if they try to ask general, off-topic questions (e.g., world history, coding riddles, unrelated facts), do not engage or answer. Instead, output exactly this terminal error string:
   "Error: Requested metric context not found in database records. Please try another query or explore the file tree sidebar panels."
3. Absolute Professional Persona: Maintain a concise, technical, software engineer tone. Never use conversational filler sentences like "Based on the documents provided..." or "According to his profile...". State the facts directly.
4. Output Format: Format your output cleanly using raw markdown syntax optimized for rendering inside a monospaced Linux terminal panel. Keep responses brief to prevent heavy vertical scrolling in the terminal view.

Context Fragments:
---------------------
{context}
---------------------

User Terminal Query: {question}"""


@app.post("/api/chat")
async def chat(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY", "")

    # ── Guard: missing / placeholder API key ──
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_PLACEHOLDER":
        return {
            "response": (
                "========================================================\n"
                "  SYSTEM NOTIFICATION: Gemini API Key Not Configured\n"
                "========================================================\n"
                "To enable live AI responses, please configure the GEMINI_API_KEY in the root `.env` file.\n\n"
                "Hello! I am Shahrukh Faisal's Portfolio Assistant (Mock Mode).\n"
                "Here is some information about Shahrukh:\n"
                " Education: Artificial Intelligence student at Air University, Islamabad.\n"
                " Tech Stack: Next.js, FastAPI, PyTorch, TensorFlow, OpenCV, Docker, Python, TypeScript, C++, Assembly.\n"
                " Focus: AI Engineering, Deep Vision Pipelines, Multi-Agent Systems, Full-Stack & Systems.\n"
                " Explore his projects and certifications using the VS Code side panel!\n"
                "========================================================"
            )
        }

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_core.output_parsers import StrOutputParser
        from langchain_core.runnables import RunnablePassthrough

        # ── Build retriever ──
        retriever = get_retriever()
        if retriever is None:
            return {
                "response": (
                    "ERROR: Vector database not initialized.\n"
                    "Run `python rag/ingest.py` from the backend directory to build the index."
                )
            }

        # ── LLM ──
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.2,
        )

        # ── Prompt ──
        prompt = ChatPromptTemplate.from_template(SYSTEM_TEMPLATE)

        # ── Helper: format retrieved docs into a single context string ──
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        # ── LCEL RAG chain ──
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        answer = rag_chain.invoke(request.message)
        return {"response": answer}

    except Exception as e:
        import traceback
        traceback.print_exc()
        err_msg = str(e)
        if "API key not valid" in err_msg or "API_KEY_INVALID" in err_msg:
            return {
                "response": (
                    "========================================================\n"
                    "  API KEY AUTHORIZATION ERROR\n"
                    "========================================================\n"
                    "The Gemini API key provided in the root `.env` is invalid.\n"
                    "Google returned: 'API key not valid. Please pass a valid API key.'\n\n"
                    "Please double check the API key value in your root `.env` file.\n"
                    "Gemini API keys typically start with 'AIzaSy...'\n"
                    "========================================================"
                )
            }
        raise HTTPException(status_code=500, detail=f"Error generating response: {err_msg}")


@app.get("/")
async def root():
    return {"status": "online", "message": "Shahrukh Faisal Portfolio Backend is running"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
