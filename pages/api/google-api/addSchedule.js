import axios from 'axios';
// const { connect, disconnect } = require("../../../utilities/db");
// const { addTokensGoogle } = require("../controller/queries");
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Function to refresh access token using refresh token
async function refreshAccessToken(refreshToken) {
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
          

    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { access_token, event, attendance_id } = req.body;
  // console.log('access_token =======================' , access_token)


  // if (!Array.isArray(access_token) || access_token.length === 0) {
  //   return res.status(400).json({ message: 'No access tokens provided' });
  // }
//  const connection = await connect();
  try {
    let success = false;
    let usersNeedRelogin = [];

    for (const student of access_token) {
      const { access_token, student_id } = student;
     
      if (!access_token || typeof access_token !== 'string' || access_token.length < 10) {
        console.warn(`Missing or invalid refresh token for student_id: ${student_id}`);
        usersNeedRelogin.push(student_id);
        continue;
      }

      try {
        // Always refresh token before use
        const newAccessToken = await refreshAccessToken(access_token);
    

        const response = await axios.post(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          event,
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Event added:', response.data);

        await axios.post(`${NEXTAUTH_URL}/api/pmApi/fillgoogleCalender`, {
          student_id,
          event_id: response.data.id,
          attendance_id,
        });

        success = true;
      } catch (error) {
        console.error(`Failed to insert event for ${student_id}:`, error.response?.data || error.message);
        usersNeedRelogin.push(student_id);
      }
    }

    if (success) {
      return res.status(201).json({
        success: true,
        code: 201,
        message: 'Schedule created successfully',
        needReLoginStudents: usersNeedRelogin,
      });
    } else {
      return res.status(500).json({
        success: false,
        code: 500,
        message: 'Failed to insert event for any student',
        needReLoginStudents: usersNeedRelogin,
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
}
