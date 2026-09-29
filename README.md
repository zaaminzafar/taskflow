# TaskFlow — Full-Stack Kanban Task Tracker

A Trello-style task board: sign up, log in, add tasks, and drag them between
To Do / In Progress / Done columns. Built with React (frontend) and
Node.js + Express + MySQL (backend) — the same stack you already know from
your internship, plus React on top.

## Project Structure

```
taskflow/
  backend/     Node.js + Express + Sequelize + MySQL API
  frontend/    React app (Vite)
```

## Prerequisites

- Node.js installed (v18+ recommended)
- MySQL installed and running locally

## Step 1 — Set up the database

Open a MySQL shell and create the database (the tables themselves are
auto-created by Sequelize when the server first starts):

```sql
CREATE DATABASE taskflow;
```

## Step 2 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your real MySQL password and a random JWT secret
(any long random string works). Then start the server:

```bash
npm run dev
```

You should see:
```
Database connected and synced
Server running on http://localhost:5000
```

Test it's alive by visiting `http://localhost:5000` in your browser — you
should see `{"message":"TaskFlow API is running"}`.

### Test the API in Postman before touching the frontend

This is the same workflow you already used at your internship — confirm the
backend works standalone first:

1. `POST http://localhost:5000/api/auth/signup` with body:
   ```json
   { "name": "Test User", "email": "test@example.com", "password": "password123" }
   ```
   You should get back a `token` and `user` object.
2. Copy the `token` value.
3. `POST http://localhost:5000/api/boards` with header
   `Authorization: Bearer <your token>` and body `{ "title": "My Board" }`.
4. `POST http://localhost:5000/api/tasks` with the same auth header and body:
   ```json
   { "board_id": 1, "title": "My first task", "description": "Testing it out" }
   ```

If all of that works, your backend is solid — move on to the frontend.

## Step 3 — Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) — open it in
your browser. You should see the login/signup page.

## Step 4 — Use the app

1. Sign up for a new account.
2. You'll land on your board (created automatically on first login).
3. Click "+ New Task" to add tasks.
4. Drag cards between columns — the status updates in the database
   automatically.

## Step 5 — Deploy it (for your resume/portfolio link)

- **Backend:** deploy to Railway (you've done this before) — set the same
  environment variables from your `.env` file in Railway's dashboard.
- **Frontend:** deploy to Vercel or Netlify (both have free tiers, connect
  directly to a GitHub repo). Update `baseURL` in
  `frontend/src/api/axiosConfig.js` to point to your deployed backend URL
  instead of `localhost:5000`.

## What each backend file does

| File | Purpose |
|---|---|
| `src/server.js` | Starts Express, connects to MySQL, mounts all routes |
| `src/config/db.js` | Sequelize database connection setup |
| `src/models/*.js` | Table definitions (User, Board, Task) |
| `src/models/index.js` | Defines relationships between tables |
| `src/middleware/auth.js` | Verifies the JWT on protected routes |
| `src/controllers/*.js` | The actual logic for each API endpoint |
| `src/routes/*.js` | Maps URLs (e.g. `/api/tasks`) to controller functions |

## What each frontend file does

| File | Purpose |
|---|---|
| `src/App.jsx` | Top-level component — switches between login/signup/board |
| `src/components/Login.jsx` / `Signup.jsx` | Auth forms |
| `src/components/BoardPage.jsx` | Main app logic — fetches tasks, handles drag-and-drop |
| `src/components/Column.jsx` | One column (droppable area) |
| `src/components/TaskCard.jsx` | One task card (draggable) |
| `src/components/TaskModal.jsx` | Popup form for creating a new task |
| `src/api/*.js` | Functions that call your backend API |

## Suggested next steps once this works

- Add a "due soon" visual highlight for tasks close to their due date
- Add the ability to edit an existing task (the backend route already
  supports it — `PUT /api/tasks/:id` — just wire up a form in the frontend)
- Add multiple boards per user
- Write the actual README for your GitHub repo (see the project plan doc
  for a checklist) and include a screen recording/GIF of the drag-and-drop
