# ♿ Accessibility Analyser

> AI-powered WCAG compliance scanner that finds accessibility violations on any website and generates exact code fixes — so developers don't just know what's broken, they know how to fix it.

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-v22-brightgreen)
![React](https://img.shields.io/badge/react-vite-blue)
![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange)

---

## The Problem

Over **1.3 billion people** globally live with some form of disability. Most websites are built by developers who never consider how a blind person, a colorblind person, or someone who can't use a mouse would experience their product.

Tools like Axe-core can detect accessibility problems — but they only tell you **what** is broken, not **how** to fix it. A developer who isn't an accessibility expert is still stuck.

---

## The Solution

Accessibility Analyser combines industry-standard scanning with AI to give developers:

- Every accessibility violation on their site
- The exact broken code
- The exact fixed code
- A plain English explanation of where to find it
- An AI chatbot to ask questions about each violation


---

## Live Demo

> 🔗 **[accessibility-analyser.vercel.app](https://accessibility-analyser.vercel.app)** 

---

## Features

**Core Scanning**
- Scans any public website URL for WCAG 2.1 violations
- Uses Axe-core — the same engine powering Google Lighthouse
- Headless Chrome via Puppeteer for accurate full-page scanning
- Handles sites with 50+ violations via batch loading

**AI-Powered Fixes**
- Groq AI (Llama 3.3 70B) generates exact code fixes for every violation
- Shows BROKEN vs FIXED code side by side
- Plain English "WHERE TO FIND IT" for each element
- Contextual AI chatbot per violation — ask follow-up questions

**Smart Reporting**
- Accessibility score out of 100 (weighted by severity)
- Violations categorised by Critical / Serious / Moderate / Minor
- Load More — first 10 violations load instantly, more on demand
- All reports saved to MongoDB for history

**Developer Experience**
- 7-layer URL validation with human-readable error messages
- Animated progress loader with percentage
- Copy fix to clipboard in one click
- Links to Deque University for deeper learning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS + inline styles |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Accessibility Scanner | Axe-core + Puppeteer |
| AI Code Fixes | Groq API (Llama 3.3 70B) |
| AI Chat | Groq API (Llama 3.3 70B) |
| PDF Generation | jsPDF |
| Deployment | Vercel (frontend) + Render (backend) |

---

## How It Works

```
User enters URL
      ↓
Puppeteer opens headless Chrome and loads the page
      ↓
Axe-core scans every element for WCAG violations
      ↓
All violations saved to MongoDB
      ↓
First 10 sent to Groq AI → generates code fixes + location
      ↓
Frontend displays score, severity counts, violations with fixes
      ↓
User can load more violations in batches of 10
      ↓
User can chat with AI about any specific violation

```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOURUSERNAME/accessibility-analyser.git
cd accessibility-analyser
```

**2. Set up the backend**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

**3. Set up the frontend**
```bash
cd ../frontend
npm install
```

**4. Run the project**

Terminal 1 — Backend:
```bash
cd backend
node server.js
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
accessibility-analyser/
├── backend/
│   ├── server.js                    # Express server entry point
│   ├── routes/
│   │   └── analyse.js               # API routes
│   ├── controllers/
│   │   └── analyseController.js     # Core business logic
│   ├── services/
│   │   ├── axeService.js            # Axe-core scanning logic
│   │   └── aiService.js             # Groq AI integration
│   └── models/
│       └── Report.js                # MongoDB schema
│
└── frontend/
    └── src/
        ├── App.jsx                  # Root component + state
        ├── components/
        │   ├── URLInput.jsx         # URL input + scan trigger
        │   ├── Report.jsx           # Full report display
        │   ├── Violation.jsx        # Single violation card
        │   └── CodeFix.jsx          # Broken/fixed code display
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyse` | Scan a URL and return first 10 violations with AI fixes |
| POST | `/api/analyse/more` | Load next batch of violations from saved report |
| POST | `/api/analyse/explain` | Chat with AI about a specific violation |

---

## Accessibility Score Formula

```
Start: 100 points

Deductions per violation:
  Critical  → -10 points
  Serious   → -7 points
  Moderate  → -4 points
  Minor     → -1 point

Final score = max(0, 100 - total deductions)
```

| Score | Label |
|---|---|
| 90-100 | Excellent |
| 70-89 | Good |
| 50-69 | Needs Work |
| 30-49 | Poor |
| 0-29 | Critical |

---

## Screenshots

> Add screenshots here after deployment

---

## Known Limitations

- Some websites (IRCTC, banking sites) block automated browsers — this is expected behaviour not a bug
- Axe-core detects automatically measurable violations — issues requiring human judgement (e.g. quality of alt text) are not detected
- Scan time increases with site complexity — large sites may take 30-60 seconds

---

## What I Learned

- Integrating Axe-core with Puppeteer for real-world accessibility scanning
- Designing effective AI prompts to generate structured code fixes
- Batch processing to handle rate limits while maintaining complete data
- Building contextual AI chat that maintains violation-specific context
- The real-world impact of accessibility on over 1.3 billion people globally



---

## Author

**Paras** — [GitHub](https://github.com/JainSahaab123) · [LinkedIn](www.linkedin.com/in/paras-jain312)

---

