# CV & Interview Coach 🎯

AI-powered web application giúp người tìm việc **phân tích CV**, **so khớp CV với JD**, và **luyện tập phỏng vấn giả lập**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS |
| Backend | Express.js + TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini API (Free tier) |
| Package Manager | pnpm (workspace) |

## Project Structure

```
├── client/          # Frontend (@cv-coach/client)
├── server/          # Backend (@cv-coach/server)
├── shared/          # Shared TypeScript types (@cv-coach/shared)
├── docs/            # Documentation & SQL schema
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 9 — cài bằng `npm install -g pnpm`
- Supabase account (free) — [supabase.com](https://supabase.com)
- Google AI API key (free) — [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# 1. Cài tất cả dependencies (client + server + shared)
pnpm install

# 2. Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Điền API keys vào các file .env

# 3. Setup database
# Vào Supabase Dashboard → SQL Editor → chạy docs/supabase-schema.sql

# 4. Khởi động dev server
pnpm dev
```

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start cả client & server cùng lúc |
| `pnpm dev:client` | Chỉ chạy frontend (port 5173) |
| `pnpm dev:server` | Chỉ chạy backend (port 3001) |
| `pnpm build` | Build cả client & server |
| `pnpm lint` | Lint cả client & server |

> ⚠️ **Lưu ý**: Dùng `pnpm` thay vì `npm`. Thêm package mới bằng `pnpm --filter @cv-coach/client add <pkg>` hoặc `pnpm --filter @cv-coach/server add <pkg>`.

## Features

- 📄 **CV Analysis** — Upload CV, nhận phân tích AI với ATS score
- 🎯 **JD Matching** — So khớp CV với mô tả công việc
- 🎤 **Mock Interview** — Luyện phỏng vấn với câu hỏi AI + phân tích STAR
- 📊 **Dashboard** — Theo dõi tiến độ theo thời gian

## License

MIT
