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
  const cronSchedule = "9 12 30 11 *";
  try {
    cron.schedule(cronSchedule, async () => {
      try {
        const connection = await connect();

        // Call the SendEmailTo function
        const resp = await SendEmailTo();

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
