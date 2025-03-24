require('dotenv').config();
const axios = require('axios');

async function handler(req, res) {
  try {
    console.log('wslt try')
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    console.log('CLIENT_ID' , CLIENT_ID)

    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    console.log('CLIENT_SECRET' , CLIENT_SECRET)
    // const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const { accessToken } = req.body; // Assuming you send these in the request body
    console.log('ref' , accessToken)

    if (!CLIENT_ID || !CLIENT_SECRET || !accessToken) {
      return res.status(200).json({ success: false, message: "Missing API credentials" });
    }
    console.log('wslt if')

    // Get a fresh access token using the refresh token
    let AccessToken;
    try {
      console.log('tene try')
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token', 
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: accessToken,
          grant_type: 'refresh_token'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      // console.log('token' , tokenResponse)
      AccessToken = tokenResponse.data.access_token;
      console.log("Successfully obtained access token" , AccessToken);
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
      return res.status(400).json({ 
        success: false, 
        message: "Failed to refresh token", 
        error: error.response?.data || error.message 
      });
    }

    const { event } = req.body;
    console.log('event' , event)
    if (!event) {
      return res.status(200).json({ success: false, message: "Missing event data" });
    }

    // Simplify: Just create a new event every time to avoid search issues
    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            'Authorization': `Bearer ${AccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('response' , response)
      
      return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error("Calendar API Error:", error.response?.data || error.message);
      
      // Return detailed error information to help diagnose the issue
      return res.status(200).json({ 
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