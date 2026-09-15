const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// API Router
const apiRouter = require('./api/index');
app.use('/api', apiRouter);

// Serve static assets
app.use(express.static(path.join(__dirname)));

// SPA fallback: any other route sends index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎮 E-SPORTS BANGLADESH Server is running at http://localhost:${PORT}`);
  console.log(`⚡ API endpoints live at http://localhost:${PORT}/api`);
});
