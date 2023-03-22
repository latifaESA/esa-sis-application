/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\external_application\recive_active_student_info_in_SIS.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

const http = require('http');
// Generate a strong KEY from an online key generator
const ONLINE_SIS_SECRET_KEY = 'ONLINE_SIS_SECRET_KEY';
// for dev mode should be localhost:3000
const ONLINE_URL = 'https://online-application-url.com';

// TODO: Dear SIS developer,I prefer to use another method, but in a quick search, I did not find an integrated approach other than creating a new server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ONLINE_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (
    req.method === 'POST' &&
    req.url === '/recive_active_student_info_in_SIS'
    // FIXME: Maybe req.url need Modification
  ) {
    // Verify authorization token
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== ONLINE_SIS_SECRET_KEY) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
      return;
    }

    // Read request body
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const studentInfo = JSON.parse(body).studentInfo;
      console.log('Received student info:', studentInfo);
      // TODO: Dear SIS developper
      // TODO: send recieved data to the database
      // TODO: write an info log

      // Send a response to the online application
      const responseData = { message: 'Received student info' };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseData));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    // TODO: Dear SIS developper
    // TODO: write an error log
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log('SIS application listening on port 3001');
});
