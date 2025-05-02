import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
    }

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: 'Authorization code is required' });
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI // Use environment variable for flexibility
        );

        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Log tokens for debugging
        // console.log('Tokens received:', tokens);

        return res.status(200).json({
            success: true,
            message: 'Tokens exchanged successfully',
            data: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || null, // Some auth flows may not return a refresh token
                expires_in: tokens.expiry_date, // Provide token expiry info
                scope: tokens.scope || 'Unknown', // Ensure we return granted scopes
            },
        });
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);

        return res.status(400).json({
            success: false,
            error: 'Failed to exchange code for tokens',
            message: error.response?.data?.error_description || error.message,
        });
    }
}
