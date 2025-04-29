import axios from 'axios';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Refresh the access token using refresh_token
async function refreshAccessToken(refresh_token) {
  const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
  }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data.access_token;
}


export default async function handler(req, res) {
  const { eventId, accessToken, newData } = req.body;

  if (!Array.isArray(accessToken) || accessToken.length === 0) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: 'No AccessToken provided or invalid format.'
    });
  }

  // if (!Array.isArray(eventId) || eventId.length !== accessToken.length) {
  //   return res.status(400).json({
  //     success: false,
  //     code: 400,
  //     message: 'eventId must be an array matching the length of accessToken.'
  //   });
  // }

  const results = [];
  const errors = [];

  for (let i = 0; i < accessToken.length; i++) {
    try {
      console.log('event' , eventId.data.data[i].event_id )
      let new_access_token = await refreshAccessToken(accessToken[i].access_token)
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId.data.data[i].event_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${new_access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Unknown error');
      }

      results.push({ index: i, event: data });

    } catch (error) {
      console.error(`Error updating event for index ${i}:`, error.message);
      errors.push({ index: i, error: error.message });
    }
  }

  if (errors.length > 0) {
    return res.status(207).json({
      success: false,
      code: 207,
      message: 'Some updates failed',
      results,
      errors
    });
  }

  return res.status(200).json({ success: true, results });
}

