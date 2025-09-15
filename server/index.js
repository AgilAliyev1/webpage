const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { getDb } = require('./db');
const authRouter = require('./auth');
const experiencesRouter = require('./experiences');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize DB (creates tables if not exist)
getDb();

// Routers
app.use('/api/auth', authRouter);
app.use('/api/experiences', experiencesRouter);

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


