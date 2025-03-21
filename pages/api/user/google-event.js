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
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token', 
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN,
          grant_type: 'refresh_token'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      accessToken = tokenResponse.data.access_token;
      console.log("Successfully obtained access token" , accessToken);
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to refresh token", 
        error: error.response?.data || error.message 
      });
    }

    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ success: false, message: "Missing event data" });
    }

    // Simplify: Just create a new event every time to avoid search issues
    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error("Calendar API Error:", error.response?.data || error.message);
      
      // Return detailed error information to help diagnose the issue
      return res.status(500).json({ 
        success: false, 
        message: "Failed to create calendar event", 
        error: error.response?.data || error.message,
        scopes: error.response?.data?.error?.details?.[0]?.scopes || [] 
      });
    }
  } catch (error) {
    console.error("Handler Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export default handler;