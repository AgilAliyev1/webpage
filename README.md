# Azerbaijan Volunteering & Internships Portal

Full-stack Node.js app for discovering and posting volunteering and internship opportunities in Azerbaijan. Users can register/login, search and filter experiences, and post new ones.

## Stack
- Node.js + Express
- SQLite (via better-sqlite3)
- JWT auth with httpOnly cookies
- Vanilla HTML/CSS/JS frontend served by Express

## Quick start

Prereqs: Node 18+.

```
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts
- `npm run dev`: start server with auto-reload
- `npm start`: start server

## Project Structure

```
.
├── server/
│  ├── index.js
│  ├── db.js
│  ├── auth.js
│  ├── experiences.js
│  └── utils.js
├── public/
│  ├── index.html
│  ├── login.html
│  ├── register.html
│  ├── styles.css
│  └── app.js
├── .env (optional)
└── README.md
```

## Environment
- `JWT_SECRET` (optional; defaults to a dev string)

## Notes
- Database file `data.db` is created at runtime in `server/`.
- This is a minimal MVP and not production hardened.