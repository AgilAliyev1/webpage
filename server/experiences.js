const express = require('express');
const { getDb } = require('./db');
const { requireAuth } = require('./utils');

const router = express.Router();

// Search experiences: q, type, location, tags
router.get('/', (req, res) => {
  const { q = '', type = '', location = '', tags = '' } = req.query;
  const db = getDb();

  const where = [];
  const params = {};

  if (q) {
    where.push('(title LIKE @q OR organization LIKE @q OR description LIKE @q)');
    params.q = `%${q}%`;
  }
  if (type) {
    where.push('type = @type');
    params.type = String(type).toLowerCase();
  }
  if (location) {
    where.push('location LIKE @location');
    params.location = `%${location}%`;
  }
  if (tags) {
    // simple contains match on comma-separated list
    where.push('tags LIKE @tags');
    params.tags = `%${tags}%`;
  }

  const sql = `SELECT id, title, organization, location, type, description, tags, created_at FROM experiences ${
    where.length ? 'WHERE ' + where.join(' AND ') : ''
  } ORDER BY created_at DESC LIMIT 100`;

  const rows = db.prepare(sql).all(params);
  res.json({ items: rows });
});

// Create experience (auth required)
router.post('/', requireAuth, (req, res) => {
  const { title, organization, location, type, description, tags } = req.body;
  if (!title || !organization || !location || !type || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const normalizedType = String(type).toLowerCase();
  if (!['volunteer', 'internship'].includes(normalizedType)) {
    return res.status(400).json({ error: 'Invalid type' });
  }
  const db = getDb();
  const info = db
    .prepare(
      'INSERT INTO experiences (title, organization, location, type, description, tags, created_by) VALUES (@title, @organization, @location, @type, @description, @tags, @created_by)'
    )
    .run({
      title,
      organization,
      location,
      type: normalizedType,
      description,
      tags: tags || '',
      created_by: req.user.id,
    });
  const created = db
    .prepare('SELECT id, title, organization, location, type, description, tags, created_at FROM experiences WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json({ item: created });
});

module.exports = router;


