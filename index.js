const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Rate Limiting Middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route for root (homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ API to list albums
app.get('/api/albums', (req, res) => {
  const songsPath = path.join(__dirname, 'public', 'songs');

  fs.readdir(songsPath, (err, folders) => {
    if (err) {
      console.error('Error reading songs directory:', err);
      return res.status(500).json({ error: "Failed to list albums" });
    }

    const albums = folders
      .filter(folder => !folder.startsWith('.'))
      .map(folder => {
        const infoPath = path.join(songsPath, folder, 'info.json');
        try {
          if (fs.existsSync(infoPath)) {
            const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
            return {
              folder,
              title: info.title || folder,
              description: info.description || '',
            };
          }
        } catch (e) {
          console.warn(`Failed to read or parse info.json in ${folder}:`, e);
        }
        return null;
      })
      .filter(Boolean);

    res.json(albums);
  });
});

// ✅ Dynamic port for Render and local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
