# The Gulf Edit — Monorepo

## Project Structure
```
mystore/
├── backend/     ← Express REST API → Railway
└── frontend/    ← Next.js 14 App Router → Vercel
```

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:5000
npm run seed           # seed 12 sample products
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

## Deployment
- **Backend** → Railway (Dockerfile included)
- **Frontend** → Vercel (connect GitHub repo)
