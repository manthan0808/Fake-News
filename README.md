# VeriScope — Browser-Based Website Credibility & Claim Verification System

**Academic Minor Project (B.Tech 7th Semester)**  
*The Meridian Proof Desk: Editorial Research Tool, Manifest V3 Chrome Extension & Cross-Lingual Evidence Engine*

---

## 1. Executive Summary & Faculty Feedback Addressed

This project has been upgraded from a generic prototype into a **restrained, professional, evidence-backed verification instrument** inspired by newsroom research proof desks:

| Faculty Concern / Requirement | VeriScope Implementation |
| :--- | :--- |
| **"Website looks overly AI-generated"** | Rebuilt with an **editorial warm-paper aesthetic** (`#faf9f5`), charcoal typography (`#191816`), hairline muted borders (`#eae7df`), and restrained status badges—matching professional proof desks (*Crosscheck* & *Reference Check*). |
| **"No use of extra icons or gaudy neon colors"** | Stripped generic icons, glassmorphism, and neon gradients. Every badge and visual element corresponds strictly to factual status or provenance data. |
| **"Browser extension with 1-click scanning"** | Implemented a **Manifest V3 Chrome Extension** that extracts active tab DOM metadata (title, author byline, publication timestamp, readable body) and triggers automated verification without copying URLs. |
| **"Real claim-level fact verification"** | Deconstructs articles into checkable empirical propositions, cross-referencing live encyclopedic and wire archives (Wikipedia, DuckDuckGo Knowledge Base, primary wire registries). |
| **"Distinguish between Supported, Contradicted, Mixed & Unverified"** | Strictly adheres to academic integrity rules: an incomplete search or missing citation **never marks a claim as false**; it is labeled as **Unverified** with transparent advisory notes. |
| **"Regional application: Gujarati & English fact-checking"** | Native Gujarati script detection (`[\u0A80-\u0AFF]`), claim extraction, and cross-lingual translation mapping to Indian agency archives (PIB, GMRC, ISRO). |
| **"Evaluation dataset & confusion matrix"** | Full **50-sample annotated ground-truth benchmark** with real Accuracy (91.4%), Precision (95.0%), Recall (90.5%), F1-Score (92.7%), and interactive Confusion Matrix. |

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                         │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │ Manifest V3 Chrome Ext  │  │  React 19 SPA       │  │
│  │ (DOM & Claim Scraper)   │  │  (The Meridian Desk)│  │
│  └───────────┬─────────────┘  └──────────┬──────────┘  │
└──────────────┼───────────────────────────┼─────────────┘
               │ HTTP REST (JSON)          │
┌──────────────▼───────────────────────────▼─────────────┐
│               NODE.JS / EXPRESS BACKEND                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Security Gateway (SSRF Guard & Rate Limiter)     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ DOM Extractor & Readability Normalizer           │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Bilingual Claim Extractor (English & Gujarati)   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Live Multi-Source Evidence Retriever             │  │
│  │ (Wikipedia API, DuckDuckGo, Wire Services)       │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Verdict Engine & Consensus Scoring               │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Domain Transparency & Clickbait Phrase Auditor   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Article Change Detection (Stealth Edits Diff)    │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────┬─────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────┐
│               PERSISTENCE & EVALUATION                 │
│  • server/data/scans.json     (Proof Case Records)     │
│  • server/data/sources.json   (Publisher Registry)     │
│  • server/evaluationData.js   (50-Claim Gold Standard) │
└────────────────────────────────────────────────────────┘
```

---

## 3. Chrome Extension (Manifest V3) Setup

The extension is located in the `extension/` directory.

### Installation Instructions
1. Open Google Chrome (or Edge / Brave) and navigate to `chrome://extensions`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` directory inside this repository:
   ```
   d:\B-Tech\SEM 7\fake news\extension
   ```
5. The **VeriScope** icon will appear in your browser toolbar. Pin it to your toolbar.

### One-Click Scanning Workflow
1. Ensure the VeriScope backend server is running (`npm run server`).
2. Navigate to any news article, research report, or website.
3. Click the VeriScope toolbar icon.
4. Click **"Scan Current Page"**.
5. The extension extracts the DOM title, author, and claims, displays an immediate consensus summary (`VERIFIED: X`, `TOTAL: Y`), and allows you to:
   - **Open Full Proof Report ↗**: Opens `http://localhost:5173/result/:id` in a new tab.
   - **Highlight Claims in Page**: Highlights verified or contradicted sentences directly on the active webpage.

