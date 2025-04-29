import axios from 'axios';

const CLIENT_ID = '488510538109-36i4ol70jivfrtcu31upbmld812klgr7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

export default async function handler(req, res) {
  const { oldRefreshToken } = req.body;
  console.log('oldRefreshToken', oldRefreshToken);

  if (!oldRefreshToken || oldRefreshToken.length === 0) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: 'No refresh tokens provided in the request body',
    });
  }

  try {
    const refreshedTokens = [];

    for (let i = 0; i < oldRefreshToken.length; i++) {
      const refreshTokenItem = oldRefreshToken[i];
      console.log('refreshTokenItem', refreshTokenItem);

      // Skip items with null access_token
      if (!refreshTokenItem?.access_token) {
        console.log(`Skipping student ${refreshTokenItem.student_id} due to null access token.`);
        continue; // Skip if no access token
      }

      try {
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshTokenItem.access_token,
            grant_type: 'refresh_token',
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        // If a new refresh token is returned, include it in the response
        const newRefreshToken = response.data.refresh_token || refreshTokenItem.access_token;

        refreshedTokens.push({
          student_id: refreshTokenItem.student_id,
          access_token: response.data.access_token,
          refresh_token: newRefreshToken, // Store the new refresh token if returned
          expires_in: response.data.expires_in,
          scope: response.data.scope,
          token_type: response.data.token_type,
          id_token: response.data.id_token,
        });
      } catch (error) {
        if (error.response?.data?.error === 'invalid_grant') {
          console.log(`Invalid or expired refresh token for student ${refreshTokenItem.student_id}.`);
          refreshedTokens.push({
            student_id: refreshTokenItem.student_id,
            status: 'failed',
            message: 'Invalid or expired refresh token',
          });
        } else {
          console.error('Error refreshing token:', error.response?.data || error.message);
          refreshedTokens.push({
            student_id: refreshTokenItem.student_id,
            status: 'failed',
            message: error.response?.data?.error_description || error.message,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      code: 200,
      data: refreshedTokens,
    });

  } catch (error) {
    console.error('Error processing refresh tokens:', error.message || error.response?.data);
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.response?.data || error.message,
    });
  }
}
