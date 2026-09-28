const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Seed dataset matching the problem statement specifications
let items = [
  {
    id: 1,
    type: 'Lost',
    name: 'Black Wallet',
    category: 'Accessories',
    location: 'Canteen',
    date: '2026-09-27',
    description: 'Black leather wallet with college ID inside.',
    contact: 'student@campus.edu'
  },
  {
    id: 2,
    type: 'Found',
    name: 'Scientific Calculator',
    category: 'Electronics',
    location: 'Library, Block A',
    date: '2026-09-28',
    description: 'Casio scientific calculator found on table 4.',
    contact: '+1234567890'
  }
];

// GET /api/items - Retrieve items with optional search & status filter
app.get('/api/items', (req, res) => {
  const { search, status } = req.query;
  let filtered = [...items];

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.type.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// POST /api/items - Create a new item listing
app.post('/api/items', (req, res) => {
  const { type, name, category, location, date, description, contact } = req.body;

  if (!type || !name || !contact) {
    return res.status(400).json({ error: 'Item type, name, and contact info are required.' });
  }

  const newItem = {
    id: Date.now(),
    type,
    name: name.trim(),
    category: category || 'Other',
    location: location ? location.trim() : 'Campus',
    date: date || new Date().toISOString().split('T')[0],
    description: description ? description.trim() : '',
    contact: contact.trim()
  };

  items.unshift(newItem);
  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});