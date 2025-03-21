require('dotenv').config();
const axios = require('axios');

async function handler(req, res) {
  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    // const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const { REFRESH_TOKEN } = req.body; // Assuming you send these in the request body

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return res.status(500).json({ success: false, message: "Missing API credentials" });
    }

    // Get a fresh access token using the refresh token
    let accessToken;
    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token'
      });
      
      accessToken = tokenResponse.data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
      return res.status(500).json({ success: false, message: "Failed to refresh token" });
    }

    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ success: false, message: "Missing event data" });
    }

    // Check if an event with similar summary exists
    let existingEventId = null;
    if (event.summary) {
      try {
        const searchResponse = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?q=${encodeURIComponent(event.summary)}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          existingEventId = searchResponse.data.items[0].id;
        }
      } catch (error) {
        console.error("Error searching for existing events:", error.response?.data || error.message);
        // Continue execution even if search fails
      }
    }

    let response;
    // Either update existing event or create new one
    if (existingEventId) {
      response = await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEventId}`,
        event,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error?.message || error.message 
    });
  }
}

export default handler;