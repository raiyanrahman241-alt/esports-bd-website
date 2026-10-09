const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Mount API application on /api
const apiApp = require('./api/index');
app.use('/api', apiApp);

// Route aliases for index bundles to guarantee single module identity
app.get(['/assets/index-v4-esbd.js', '/assets/index-v2.js'], (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'assets', 'index-DxaXhSva.js'));
});

// Serve static assets with no-cache headers for assets
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// SPA fallback: any other route sends index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎮 E-SPORTS BANGLADESH Server is running at http://localhost:${PORT}`);
    console.log(`⚡ API endpoints live at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
