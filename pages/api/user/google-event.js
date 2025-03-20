import { google } from 'googleapis';
require('dotenv').config();

async function handler(req, res) {
    try {
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

        if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
            return res.status(500).json({ success: false, message: "Missing API credentials" });
        }

        const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const { accessToken, event } = req.body;
        if (!accessToken || !event) {
            return res.status(400).json({ success: false, message: "Missing accessToken or event data" });
        }

        oauth2Client.setCredentials({ access_token: accessToken });

        console.log("Validating Token...");
        try {
            await oauth2Client.getAccessToken(); // Check if token is valid
        } catch (error) {
            console.error("Invalid Token, Refreshing...");
            const { token } = await oauth2Client.refreshAccessToken();
            oauth2Client.setCredentials({ access_token: token });
        }

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const existingEvents = await calendar.events.list({
            calendarId: 'primary',
            q: event.summary,
        });

        let response;
        if (existingEvents.data.items.length > 0) {
            response = await calendar.events.update({
                calendarId: 'primary',
                eventId: existingEvents.data.items[0].id,
                resource: event,
            });
        } else {
            response = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });
        }

        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error("Google API Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default handler;
