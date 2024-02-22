// pages/api/delete-event.js

import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { access_token, eventId } = req.body;

  // Replace 'primary' with the appropriate calendar ID
  const calendarId = 'primary'; // or the calendar ID you want to delete the event from

  // Create OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token });

  // Create Calendar API instance
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Delete event
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });

    // Return success message
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
}
