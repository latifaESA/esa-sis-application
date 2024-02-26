import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '748431984812-251tnvfcugl1c3uns4h751pr3119oktc.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

export default async function handler(req, res) {
  const { oldRefreshToken } = req.body;
  if (oldRefreshToken.length > 0) {
    const refreshedTokens = [];
    for (let i = 0; i < oldRefreshToken.length; i++) {
      const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
      if(oldRefreshToken[i].access_token !== null){
        try {
          const newTokens = await client.refreshToken(oldRefreshToken[i].access_token);
          refreshedTokens.push({
            access_token: newTokens.tokens.access_token,
            student_id: oldRefreshToken[i].student_id
          });
        } catch (error) {
          console.error('Error refreshing token:', error);
          return res.status(500).json({
            success: false,
            code: 500,
            message: error.message,
          });
        }
      }

    }
    // Send response after all tokens have been refreshed
    res.status(200).json({
      success: true,
      code: 200,
      data: refreshedTokens
    });
  } else {
    // Handle case when there are no tokens to refresh
    res.status(400).json({
      success: false,
      code: 400,
      message: 'No refresh tokens provided in the request body'
    });
  }
}
