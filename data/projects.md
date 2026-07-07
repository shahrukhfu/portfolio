# Shahrukh Faisal - Project Portfolios

This master document aggregates the active full-stack engineering, artificial intelligence, and autonomous agent systems engineered by Shahrukh Faisal.

---

# Local RAG Chatbot
- **GitHub Repository:** https://github.com/shahrukhfu/local-rag-chatbot

### Project Description
An enterprise-grade, fully offline knowledge-retrieval platform built to process complex document sets without cloud data leakage. The system ingests disparate unstructured data sources, translates them into mathematical representations, and hooks them into a localized inference workflow. It provides an absolute sandbox environment for privacy-centric context querying.

### Core Tech Stack
- LangChain / LlamaIndex
- ChromaDB / FAISS
- Local LLMs (Ollama / HuggingFace)
- Python

### System Architecture & Logic
- Data Ingestion: Chunks local PDF and Markdown documents into customizable text fragments.
- Vector Pipeline: Uses local embedding models to convert text fragments into dense vectors.
- Context Storage: Saves vectors inside a lightweight, local vector index database.
- Execution Flow: Intercepts user queries, retrieves relevant document fragments based on cosine similarity, and builds a grounded prompt context sent to an offline LLM instance.

---

# Embedded Elevator Control System
- **GitHub Repository:** https://github.com/shahrukhfu/embedded-elevator-control-system

### Project Description
A highly optimized, low-level concurrent hardware-software simulation modeling an industrial multi-cabin elevator group control framework. The system focuses on state synchronization, scheduling optimization under dense request profiles, and strict electrical logic safety bounds to minimize rider wait times and maximize system throughput.

### Core Tech Stack
- Verilog HDL / C / Embedded C
- Microcontroller Frameworks (Arduino / PIC / FPGA simulation)
- Multisim / Digital Logic Architectures

### System Architecture & Logic
- State Management: Uses Finite State Machines (FSM) to continuously monitor lift cabin position, movement directions, and door control constraints.
- Scheduling Logic: Integrates a priority encoder approach to scan, process, and optimize multiple concurrent internal cabin requests and outer hall floor calls.
- Safety Loops: Implements immediate hardware sensor flags simulating weight constraints, infrared obstruction detection, and emergency physical stops.

---

# Brain MRI Analysis Deep Vision Pipeline
- **GitHub Repository:** https://github.com/shahrukhfu/brain-mri-analysis-deep-vision-pipeline

### Project Description
An end-to-end medical computer vision application designed to automatically segment structural volumetric regions and isolate brain tumors or lesions from raw MRI data layers. Engineered to act as a diagnostic aid, it bridges convolutional neural processing with real-time geometric visual reporting arrays.

### Core Tech Stack
- PyTorch / TensorFlow
- OpenCV
- NumPy & Scikit-Learn
- Python

### System Architecture & Logic
- Preprocessing Block: Applies adaptive histogram equalization, noise reduction filters, and intensity normalization across arbitrary MRI dataset inputs.
- Deep Feature Extraction: Implements Convolutional Neural Networks (CNNs) and specialized U-Net variants optimized for multi-class semantic segmentation masks.
- Analysis Engine: Generates geometric metric profiles, volume statistics, and anomalous target localization coordinates for clinical auditing pipelines.

---

# AI Genius Backend
- **GitHub Repository:** https://github.com/shahrukhfu/ai-genius-backend

### Project Description
A high-performance, resilient asynchronous server architecture designed to orchestrate scalable AI microservices, manage stream-heavy model inference execution paths, and handle state distribution loops across highly active user sessions.

### Core Tech Stack
- FastAPI
- Python
- PostgreSQL / Redis
- Docker

### System Architecture & Logic
- Connection Handling: Uses Python's native asyncio loops to manage highly concurrent WebSocket integrations and server-sent event (SSE) model streaming pipelines.
- Security Subsystem: Implements strict JWT authentication, resource-based middleware access controls, and strict endpoint rate-limiting behaviors.
- State Context Layer: Integrates Redis caching networks to securely retain transactional operational context and token usage histories across multiple distinct user sessions.

