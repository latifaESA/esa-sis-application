import SendEmailTo from './sendToAllStudentCertificate';

const { connect, disconnect } = require('../../../utilities/db');
const {
  getEmailsByMajorId,
  insertNotifications,
} = require('../controller/queries');

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();

    const { user_id, selectedMajorID, subjectContent, emailContent, selectedSignature } = req.body;
    console.log(selectedSignature)
    const data = await getEmailsByMajorId(connection, selectedMajorID);
    if (data.length > 0) {
      const emails = data.map((row) => row.email);
      const userID = data.map((row) => row.userid);
      // await SendEmailTo(emails, subjectContent);
      await SendEmailTo(emails, emailContent, subjectContent, selectedSignature);
      await insertNotifications(
        connection,
        userID,
        user_id,
        emailContent,
        subjectContent
      );
      await disconnect(connection);
      return res.status('200').send(data);
    } else {
      return res.status(404).json('No Student found');
    }
  } catch (error) {
    // console.log('the error is: ', error)
    return res.status('401').send(error);
    // return error;
  }
}
export default handler;
// module.exports = handler;
