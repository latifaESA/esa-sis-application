const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');
const next = require('next');
const express = require('express'); // Require express directly

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const httpsOptions = {
  cert: fs.readFileSync('../esa-sis-application/_.esa.edu.lb/b6100e1ad302c9e.crt'),
  key: fs.readFileSync('../esa-sis-application/_.esa.edu.lb/privatKey.txt'),
  
};

app.prepare().then(() => {
  // Create an express app
  const server = express();

  // Define your routes and middleware here
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start HTTPS server
  https.createServer(httpsOptions, server).listen(443, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });
});
