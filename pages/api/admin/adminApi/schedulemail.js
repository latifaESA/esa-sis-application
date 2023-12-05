const { connect, disconnect } = require("../../../../utilities/db");
// const { createAdmin } = require("../../controller/queries");
// const { default: adminExist } = require("./AdminExist");
// import DataSettings from "../../controller/getDataSettings";
import SendEmailTo from "./scheduleConf";
const cron = require("node-cron");
// import SendEmailAdmin from "./sendEmailAdminAfterRegister";

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const { emails, content, day, month } = req.body;
    const cronSchedule = `0 0 15 ${day} ${month} *`;
    console.log(cronSchedule);
    if (!cronSchedule) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Missing 'cronSchedule' in the request body.",
      });
    }

    cron.schedule(cronSchedule, async () => {
      try {
        const connection = await connect();
        console.log(emails, content);
        // Call the SendEmailTo function
        const resp = await SendEmailTo(emails, content);

        disconnect(connection);
        console.log("Email sent successfully.");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    });

    return res.status(200).send("Scheduled email sending task.");
  } catch (error) {
    console.error("Error in the handler:", error);
    return res.status(500).send("Internal Server Error");
  }
}
// export default handler;
module.exports = handler;
