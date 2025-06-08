const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let participants = [];

app.get('/api/participants', (req, res) => {
  res.json(participants);
});

app.post('/api/participants', (req, res) => {
  const { name } = req.body;
  if(!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
  if(participants.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'Name already exists' });
  }
  participants.push({ name, timestamp: Date.now() });
  res.json({ success: true });
});

app.post('/api/pick-winner', (req, res) => {
  if(participants.length === 0) return res.status(400).json({ error: 'No participants' });
  const winnerIndex = Math.floor(Math.random() * participants.length);
  const [winner] = participants.splice(winnerIndex, 1);
  participants.unshift(winner);
  res.json({ winner });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
