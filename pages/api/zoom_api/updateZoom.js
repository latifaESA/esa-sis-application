import axios from 'axios';

async function handler(req, res) {
  try {
    const { 
      accessToken,
      zoomId,
      classId,
      date
    } = req.body;

  

    if (!zoomId) {
      throw new Error('Invalid or missing zoom_id in the request.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const requestBody = {
      topic: `${classId}`,
      type: 2,
      start_time: date,
      settings: {
        join_before_host: true,
        auto_recording: "local",
        mute_upon_entry: false,
        waiting_room: false,
      },
    };
 
   await axios.patch(`https://api.zoom.us/v2/meetings/${zoomId}`, requestBody, { headers });
    return res.status(203).json({
      success: true,
      code: 203,
      message: "Zoom updated successfully",
    });
  } catch (error) {
    console.error('Zoom API request failed:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}

module.exports = handler;
