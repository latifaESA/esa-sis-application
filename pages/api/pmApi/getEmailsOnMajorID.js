import SendEmailTo from './sendToAllStudentCertificate';

const { connect, disconnect } = require('../../../utilities/db');
const {
  getEmailsByMajorId,
  insertNotifications,
} = require('../controller/queries');

async function handler(req, res) {
  try {
    const connection = await connect();

    const {
      user_id,
      selectedMajorID,
      promotionValue,
      subjectContent,
      emailContent,
      selectedSignature,
    } = req.body;

    const studentsData = await getEmailsByMajorId(connection, selectedMajorID, promotionValue);
    console.log('Students data:', studentsData);

    if (studentsData.length > 0) {
      const emails = studentsData.map((row) => row.email);
      // const userIDs = studentsData.map((row) => row.userid);

      console.log('Extracted emails:', emails);

      // Send email to all
      await SendEmailTo(emails, emailContent, subjectContent, selectedSignature);

      // Insert notification for each student
      for (let i = 0; i < studentsData.length; i++) {
        await insertNotifications(
          connection,
          [studentsData[i].userid], // assuming it accepts an array
          user_id,
          emailContent,
          subjectContent,
          studentsData[i].email
        );
      }

      await disconnect(connection);
      return res.status(200).send(studentsData);
    } else {
      await disconnect(connection);
      return res.status(404).json('No Student found');
    }
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(401).send(error);
  }
}

export default handler;
