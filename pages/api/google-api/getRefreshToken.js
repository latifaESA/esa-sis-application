import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '748431984812-251tnvfcugl1c3uns4h751pr3119oktc.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

export default async function handler(req, res) {
  const { oldRefreshToken } = req.body;

  const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

  try {
    const newTokens = await client.refreshToken(oldRefreshToken);
    res.status(200).json({
        success:true,
        code:200,
        data:newTokens.tokens.access_token
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
