const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package

// Initialize Express app
const app = express();

// Use cors middleware to allow requests from specific origin(s)
app.use(cors({
  origin: 'https://frontend-rho-dun.vercel.app', // Allow this origin
  methods: ['GET', 'POST'], // Allow specific methods
  allowedHeaders: ['Content-Type'] // Allow specific headers
}));

app.use(bodyParser.json());

// In-memory store for URLs
const urlDatabase = new Map();

// Route to shorten URLs
app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;

  // Validate URL
  try {
    new URL(originalUrl); // Throws error if invalid
  } catch (_) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Generate a short ID
  const shortId = crypto.randomBytes(6).toString('hex');
  urlDatabase.set(shortId, originalUrl);

  // Send the shortened URL
  res.json({ shortUrl: `https://backend-ruddy-zeta.vercel.app/${shortId}` });
});

// Route to redirect to the original URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlDatabase.get(shortId);

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
