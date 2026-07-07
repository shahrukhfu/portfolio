\# Shahrukh Faisal - Project Portfolios



This master document aggregates the active full-stack engineering, artificial intelligence, and autonomous agent systems engineered by Shahrukh Faisal.



\---



\# Local RAG Chatbot



\### Overview

An open-source, fully offline Retrieval-Augmented Generation (RAG) implementation designed to privacy-securely interact with and query local documents without cloud-dependencies.



\### Core Tech Stack

\- LangChain / LlamaIndex

\- ChromaDB / FAISS

\- Local LLMs (Ollama / HuggingFace)

\- Python



\### System Architecture \& Logic

\- Data Ingestion: Chunks local PDF and Markdown documents into customizable text fragments.

\- Vector Pipeline: Uses local embedding models to convert text fragments into dense vectors.

\- Context Storage: Saves vectors inside a lightweight, local vector index database.

\- Execution Flow: Intercepts user queries, retrieves relevant document fragments based on cosine similarity, and builds a grounded prompt context sent to an offline LLM instance.



\---



\# Embedded Elevator Control System



\### Overview

A low-level hardware-software co-design project modeling a responsive, real-time elevator group management system prioritizing efficiency and scheduling.



\### Core Tech Stack

\- Verilog HDL / C / Embedded C

\- Microcontroller Frameworks (Arduino / PIC / FPGA simulation)

\- Multisim / Digital Logic Architectures



\### System Architecture \& Logic

\- State Management: Uses Finite State Machines (FSM) to continuously monitor lift cabin position, movement directions, and door control constraints.

\- Scheduling Logic: Integrates a priority encoder approach to scan, process, and optimize multiple concurrent internal cabin requests and outer hall floor calls.

\- Safety Loops: Implements immediate hardware sensor flags simulating weight constraints, infrared obstruction detection, and emergency physical stops.



\---



\# Brain MRI Analysis Deep Vision Pipeline



\### Overview

A state-of-the-art computer vision and machine learning medical imaging system engineered to automatically detect, segment, and segment clear structural boundaries or anomalies inside brain MRI scans.



\### Core Tech Stack

\- PyTorch / TensorFlow

\- OpenCV

\- NumPy \& Scikit-Learn

\- Python



\### System Architecture \& Logic

\- Preprocessing Block: Applies adaptive histogram equalization, noise reduction filters, and intensity normalization across arbitrary MRI dataset inputs.

\- Deep Feature Extraction: Implements Convolutional Neural Networks (CNNs) and specialized U-Net variants optimized for multi-class semantic segmentation masks.

\- Analysis Engine: Generates geometric metric profiles, volume statistics, and anomalous target localization coordinates for clinical auditing pipelines.



\---



\# AI Genius Backend



\### Overview

A high-throughput, asynchronous backend infrastructure engineered to serve complex generative AI features, dynamic model inference pipelines, and scalable microservices.



\### Core Tech Stack

\- FastAPI

\- Python

\- PostgreSQL / Redis

\- Docker



\### System Architecture \& Logic

\- Connection Handling: Uses Python's native asyncio loops to manage highly concurrent WebSocket integrations and server-sent event (SSE) model streaming pipelines.

\- Security Subsystem: Implements strict JWT authentication, resource-based middleware access controls, and strict endpoint rate-limiting behaviors.

\- State Context Layer: Integrates Redis caching networks to securely retain transactional operational context and token usage histories across multiple distinct user sessions.



\---



\# GitHub Project Recommending Agent



\### Overview

An autonomous, intelligence-driven recommendation workflow agent designed to analyze user behavior, developer stack footprints, and interest metrics to recommend ideal open-source source repositories.



\### Core Tech Stack

\- Python

\- GitHub REST / GraphQL API

\- Vector Databases

\- LLM Orchestration (n8n / LangChain)



\### System Architecture \& Logic

\- Footprint Extraction: Pulls repository commit histories, starred projects, and language distribution variables directly from target user profiles via the GitHub API.

\- Vector Alignment: Converts raw developer profile properties into dynamic vector embeddings representing specific domains of technical interest.

\- Agentic Execution Loop: Runs recursive web-search and indexing tasks to match the user's vector signature against open-source codebases, producing ranked suggestions containing explanatory reasoning chains.



\---



\# Customer Retention Engine



\### Overview

An enterprise-grade churn prediction engine leveraging statistical analysis and custom machine learning classifiers to isolate risk vectors in customer subscription databases.



\### Core Tech Stack

\- Python

\- Pandas / NumPy

\- Scikit-Learn / XGBoost

\- FastAPI



\### System Architecture \& Logic

\- Pipeline Operations: Cleans historical client engagement data, scales numeric features, and structures time-series activity vectors.

\- Predictive Analytics: Trains high-performance classification ensembles (XGBoost, Random Forests) calibrated on structural class imbalances.

\- Business Logic Layer: Translates feature importance arrays into clear metrics, exporting programmatic actionable flags to connected customer support channels via an API framework.



\---



\# Loan Predict AI



\### Overview

A secure, regulatory-compliant financial risk assessment and loan risk scoring model built to evaluate credit risk profiling via demographic data points.



\### Core Tech Stack

\- Python

\- Scikit-Learn

\- FastAPI / Flask

\- Streamlit



\### System Architecture \& Logic

\- Data Preparation: Corrects null parameters, handles variable encodings across arbitrary credit score profiles, and scales financial assets criteria.

\- Risk Scoring: Computes real-time default probability indices using robust logistic models or gradient-boosted decision bounds.

\- UI Sandbox: Employs a testing dashboard framework enabling risk officers to toggle underlying asset figures and immediately check predictive confidence scoring intervals.



\---



\# Simple Multi-Agent Chat System



\### Overview

A highly parallel, conversational multi-agent mesh architecture wherein separate specialized AI agents negotiate, divide tasks, and collectively resolve architectural engineering problems.



\### Core Tech Stack

\- Python / TypeScript

\- OpenAI API / Gemini API

\- Agentic Mesh Networks (CrewAI / AutoGen)



\### System Architecture \& Logic

\- Role Orchestration: Spawns independent AI actor profiles initialized with separate identities (e.g., Code Architect, Security Reviewer, Test Engineer).

\- Group Consensus Logic: Runs messaging state buses allowing actors to securely hand off conversational payloads, critique colleague outputs, and execute step-by-step corrections.

\- Output Generation: Compiles structural multi-layered technical documentation or codebase frameworks reviewed, debugged, and signed off autonomously by the cluster agents.

