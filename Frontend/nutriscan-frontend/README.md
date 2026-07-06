# NutriScan Buddy — Frontend

A modern, mobile-first nutrition assistant UI built with React + Vite, Tailwind CSS, shadcn-style components, Framer Motion, and Recharts. Talks to the Node.js/Express + MongoDB backend built earlier in this project via cookie-based (httpOnly JWT) authentication.

## Stack

- **React 18 + Vite** — app shell & routing (`react-router-dom`)
- **Tailwind CSS** — design tokens for light/dark themes, green accent palette
- **shadcn-style primitives** — hand-written `Button`, `Card`, `Input`, `Badge`, etc. in `src/components/ui` (no CLI/network needed — you own the code)
- **Framer Motion** — page transitions, nav pill, animated nutrient rings
- **Recharts** — macro donut chart, weekly trend chart
- **Tesseract.js** — client-side OCR for nutrition label scanning

## Getting started

```bash
cd nutriscan-frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`. Make sure the backend is running at `http://localhost:5000` (or update `VITE_API_URL` in `.env`).

## Backend integration checklist

This frontend assumes the Express + MongoDB backend from earlier in this build, with these routes:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account, sets httpOnly cookie |
| POST | `/api/auth/login` | Log in, sets httpOnly cookie |
| POST | `/api/auth/logout` | Clears cookie |
| GET | `/api/auth/me` | Current user + `onboardingComplete` flag |
| PUT | `/api/auth/health-profile` | Save conditions/allergies/preferences |
| GET | `/api/food` | List food entries |
| POST | `/api/food` | Create food entry |
| DELETE | `/api/food/:id` | Delete entry |
| GET | `/api/food/stats` | Aggregated risk stats |
| POST | `/api/ai/analyze` | AI risk analysis for a food |
| POST | `/api/ai/craving` | AI craving alternatives |

**CORS on the backend must allow credentials from this frontend's origin**, e.g.:

```js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

And every frontend request already sends `credentials: 'include'` (see `src/lib/api.js`) — no manual token handling needed.

### One schema note

The current `FoodEntry.nutrients` model only defines `calories`, `sugar`, `sodium`, `protein`. This UI's macro chart and nutrient rings also expect `carbs` and `fats`. Add those two fields to `models/FoodEntry.js` on the backend for full accuracy — until then, those values will simply show as `0`.

## Folder structure

```
src/
  components/
    ui/                 Button, Card, Input, Badge, Chip, Skeleton, Spinner...
    AppShell.jsx         Top bar + sidebar (desktop) + bottom nav (mobile)
    AuthLayout.jsx        Shared layout for login/signup
    NutrientRings.jsx     Signature animated multi-ring gauge
    MacroDonutChart.jsx   Protein/Carbs/Fats donut (recharts)
    WeeklyTrendChart.jsx  7-day calorie trend (recharts)
    FoodCard.jsx           Entry row for dashboard/history
    AnalysisResult.jsx     AI food analysis card
    CravingResult.jsx      AI craving alternatives card
    UploadDropzone.jsx     Drag/drop or tap-to-upload image picker
    RiskBadge.jsx           Low/Moderate/High pill
    RouteGuards.jsx         ProtectedRoute / OnboardingRoute / PublicRoute
    ThemeToggle.jsx
  context/
    AuthContext.jsx        Session state, calls authApi
    ThemeContext.jsx        Light/dark, persisted to localStorage
  lib/
    api.js                  fetch wrapper (credentials: include) + endpoint groups
    ocr.js                   Tesseract.js text extraction + nutrient parsing
    utils.js                 cn() class merge helper
  pages/
    Login.jsx / Signup.jsx / Onboarding.jsx
    Dashboard.jsx / Scan.jsx / Cravings.jsx / History.jsx / NotFound.jsx
  App.jsx                    Route tree
  main.jsx                    Entry point (providers + router)
  index.css                    Design tokens, glass utilities
```

## Design system

- **Palette**: primary green `hsl(152 76% 36%)` (light) / `hsl(152 65% 45%)` (dark), risk colors for low/moderate/high, soft radial-gradient background.
- **Type**: Plus Jakarta Sans (display/headings), Inter (body), JetBrains Mono (numeric data — calories, macros).
- **Glassmorphism**: `.glass` / `.glass-card` utility classes in `index.css` — translucent, blurred, subtle border.
- **Signature element**: `NutrientRings` — an Apple Fitness-style triple ring (calories/protein/carbs) that animates in on load.
- **Motion**: shared layout nav pill, staggered card entrances, animated theme icon swap. Respects `prefers-reduced-motion`.

## Flows implemented

1. **Signup → Onboarding → Dashboard**: new users are routed through a 3-step chip-select onboarding (conditions, allergies, preferences) before reaching the app, matching the backend's `onboardingComplete` flag.
2. **Scan**: photo upload → optional client-side OCR (Tesseract.js) auto-fills nutrient fields → editable form → AI analysis (personalized using the stored medical profile server-side) → save to log.
3. **Cravings**: free-text or quick-pick craving → AI suggests 3 safer alternatives with reasoning, plus a note on the risk of the original craving.
4. **Dashboard**: today's rings, macro donut, 7-day trend (derived client-side from entries), recent scans.
5. **History**: full log with risk-level filtering and delete.

## Known limitations / next steps

- Weekly trend and today's totals are computed client-side from `/api/food` — for large histories, consider a dedicated backend aggregation endpoint (`/api/food/weekly`).
- OCR parsing uses regex heuristics on raw label text; accuracy depends on photo quality and label layout.
- No global toast system yet — errors are shown inline per form. Consider adding one if you expand the app.
