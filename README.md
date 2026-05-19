# AI Career Navigator

A complete full-stack web application built to help users upload their resumes, choose a target role, analyze skill gaps, calculate an ATS score, and generate personalized learning roadmaps using the Gemini AI.

## Tech Stack 
- **Frontend**: React.js, Vite, Tailwind CSS (v4), React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB
- **AI**: Google Gemini API (`@google/genai` logic via direct fetch or SDK)
- **Resume Parsing**: Multer, PDF-Parse, Mammoth (for DOCX)

## Features
- **Authentication**: JWT-based secure signup and login.
- **Resume Upload**: Upload PDF or DOCX resumes.
- **Skill Gap Analysis**: AI extracts skills and compares them against target roles (e.g., SDE, AI/ML, DevOps, Data Science, etc.).
- **ATS Score**: Get a score out of 100 based on keyword matches and missing skills.
- **AI Roadmap Generator**: Auto-generate a week-by-week learning plan with recommended resources using Gemini API.
- **AI Career Chatbot**: A 24/7 dedicated chatbot interface built into the app for answering interview or career path questions.
- **Modern UI**: Dark-themed, responsive dashboard.

## Project Structure
```text
ai-career-navigator/
├── backend/
│   ├── controllers/      # Express logic for auth, resume, roadmap
│   ├── middleware/       # JWT Auth and Multer upload middleware
│   ├── models/           # Mongoose schemas (User, ResumeProfile, Roadmap)
│   ├── routes/           # API Endpoints
│   ├── services/         # AI Service wrapping Gemini API calls
│   ├── uploads/          # Temporary directory for uploaded resumes
│   ├── .env              # Backend environment variables
│   ├── server.js         # Entry point for backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance config
    │   ├── components/   # Navbar, generic UI components
    │   ├── context/      # AuthContext
    │   ├── pages/        # Home, Login, Register, Dashboard, ResumeUpload, Roadmap, Chatbot
    │   ├── App.jsx       # Main App routing
    │   └── main.jsx      # Entry point for React
    ├── .env              # Frontend environment variables
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation & Setup

### 1. Backend Setup
1. Open terminal and navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `backend/.env` with your actual MongoDB URI and Gemini API Key:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/career-navigator
   JWT_SECRET=supersecretjwtkey_for_career_navigator
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
- Open `http://localhost:5173` in your browser.
- Create an account.
- Navigate to "Resume Upload" and select your target role and upload a PDF.
- View your ATS score and skill gaps on the Dashboard.
- Click "Generate Roadmap" to let Gemini create your customized learning plan.
- Use the "AI Chatbot" for any career guidance.

## Deployment Guide
- **Backend (Render / Heroku / Fly.io)**: Set up the repository, point the build command to `npm install` and start command to `node server.js`. Ensure you add all `.env` variables to your hosting provider's dashboard.
- **Frontend (Vercel / Netlify / Cloudflare Pages)**: Point your hosting platform to the `frontend` folder. Use build command `npm run build` and output directory `dist`.
- **Database**: Use **MongoDB Atlas** for a free managed database cluster.

## License
MIT
