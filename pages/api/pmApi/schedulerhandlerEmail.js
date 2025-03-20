const schedule = require('node-schedule');
const EmailSyncHandler = require('./scheduleClassEmail');


 schedule.scheduleJob({ hour: 13, minute: 30, tz: 'Asia/Beirut' }, async function () {

    try {
        const response = {
            // Mocked response object, adjust as needed
            status: () => {},
            json: () => {}
        };

         await EmailSyncHandler({}, response);
   
        console.log('Email sync job completed successfully');
    } catch (error) {
        console.error('Email sync job failed:', error.message);
    }
});
