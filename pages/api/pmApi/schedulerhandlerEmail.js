const schedule = require('node-schedule');
const EmailSyncHandler = require('./scheduleClassEmail');

schedule.scheduleJob({ hour: 20, minute: 40, tz: 'Asia/Beirut' }, async function () {
    try {
        // Mock response object
        const response = {
            status: function (code) {
                console.log('Setting status:', code);
                return this;
            },
            json: function (data) {
                console.log('Sending response with data:', data);
                return data; // Adjust as needed
            }
        };

        await EmailSyncHandler({}, response);

        console.log('Email sync job completed successfully');
    } catch (error) {
        console.error('Email sync job failed:', error.message);
    }
});
