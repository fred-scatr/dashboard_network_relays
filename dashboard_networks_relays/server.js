const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { log } = require('console');
const { fileURLToPath } = require('url');
const app = express();
const fs = require('fs').promises;


app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});


const port = 3100;

app.get('/', (req, res) => {
    console.log("dirname = ", __dirname)
    console.log("get first page")
    const filePath = path.join(__dirname, 'public', 'dashboard1.html');
    console.log("Serving file:", filePath);  // Log file path
    res.sendFile(filePath);
});

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'css')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);     
});