---

# GitHub Project Recommending Agent
- **GitHub Repository:** https://github.com/shahrukhfu/Github-Project-Recommending-Agent

### Project Description
An autonomous automation agent built to dynamically scan developer activity footprints on GitHub and match them with personalized, highly compatible open-source repositories. The agent operates recursively, analyzing coding dialects and repository structures to output tailored collaboration opportunities.

### Core Tech Stack
- Python
- GitHub REST / GraphQL API
- Vector Databases
- LLM Orchestration (n8n / LangChain)

### System Architecture & Logic
- Footprint Extraction: Pulls repository commit histories, starred projects, and language distribution variables directly from target user profiles via the GitHub API.
- Vector Alignment: Converts raw developer profile properties into dynamic vector embeddings representing specific domains of technical interest.
- Agentic Execution Loop: Runs recursive web-search and indexing tasks to match the user's vector signature against open-source codebases, producing ranked suggestions containing explanatory reasoning chains.

---

# Customer Retention Engine
- **GitHub Repository:** https://github.com/shahrukhfu/customer-retention-engine

### Project Description
A data science and machine learning analytics workflow engineered to predict customer churn dynamics within subscription databases. The system isolates specific behavioral risk patterns and computes probabilistic matrices to identify declining client engagement metrics before cancellation occurs.

### Core Tech Stack
- Python
- Pandas / NumPy
- Scikit-Learn / XGBoost
- FastAPI

### System Architecture & Logic
- Pipeline Operations: Cleans historical client engagement data, scales numeric features, and structures time-series activity vectors.
- Predictive Analytics: Trains high-performance classification ensembles (XGBoost, Random Forests) calibrated on structural class imbalances.
- Business Logic Layer: Translates feature importance arrays into clear metrics, exporting programmatic actionable flags to connected customer support channels via an API framework.

---

# Loan Predict AI
- **GitHub Repository:** https://github.com/shahrukhfu/loan-predict-ai

### Project Description
A rigorous credit-scoring and financial risk assessment application developed to evaluate loan default probabilities. Combining predictive accuracy with regulatory alignment, the tool uses demographic metrics and financial criteria to construct a real-time transactional audit workspace.

### Core Tech Stack
- Python
- Scikit-Learn
- FastAPI / Flask
- Streamlit

### System Architecture & Logic
- Data Preparation: Corrects null parameters, handles variable encodings across arbitrary credit score profiles, and scales financial assets criteria.
- Risk Scoring: Computes real-time default probability indices using robust logistic models or gradient-boosted decision bounds.
- UI Sandbox: Employs a testing dashboard framework enabling risk officers to toggle underlying asset figures and immediately check predictive confidence scoring intervals.

---

# Simple Multi-Agent Chat System
- **GitHub Repository:** https://github.com/shahrukhfu/Simple-Multi-Agent-Chat-System

### Project Description
A modular orchestration system demonstrating autonomous agent-to-agent collaboration. By spawning separate AI workers initialized with distinct personas and evaluation mandates, the framework executes a collaborative message bus where agents analyze problems, run feedback loops, and collectively sign off on software architectures.

### Core Tech Stack
- Python / TypeScript
- OpenAI API / Gemini API
- Agentic Mesh Networks (CrewAI / AutoGen)

### System Architecture & Logic
- Role Orchestration: Spawns independent AI actor profiles initialized with separate identities (e.g., Code Architect, Security Reviewer, Test Engineer).
- Group Consensus Logic: Runs messaging state buses allowing actors to securely hand off conversational payloads, critique colleague outputs, and execute step-by-step corrections.
- Output Generation: Compiles structural multi-layered technical documentation or codebase frameworks reviewed, debugged, and signed off autonomously by the cluster agents.