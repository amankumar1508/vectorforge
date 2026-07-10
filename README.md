# Ditton | AI Digital Clone Workspace 🤖

> **Build your own AI-powered digital clone that learns your texting style from your WhatsApp chat history and generates replies that sound like you.**

---

## 📌 Overview

**Ditton** is an AI-powered digital clone workspace that creates a personalized chat assistant by analyzing a user's writing patterns from exported WhatsApp conversations. 

Rather than generating generic AI responses, Ditton mimics the user's natural communication habits—including tone, vocabulary, emojis, reply speed, average message length, punctuation, and common phrases. It is designed to assist busy professionals, creators, and teams in drafting replies that feel authentic and uniquely theirs.

---

## ✨ Features

* 📂 **Upload exported WhatsApp chats** (`.txt` formats) through a secure endpoint.
* 🧹 **Style Analysis visualizer** showing tone, punctuation habits, and message lengths.
* 💬 **Interactive Chat Simulator** with pre-configured personas (Mom, Sarah the Design Lead, Alex, and My Digital Clone).
* 🧠 **Style Profile dashboard** displaying real-time metrics (Signature Words, Response Speed, Average Msg Length).
* 🎨 **Premium Glassmorphic Theme**: A modern Zinc/Slate aesthetic with Emerald accents.
* 🌓 **Responsive Dark & Light modes** matching modern OS-level preferences.
* 📱 **Drawer Transitions**: Optimized dual-pane layouts for desktop with slide-out details panels on tablet/mobile screens.
* 🔒 **Local & Private-first**: Designed for local LLM integration (e.g., Llama 3.2 via Ollama) to keep chat data completely secure.

---

## 🏗️ System Workflow

```text
User Uploads WhatsApp Chat (.txt)
            │
            ▼
      Express Backend
            │
            ▼
   Multer File Storage
            │
            ▼
 Style Parameter Compiler
            │
            ▼
 Prompt Builder & Local LLM (Llama 3.2 via Ollama)
            │
            ▼
 Ditton Workspace Chat Simulator
```

---

## 🛠️ Tech Stack

### Frontend
* **React.js 19**
* **Vite**
* **Tailwind CSS v4** (Modern CSS-first framework)
* **Lucide React** (Vector icons)

### Backend
* **Node.js** & **Express**
* **Multer** (File upload handling)
* **Cors** & **Dotenv**

### Local AI Integration
* **Ollama** (Running Llama 3.2 locally)

---

## 📂 Project Structure

```text
vectorforge/
├── backend/
│   ├── config/          # Multer configurations for file uploads
│   ├── controllers/     # Upload controllers & metadata loggers
│   ├── routes/          # Express API route configurations
│   ├── middleware/      # Express error boundary and cors rules
│   ├── data/            # Local data directories
│   ├── logs/            # Server runtime logging
│   └── server.js        # Backend listener entry point
│
└── frontend/
    ├── index.html       # Vite template and HTML entry point
    ├── package.json     # Frontend dependencies and run scripts
    ├── src/
    │   ├── App.jsx      # Root component, layout, and simulation logic
    │   ├── main.jsx     # React entry script
    │   ├── index.css    # Tailwind CSS and global style overrides
    │   ├── mockData.js  # Style profiles and initial message histories
    │   └── components/
    │       ├── ChatWindow.jsx    # Messaging panel & input controls
    │       ├── Sidebar.jsx       # Chat threads & list view
    │       └── StyleDashboard.jsx # Visualizer for the clone's style markers
```

---

## ⚙️ Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Ollama](https://ollama.ai/) (optional, for running local models)

### 1. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
The backend server runs by default on `http://localhost:5000`.

### 2. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
Open the printed URL (typically `http://localhost:5173`) in your browser.

---

## 📈 Style Markers Analyzed

The workspace parses your files to calculate:
* **Average Response Speed**: Simulates natural messaging latency.
* **Emoji Usage Frequency**: Identifies your favorite, signature emojis.
* **Signature Vocabulary**: Detects key words/phrases you repeat frequently.
* **Message Length Patterns**: Measures short-to-medium vs long paragraph style habits.
* **Punctuation & Capitalization rules**: Matches sentence casing and formatting ticks.

---

## 💬 Chat Simulation Example

### Input Message
```text
Bro, free tonight?
```

### Generated Ditton Clone Reply
```text
literally born ready 🚀 let's check the logs 😂
```

---

## 🔒 Privacy & Local-First Philosophy

* Ditton is built with a local-first design.
* Uploaded logs are stored and processed locally.
* Supports local LLM inference via Ollama, preventing your sensitive messages from leaking to third-party APIs.
* Designed for educational, testing, and workspace assistance.

---

## 📄 License

Developed for educational and hackathon purposes.

⭐ *If you like Ditton, consider giving it a star on GitHub!*
