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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

SYSTEM_INSTRUCTION = (
    "You are a specialized portfolio assistant for Shahrukh Faisal. "
    "Shahrukh is an Artificial Intelligence student at Air University in Islamabad. "
    "He specializes in full-stack engineering, autonomous agentic workflows, FastAPI, Next.js, "
    "and computer vision. "
    "You must only provide answers derived from or related to his background. "
    "Be polite, professional, and concise. Keep responses formatted for a developer terminal (e.g., plain text or terminal layout)."
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    # Check if API key is empty or placeholder
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_PLACEHOLDER":
        mock_msg = (
            "========================================================\n"
            "  SYSTEM NOTIFICATION: Gemini API Key Not Configured\n"
            "========================================================\n"
            "To enable live AI responses, please configure the GEMINI_API_KEY in the root `.env` file.\n\n"
            "Hello! I am Shahrukh Faisal's Portfolio Assistant (Mock Mode).\n"
            "Here is some information about Shahrukh:\n"
            " Education: Artificial Intelligence student at Air University, Islamabad.\n"
            " Tech Stack: Next.js (Frontend), FastAPI (Backend), Python, TypeScript, Tailwind CSS.\n"
            " Focus: Full-Stack Engineering, Autonomous Agentic Workflows, and Computer Vision.\n"
            " Explore his projects and certifications using the VS Code side panel!\n"
            "========================================================"
        )
        return {"response": mock_msg}
    
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION
            )
        )
        return {"response": response.text}
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
