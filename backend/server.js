const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Use backend routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`✅ Connected to MySQL database.`);
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