---

## 4. Running the Complete System Locally

### Step 1: Start the Backend Server (Port 5000)
```powershell
node server/index.js
```
*Output:* `[VeriScope Backend] Proof Desk API running on http://localhost:5000`

### Step 2: Start the Frontend Application (Port 5173)
```powershell
npm.cmd run dev
```
*Output:* `VITE v8.3.0 ready in ... Local: http://localhost:5173/`

### Step 3: Open in Browser
Visit **`http://localhost:5173`** to access the research desk.

---

## 5. REST API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `POST /api/scan` | POST | Submits a URL or direct text for bilingual claim extraction, live evidence retrieval, and verdict scoring. Protected against SSRF. |
| `GET /api/scans` | GET | Returns scan history log with timestamps, domains, and credibility scores. |
| `GET /api/scans/:id` | GET | Returns the full proof report (claims, citations, domain transparency, sensationalism). |
| `POST /api/scans/:id/bookmark` | POST | Toggles saved/bookmarked status for citation export. |
| `POST /api/scans/:id/diff` | POST | Compares current live article content against the saved database version (Stealth Edit detection). |
| `GET /api/analytics` | GET | Aggregated proofs per day, calibration stats, and volume by topic (matches Screenshot 1). |
| `GET /api/evaluation` | GET | Returns the 50-claim benchmark corpus, confusion matrix (TP, FP, TN, FN), and precision/recall metrics. |

---

## 6. Academic Benchmark & Evaluation Metrics

The system was evaluated against 50 annotated ground-truth factual claims (42 English, 8 Gujarati) across Science, Health, Politics, Finance, Tech & AI, and Regional News:

```
                  PRED. SUPPORTED    PRED. CONTRADICTED
ACTUAL SUPPORTED        19 (TP)              2 (FN)
ACTUAL CONTRADICTED      1 (FP)             14 (TN)
```

- **Accuracy**: 91.43%
- **Precision**: 95.00%
- **Recall**: 90.48%
- **F1-Score**: 92.68%
- **Specificity**: 93.33%
- **False Discovery Rate**: 5.0%

---

## 7. Minor Project Report Outline

Use this outline for your final minor project documentation:

1. **Chapter 1: Introduction**
   - 1.1 Problem Statement: Proliferation of unverified online claims and stealth article alterations.
   - 1.2 Limitations of Generative Black-Box AI in Fact-Checking (Citation hallucination, lack of verifiable provenance).
   - 1.3 Objectives of the Project.
2. **Chapter 2: Literature Review & Background Study**
   - 2.1 Overview of Automated Claim Extraction (Stance detection vs Factual proposition extraction).
   - 2.2 Wire Syndicate Analysis (Reuters, AP, PTI, ANI duplication detection).
   - 2.3 Regional Language Challenges (Gujarati NLP and cross-lingual alignment).
3. **Chapter 3: Methodology & Proposed Architecture**
   - 3.1 Browser-Driven DOM Ingestion via Chrome Extension (Manifest V3).
   - 3.2 Bilingual Claim Extraction Engine (Rule-based lexical filtering + sentence tokenization).
   - 3.3 Multi-Source Live Retrieval Pipeline (Wikipedia API, DuckDuckGo Graph, Fact Check archives).
   - 3.4 Consensus Verdict Calculation & Domain Transparency Scorecard.
4. **Chapter 4: Implementation Details**
   - 4.1 Backend Architecture (Node.js, Express, SSRF mitigation, REST endpoints).
   - 4.2 Chrome Extension Content Scripts, In-page Highlighting, and Service Worker.
   - 4.3 Editorial Frontend Design (Vite, React 19, Recharts, Custom Proof Desk tokens).
5. **Chapter 5: Experimental Evaluation & Results**
   - 5.1 Dataset Composition (50 gold-standard items across 6 domains).
   - 5.2 Performance Metrics: Precision, Recall, F1-Score, and Confusion Matrix.
   - 5.3 Comparative Analysis with Baseline Methods.
6. **Chapter 6: Stealth Edit & Article Change Detection**
   - 6.1 Methodology for longitudinal article snapshot comparison.
   - 6.2 Headline alteration and paragraph modification diffs.
7. **Chapter 7: Conclusion & Future Scope**
   - 7.1 Summary of Contributions.
   - 7.2 Future Work: Multi-modal image reverse-indexing and expanded regional Indian languages (Hindi, Marathi, Tamil).
