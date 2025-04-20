const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/albums', (req, res) => {
    const songsPath=path.join(__dirname, 'public/songs');
    fs.readdir(songsPath, (err, folders) => {
        if (err) return res.status(500).json({ error: "Failed to list albums" });

        const albums = folders.filter(f => !f.startsWith('.')).map(folder => {
            let infoPath = path.join(songsPath, folder, 'info.json');
            if (fs.existsSync(infoPath)) {
                let info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
                return {
                    folder,
                    title: info.title || folder,
                    description: info.description || ''
                };
            }
            return null;
        }).filter(Boolean);

        res.json(albums);
    });
});

app.listen(3000, ()=>console.log('Server Started!'))