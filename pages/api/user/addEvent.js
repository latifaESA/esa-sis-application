require('dotenv').config();
const axios = require('axios');
const { connect, disconnect } = require("../../../utilities/db");
const { addTokensGoogle } = require("../controller/queries");



async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const connection = await connect();
  try {
    console.log('Starting request...');

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
    const { refreshToken, event , user_id , attendance_id } = req.body;
    // console.log('event' , event , req.body)
    // console.log('Incoming refreshToken and event:', JSON.stringify({ refreshToken, event }, null, 2));

    if (!CLIENT_ID || !CLIENT_SECRET || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing API credentials or refresh token',
      });
    }

    // 🔁 Get a new access token using the refresh token
    let accessToken;
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken,  // For refreshing token
          grant_type: 'refresh_token',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      // Access the response from Google
      accessToken = tokenResponse.data.access_token;
      
      // If a new refresh token is returned, include it in the response
      const newRefreshToken = tokenResponse.data.refresh_token || refreshToken; // Use the new refresh token if available, else retain the old one
      
      console.log('tokenResponse.data', newRefreshToken);
      
      // Save tokens to the database
      const response = await addTokensGoogle(connection, newRefreshToken, user_id);
      await disconnect(connection)
      console.log('✅ New access token obtained' , response);     
    } catch (error) {
      console.error('❌ Error refreshing token:', error.response?.data || error.message);
      return res.status(400).json({
        success: false,
        message: 'Failed to refresh access token',
        error: error.response?.data || error.message,
      });
    }

    // ✅ Validate and fix the event data
    if (
      !event ||
      !event.start?.dateTime ||
      !event.end?.dateTime ||
      !event.summary
    ) {
      console.log('test' ,   !event)
      return res.status(400).json({
        success: false,
        message: 'Invalid event data',
      });
    }

    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty event time range',
        debug: {
          start: event.start.dateTime,
          end: event.end.dateTime,
        },
      });
    }

    console.log('Checking if the event exists...');
    // 🔍 Search for the event on the calendar
    const searchResponse = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          q: event.summary, // Search by the event's summary (name)
        },
      }
    );

    let existingEvent = searchResponse.data.items.find(item => item.summary === event.summary);
    
    if (existingEvent) {
      console.log('Found existing event. Updating...');
      // If the event exists, update it using the event's ID
      const updateResponse = await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEvent.id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Event updated successfully:', updateResponse.data);

      return res.status(200).json({
        success: true,
        data: updateResponse.data,
        redirectUrl: updateResponse.data.htmlLink,
      });
    } else {
      console.log('No existing event found. Creating a new one...');
      // If the event does not exist, create it
      const createResponse = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Event created successfully:', createResponse.data);

      await axios.post(`${NEXTAUTH_URL}/api/pmApi/fillgoogleCalender`, {
        student_id :user_id,
        event_id: createResponse.data.id,
        attendance_id:attendance_id,
      }); 

      return res.status(200).json({
        success: true,
        data: createResponse.data,
        redirectUrl: createResponse.data.htmlLink,
      });
    }

  } catch (error) {
    console.error('❌ Unexpected Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error',
      error: error.response?.data || error.message,
    });
  }
}

export default handler;
