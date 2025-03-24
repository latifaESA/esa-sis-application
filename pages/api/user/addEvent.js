require('dotenv').config();
const axios = require('axios');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    console.log('Starting request...');

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    
    let { refreshToken, event } = req.body; // Expect `refreshToken` instead of `accessToken`
    console.log('refreshToken' , req.body)
    
    if (!CLIENT_ID || !CLIENT_SECRET || !refreshToken) {
      console.error("Missing API credentials or refresh token");
      return res.status(200).json({ success: false, message: "Missing API credentials or refresh token" });
    }

    console.log('Fetching new access token...');
    
    // 🔹 Refresh the access token
    let accessToken;
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken, // ✅ Using refresh token instead of accessToken
          grant_type: 'refresh_token'
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      accessToken = tokenResponse.data.access_token;
      console.log("✅ Successfully obtained new access token:", accessToken);
      
    } catch (error) {
      console.error("❌ Error refreshing token:", error.response?.data || error.message);
      return res.status(200).json({ 
        success: false, 
        message: "Failed to refresh token", 
        error: error.response?.data || error.message 
      });
    }

    // 🔹 Validate event data
    if (!event || !event.start || !event.end || !event.summary) {
      return res.status(200).json({ success: false, message: "Invalid event data" });
    }

    console.log("Creating calendar event...");

    // 🔹 Insert event into Google Calendar
    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      console.log("✅ Event created successfully:", response.data);

      return res.status(200).json({ success: true, data: response.data });
      
    } catch (error) {
      console.error("❌ Calendar API Error:", error.response?.data || error.message);
      return res.status(200).json({ 
        success: false, 
        message: "Failed to create calendar event", 
        error: error.response?.data || error.message,
        scopes: error.response?.data?.error?.details?.[0]?.scopes || [] 
      });
    }

  } catch (error) {
    console.error("❌ Handler Error:", error.message);
    return res.status(200).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

export default handler;
