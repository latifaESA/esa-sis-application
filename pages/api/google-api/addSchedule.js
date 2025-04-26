import axios from 'axios';
import { env } from "process";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
  console.log('body', req.body);

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { access_Token, event, attendance_id } = req.body;

  if (access_Token.length > 0) {
    try {
      let success = false;

      for (let i = 0; i < access_Token.length; i++) {
        let { access_token, refresh_token, student_id } = access_Token[i];

        try {
          // Attempt to insert event
          let response = await axios.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            event,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          await axios.post(`${env.NEXTAUTH_URL}api/pmApi/fillgoogleCalender`, {
            student_id: student_id,
            event_id: response.data.id,
            attendance_id: attendance_id
          });

          success = true;
        } catch (error) {
          console.error('Error inserting event:', error.response?.data || error.message);

          if (error.response?.status === 401 && refresh_token) {
            // Token expired, try to refresh
            console.log('Trying to refresh access token...');
            try {
              access_token = await refreshAccessToken(refresh_token);

              // Retry the event insertion
              const retryResponse = await axios.post(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                event,
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              await axios.post(`${env.NEXTAUTH_URL}api/pmApi/fillgoogleCalender`, {
                student_id: student_id,
                event_id: retryResponse.data.id,
                attendance_id: attendance_id
              });

              success = true;
            } catch (refreshError) {
              console.error('Error refreshing token or retrying:', refreshError.response?.data || refreshError.message);
              continue;
            }
          } else {
            continue;
          }
        }
      }

      if (success) {
        return res.status(201).json({
          success: true,
          code: 201,
          message: 'Schedule created successfully'
        });
      } else {
        return res.status(500).json({
          success: false,
          code: 500,
          message: 'Failed to insert event for any access token',
        });
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({
        success: false,
        code: 500,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({ message: 'No access tokens provided' });
  }
}
