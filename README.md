# CV & Interview Coach 🎯

AI-powered web application giúp người tìm việc **phân tích CV**, **so khớp CV với JD**, và **luyện tập phỏng vấn giả lập**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS |
| Backend | Express.js + TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini API (Free tier) |

## Project Structure

```
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express.js)
├── shared/          # Shared TypeScript types
└── docs/            # Documentation & ideas
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Supabase account (free)
- Google AI API key (free)

### Installation

```bash
# Install all dependencies (client + server)
npm run install:all

# Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your keys

# Start development
npm run dev
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client & server in dev mode |
| `npm run dev:client` | Start frontend only (port 5173) |
| `npm run dev:server` | Start backend only (port 3001) |
| `npm run build` | Build both client & server |
| `npm run install:all` | Install deps for client + server |

## Features

- 📄 **CV Analysis** — Upload CV, get AI-powered feedback with ATS score
- 🎯 **JD Matching** — Compare your CV against job descriptions
- 🎤 **Mock Interview** — Practice with AI-generated questions & STAR feedback
- 📊 **Dashboard** — Track your progress over time

## License

MIT
