import axios from 'axios';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export default async function handler(req, res) {
  console.log('body', req.body);

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { accessToken, event, attendance_id } = req.body;
  console.log('Received event:', event , accessToken);

  if (!accessToken || accessToken.length === 0) {
    return res.status(400).json({ message: 'No access tokens provided' });
  }

  try {
    let success = false;
    let usersNeedRelogin = [];

    for (let i = 0; i < accessToken.length; i++) {
      const { accessToken, student_id } = accessToken[i];

      try {
        // Try inserting event using provided access token
        const response = await axios.post(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          event,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Insert into your database
        await axios.post(`${NEXTAUTH_URL}api/pmApi/fillgoogleCalender`, {
          student_id: student_id,
          event_id: response.data.id,
          attendance_id: attendance_id,
        });

        success = true;

      } catch (error) {
        console.error('Error inserting event:', error.response?.data || error.message);

        if (error.response?.status === 401) {
          // Unauthorized, token expired or invalid
          console.log(`Access token invalid or expired for student_id: ${student_id}`);
          usersNeedRelogin.push(student_id);
        }

        continue;
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
        message: 'Failed to insert event for any access token',
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
