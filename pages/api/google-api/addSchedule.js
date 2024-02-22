// pages/api/insert-event.js

import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { access_token, event } = req.body;

  // Create OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token });

  // Create Calendar API instance
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Insert event
    const response = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for user's primary calendar
      requestBody: event,
    });

    // Return the inserted event data
    res.status(200).json({ message: 'Event created successfully', event: response.data });
  } catch (error) {
    console.error('Error inserting event:', error);
    return res.status(500).json({
        success: false,
        code: 500,
        message: error.message,
      });
  }
}
