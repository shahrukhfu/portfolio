import os
import json
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment!")

# Initialize Google GenAI Embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=api_key
)

def ingest_portfolio_data():
    documents = []
    
    # Resolve relative paths in workspace
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    data_dir = os.path.join(base_dir, "data")
    
    # 1. Parse projects.md
    projects_path = os.path.join(data_dir, "projects.md")
    if os.path.exists(projects_path):
        print(f"Parsing projects from {projects_path}...")
        with open(projects_path, "r", encoding="utf-8") as f:
            projects_content = f.read()
            
        # Clean escapes to normalize headers split
        clean_projects = (
            projects_content
            .replace("\\#", "#")
            .replace("\\-", "-")
            .replace("\\*", "*")
            .replace("\\&", "&")
        )
        
        headers_to_split = [
            ("#", "Project"),
        ]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split)
        project_chunks = markdown_splitter.split_text(clean_projects)
        
        for chunk in project_chunks:
            chunk.metadata["source"] = "projects.md"
            documents.append(chunk)
            print(f"Added project chunk: {chunk.metadata.get('Project', 'General')}")
    else:
        print(f"WARNING: {projects_path} not found.")

    # 2. Parse certifications.json
    certs_path = os.path.join(data_dir, "certifications.json")
    if os.path.exists(certs_path):
        print(f"Parsing certifications from {certs_path}...")
        with open(certs_path, "r", encoding="utf-8") as f:
            certs_data = json.load(f)
            
        for cert in certs_data:
            skills = ", ".join(cert.get("skills_and_focus", []))
            cert_text = (
                f"Certification: {cert.get('title')}\n"
                f"Issuer: {cert.get('issuer')}\n"
                f"Issue Date: {cert.get('issue_date')}\n"
                f"Credential ID: {cert.get('credential_id')}\n"
                f"Skills Focus: {skills}"
            )
            doc = Document(
                page_content=cert_text,
                metadata={"source": "certifications.json", "title": cert.get("title")}
            )
            documents.append(doc)
            print(f"Added certification chunk: {cert.get('title')}")
    else:
        print(f"WARNING: {certs_path} not found.")

    # 3. Load tech_stack.json
    tech_path = os.path.join(data_dir, "tech_stack.json")
    if os.path.exists(tech_path):
        print(f"Parsing tech stack from {tech_path}...")
        with open(tech_path, "r", encoding="utf-8") as f:
            tech_data = json.load(f)
            
        tech_lines = ["Developer Technical Skill Matrix:"]
        for category, skills in tech_data.items():
            if isinstance(skills, list):
                tech_lines.append(f"- {category.replace('_', ' ').capitalize()}: {', '.join(skills)}")
        
        tech_text = "\n".join(tech_lines)
        doc = Document(
            page_content=tech_text,
            metadata={"source": "tech_stack.json"}
        )
        documents.append(doc)
        print("Added tech stack chunk.")
    else:
        print(f"WARNING: {tech_path} not found.")

    # 4. Commit into ChromaDB persistence directory
    chroma_dir = os.path.join(base_dir, "backend", "chroma_db")
    print(f"Writing vector embeddings to persist directory: {chroma_dir}...")
    
    # Save indexes locally
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=chroma_dir
    )
    
    print("Ingestion complete! Vector blocks persisted successfully.")

if __name__ == "__main__":
    ingest_portfolio_data()
