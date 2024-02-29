const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');
const next = require('next');

const port = 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt'),
};

app.prepare().then(() => {
  // Install express package
  exec('npm install express', (error, stdout, stderr) => {
    if (error) {
      console.error(`npm install express error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`npm install express stderr: ${stderr}`);
      return;
    }
    console.log(`express package installed successfully`);
  });

  const server = require('express')();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  https.createServer(httpsOptions, server).listen(443, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });
});
