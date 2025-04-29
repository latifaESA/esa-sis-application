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
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { access_token, eventId } = req.body;

  if (access_token.length > 0) {
    try {
      for (let i = 0; i < access_token.length; i++) {
        const calendarId = 'primary';
        let token = access_token[i].access_token;
        console.log('token' , token)
        // const refresh_token = access_token[i].refresh_token; // Make sure you pass this from client!
        const event_id = eventId.data.data[i].event_id;

        let new_access_token = await refreshAccessToken(token) 
        console.log("new_access_token" , new_access_token)
        try {
          // Attempt to delete the event
          await axios.delete(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${event_id}`,
            {
              headers: {
                Authorization: `Bearer ${new_access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } catch (error) {
          console.error('Delete failed, trying refresh...', error.response?.data || error.message);

       
        }
      }

      return res.status(200).json({ message: 'Event(s) deleted successfully' });

    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Unexpected server error' });
    }

  } else {
    return res.status(400).json({ message: 'No access tokens provided' });
  }
}
