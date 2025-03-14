import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    try {
        const encodeFormData = (data) => {
            return Object.keys(data)
                .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                .join('&');
        };

        // Using Microsoft OAuth 2.0 endpoint
        const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANTID}/oauth2/v2.0/token`;

        const data = {
            grant_type: 'client_credentials',
            client_id: process.env.SHAREPOINT_CLIENTID,
            client_secret: process.env.SHAREPOINT_SECRET,
            scope: `${process.env.SHAREPOINT_SOURCES}/.default` // Updated scope format for modern authentication
        };

        const response = await axios.post(
            tokenEndpoint,
            encodeFormData(data),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (!response.data.access_token) {
            throw new Error('Access token not obtained');
        }

        return res.json({ access_token: response.data.access_token });

    } catch (error) {
        return res.status(500).json({ error: `Error obtaining access token: ${error.message}` });
    }
}
