# Error 500 — Internal Server Bar

Stack: React + Vite · Node.js + Express · Supabase (PostgreSQL)
Patrón: MVC + Factory Method + Abstract Factory + Builder

## Setup

### Server
```bash
cd server
cp .env.example .env   # llenar con credenciales de Supabase
npm install
node index.js
```

### Client
```bash
cd client
cp .env.example .env   # llenar con credenciales de Supabase
npm install
npm run dev
```

## Estructura
- `/server` — Node.js API REST (MVC)
- `/client` — React + Vite (MVC-like)
