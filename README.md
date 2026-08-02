# DropHouse

DropHouse is a small full‑stack sample project that demonstrates a React + Vite frontend and a Node.js backend (Prisma used for the database). This repository is laid out as a two-part monorepo with `frontend/` and `backend/` folders so you can develop each side independently.

> NOTE: This README was added/expanded to provide clear setup and development instructions. Update the environment variables and commands below to match your local/dev environment.

## Table of contents

- [Features](#features)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Database](#database)
- [Running the app](#running-the-app)
- [Building for production](#building-for-production)
- [Environment variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- React + Vite frontend
- Node.js backend (Express/Koa/Fastify — check backend code) with Prisma for database schema & migrations
- Separated frontend and backend workspaces for independent development

## Repository structure

- `frontend/` — React app (Vite) and UI code
- `backend/` — Node.js server, Prisma schema, and API code
- `README.md` — this file

## Prerequisites

- Node.js (recommend v18+)
- npm or yarn
- A database supported by Prisma (SQLite, PostgreSQL, MySQL, etc.) if you plan to run the backend with a real DB

## Local setup

Clone the repository and install dependencies in each package:

```bash
git clone https://github.com/simrahmad/DropHouseTest.git
cd DropHouseTest
```

### Backend

1. Change into the backend folder and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` in `backend/` with your env vars (see [Environment variables](#environment-variables)).

3. If the project uses Prisma, push the schema or run migrations (example commands):

```bash
# push schema to DB (no migrations)
npm run db:push

# open Prisma Studio (UI)
npm run db:studio
```

4. Start the backend in development mode:

```bash
npm run dev
# or
npm start
```

> Check `backend/package.json` for the exact script names and adapt commands if needed.

### Frontend

1. Change into the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

2. Create a `.env` file for any frontend environment variables (see [Environment variables](#environment-variables)).

3. Start the dev server:

```bash
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173) in your browser.

## Database

This project appears to use Prisma (see backend scripts). Typical workflow:

- Configure `DATABASE_URL` in `backend/.env`
- Use `npx prisma migrate dev` to create migrations (if migrations are used)
- Or use `npx prisma db push` to push the schema without migrations
- Use `npx prisma studio` to inspect data in a web UI

## Running the app

1. Start the backend (see backend section)
2. Start the frontend
3. Visit the frontend URL. The frontend will call the backend API — if ports differ, ensure the frontend is configured to point to the backend base URL.

## Building for production

- Frontend: `cd frontend && npm run build` (then deploy the `dist/` directory to a static host)
- Backend: build or run the Node.js server in production (example: `NODE_ENV=production node src/index.js`)

Adjust deploy steps depending on your hosting provider.

## Environment variables

Place the environment variables in `backend/.env` and `frontend/.env` as appropriate. Common variables you may need:

- DATABASE_URL (backend) — e.g. `postgresql://user:pass@localhost:5432/dbname`
- PORT (backend) — server port, e.g. `4000`
- Any auth provider keys (Clerk, Auth0, Firebase) used by the frontend or backend

The frontend may require a publishable key from an authentication provider (for example, Clerk's frontend publishable key). Prefix client env vars with `VITE_` if using Vite (e.g. `VITE_CLERK_PUBLISHABLE_KEY`).

## Contributing

Contributions are welcome — open an issue or submit a pull request. Please include a clear description of changes and any setup steps required to test them.


