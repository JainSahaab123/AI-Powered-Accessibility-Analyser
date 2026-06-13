# ♿ Accessibility Analyser

> AI-powered WCAG compliance scanner that finds accessibility violations on any website and generates exact code fixes — so developers don't just know what's broken, they know how to fix it.

---

## The Problem

Over **1.3 billion people** globally live with some form of disability. Most websites are built by developers who never consider how a blind person, a color-blind person, or someone who can't use a mouse would experience their product.

Tools like Axe-core can detect accessibility problems, but they only tell you **what** is broken, not **how** to fix it. Developers who aren't accessibility experts are still left figuring out the solution themselves.

---

## The Solution

Accessibility Analyser combines industry-standard accessibility scanning with AI to provide developers with:

* Every accessibility violation on their website
* The exact broken code
* The exact fixed code
* Plain-English explanations of where to find the issue
* An AI chatbot for asking follow-up questions about violations

---

## Live Demo

🔗 **[demo](https://ai-powered-accessibility-analyser.vercel.app/)**

---

## Features

### Core Scanning

* Scans any public website URL for WCAG 2.1 accessibility violations
* Uses Axe-core — the same accessibility engine powering Google Lighthouse
* Headless Chrome via Puppeteer for accurate full-page scanning
* Handles websites with 50+ violations through batch loading

### AI-Powered Fixes

* Groq AI (Llama 3.3 70B) generates exact code fixes for every violation
* Displays **BROKEN** vs **FIXED** code side by side
* Provides plain-English "Where to Find It" guidance
* Includes a contextual AI chatbot for each violation

### Smart Reporting

* Accessibility score out of 100 using weighted severity scoring
* Violations categorized by Critical, Serious, Moderate, and Minor
* Loads the first 10 violations instantly and fetches more on demand
* Saves reports to MongoDB for future reference

### Developer Experience

* 7-layer URL validation with human-readable error messages
* Animated progress loader with completion percentage
* One-click copy-to-clipboard for generated fixes
* Direct links to Deque University documentation

---

## Tech Stack

| Layer                 | Technology                            |
| --------------------- | ------------------------------------- |
| Frontend              | React.js + Vite                       |
| Styling               | Tailwind CSS + Inline Styles          |
| Backend               | Node.js + Express                     |
| Database              | MongoDB Atlas                         |
| Accessibility Scanner | Axe-core + Puppeteer                  |
| AI Code Fixes         | Groq API (Llama 3.3 70B)              |
| AI Chat               | Groq API (Llama 3.3 70B)              |
| Deployment            | Vercel (Frontend) + Railway (Backend) |

---

## How It Works

```text
User enters URL
      ↓
Puppeteer opens headless Chrome and loads the page
      ↓
Axe-core scans every element for WCAG violations
      ↓
All violations are saved to MongoDB
      ↓
First 10 violations sent to Groq AI
      ↓
AI generates code fixes and location guidance
      ↓
Frontend displays score, severity counts, and fixes
      ↓
User can load more violations in batches of 10
      ↓
User can chat with AI about specific violations
```

---

## Getting Started

### Prerequisites

* Node.js v18+
* MongoDB Atlas account
* Groq API key

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JainSahaab123/AI-Powered-Accessibility-Analyser.git
cd accessibility-analyser
```

#### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

#### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

#### 4. Run the Project

Backend:

```bash
cd backend
node server.js
```

Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Project Structure

```text
accessibility-analyser/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── analyse.js
│   ├── controllers/
│   │   └── analyseController.js
│   ├── services/
│   │   ├── axeService.js
│   │   └── aiService.js
│   └── models/
│       └── Report.js
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── URLInput.jsx
        │   ├── Report.jsx
        │   ├── Violation.jsx
        │   └── CodeFix.jsx
```

---

## Screenshots

### Home Page

Add screenshot here.

### Scan Results

Add screenshot here.

### AI Fix Suggestions

Add screenshot here.

---

## Known Limitations

* Some websites (government, banking, and highly protected platforms) may block automated browsers. This is expected behavior and not a bug.
* Axe-core detects automatically measurable accessibility violations. Issues requiring human judgment (such as the quality of alternative text) may not be detected.
* Scan times increase with website complexity. Large websites may take 30–60 seconds to analyze, especially when deployed on free-tier hosting services.
* Sometimes Geological restricted websites are scanned or vice-versa.

---
