# 🥗 NutriScan Buddy
 
**Know what you eat, before you eat it.**
 
NutriScan Buddy is a full-stack, AI-powered nutrition assistant that scans food nutrition labels, flags junk/processed foods with a personalized risk level based on your medical conditions, and recommends healthier alternatives when you're craving something unhealthy.

---
## 🌐 Live Demo

🔗 **[Try NutriScan Buddy](https://nurtiscan-buddy2.onrender.com)**
 
## ✨ Features
 
- 🔐 **Secure authentication** — signup/login with httpOnly JWT cookies
- 🩺 **Health profile onboarding** — users select medical conditions, allergies, and dietary preferences
- 📷 **AI-powered label scanning** — upload a nutrition label photo, Gemini Vision reads it directly (no fragile OCR)
- ⚠️ **Personalized risk analysis** — every food is scored Low / Moderate / High risk based on *your* stored medical conditions, not a generic scale
- 🍫 **Cravings recommender** — tell it what you're craving, get 3 healthier AI-suggested alternatives
- 📊 **Interactive dashboard** — animated nutrient rings, macro breakdown donut chart, weekly calorie trend
- 🕘 **Food history** — full log with risk-level filtering and delete
- 🌗 **Dark / light mode** — persisted across sessions
- 📱 **Mobile-first responsive design** — bottom nav on mobile, sidebar on desktop
---
 
## 🧱 Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, shadcn-style components, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT via httpOnly cookies, bcrypt password hashing |
| AI | Google Gemini API (`gemini-2.5-flash`) — text analysis + vision-based label scanning |
| Deployment | Render (Web Service + Static Site) |
 
---
 
## 🏗️ Architecture
 
```
Frontend (React/Vite)  ──HTTPS + cookies──>  Backend (Express)  ──>  MongoDB Atlas
                                                     │
                                                     └──>  Gemini API (analysis, cravings, label scan)
```
 
The frontend never talks to Gemini directly — every AI call is proxied through the backend, which also injects the user's real medical profile from the database so results are personalized and can't be spoofed by the client.
 
---
 
## 📁 Project Structure
 
```
NutriScan-Buddy/
├── Backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/            # User, FoodEntry (Mongoose schemas)
│   ├── middleware/         # JWT auth middleware
│   ├── controllers/        # auth, food, ai logic
│   ├── routes/              # auth, food, ai route definitions
│   └── .env.example
└── Frontend/
    └── nutriscan-frontend/
        ├── src/
        │   ├── components/  # UI primitives + feature components
        │   ├── context/       # Auth & Theme context
        │   ├── lib/            # API client, OCR/image helpers
        │   ├── pages/          # Login, Signup, Onboarding, Dashboard, Scan, Cravings, History
        │   └── App.jsx
        └── .env.example
```
 
---
 
## 🔌 API Reference
 
All routes are prefixed with `/api`. Auth routes use httpOnly cookies — no manual token handling needed on the client.
 
| Method | Endpoint | Auth required | Description |
|---|---|:---:|---|
| GET | `/health` | ❌ | Health check |
| POST | `/auth/signup` | ❌ | Create account |
| POST | `/auth/login` | ❌ | Log in |
| POST | `/auth/logout` | ✅ | Log out, clears cookie |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/health-profile` | ✅ | Save medical conditions / allergies / preferences |
| GET | `/food` | ✅ | List all food entries |
| POST | `/food` | ✅ | Create a food entry |
| DELETE | `/food/:id` | ✅ | Delete a food entry |
| GET | `/food/stats` | ✅ | Aggregated risk stats |
| POST | `/ai/analyze` | ✅ | AI risk analysis for a food, personalized to user profile |
| POST | `/ai/craving` | ✅ | AI-suggested alternatives to a craving |
| POST | `/ai/scan-label` | ✅ | Vision-based nutrition label scan |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine)
- A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))
### 1. Clone the repo
 
```bash
git clone https://github.com/<your-username>/nutriscan-buddy.git
cd nutriscan-buddy
```
 
### 2. Backend setup
 
```bash
cd Backend
npm install
cp .env.example .env
```
 
Fill in `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret
GEMINI_API_KEY=your_gemini_api_key
```
 
Run it:
```bash
npm run dev
```
Confirm it's running: visit `http://localhost:5000/api/health`.
 
### 3. Frontend setup
 
```bash
cd ../Frontend/nutriscan-frontend
npm install
cp .env.example .env
```
 
Fill in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
 
Run it:
```bash
npm run dev
```
 
Open `http://localhost:5173` in your browser.
 
---
