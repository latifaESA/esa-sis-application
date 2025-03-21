const emailing_data = require("../../../utilities/emailing/emailing_data");
const createTransporter = require("../../../utilities/emailing/smtp");
const dotenv = require("dotenv");
const { env } = require("process");
const axios = require("axios");
const timeFormatter = require("../../../utilities/timeFormatter");
const dateFormatter = require("../../../utilities/dateFormatter");

dotenv.config({ path: "../env" }); // Ensure environment variables are loaded properly
const transporter = createTransporter();

const SendEmailBeforeClass = async (
  student_id,
  email,
  student_firstname,
  student_lastname,
  scheduleResult,
  courseDetails,
  teacherDetails,
  roomDetails,
  scheduleDetails
) => {
  try {
    // console.log('wslll' , scheduleResult , student_firstname , student_lastname)
    // console.log('scheduleDetails' , scheduleDetails.rows[0]  ,'roomDetails' , roomDetails.rows[0]  , 'teacherDetails', teacherDetails.rows[0]  , courseDetails.rows[0] , student_id, email)
    const fromEmail = emailing_data.fromEmail;
    const ccEmail = emailing_data.ccEmail;
    // console.log('form' , fromEmail)
    const subject = `Class Reminder`;

    const emailBody =
      "<!DOCTYPE html>" +
      "<html><head><title>Class Reminder</title>" +
      "</head><body><div>" +
      `</br>` +
      `<p>Dear <span style="font-weight: bold">${student_firstname} ${student_lastname}</span>,</p>` +
      `<p>We hope this email finds you well.</p>` +
      `<p>We would like to remind you about your upcoming class next week:</p>` +
      `<ul>
          <li>Class: ${courseDetails.rows[0].course_id} : ${courseDetails.rows[0].course_name
      } - ${teacherDetails.rows[0].teacher_firstname} ${teacherDetails.rows[0].teacher_lastname
      } </li>
          <li>Start Date: ${dateFormatter(
            scheduleResult.rows[0].startdate
      )} at  ${timeFormatter(scheduleDetails.rows[0].from_time)} till  ${timeFormatter(scheduleDetails.rows[0].to_time)}   </li>
            <li> Building: ${roomDetails.rows[0].room_building} - Room: ${roomDetails.rows[0].room_name
      }</li>
          </ul>` +
      `<p>If you have any questions or require any further information, please do
          not hesitate to contact your program manager.</p>` +
      `<p>We look forward to your active participation and engagement in the
          upcoming class.</p>` +
      `<p>Best regards,</p>` +
      `<p>ESA Business School</p>` +
      `</br>` +
      "</div></body></html>";
      


    const mailOptions = {
      from: fromEmail,
      to: email,
      cc: ccEmail,
      subject: subject,
      html: emailBody,
      purpose: "Class Reminder",
    };
    console.log("📨 Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to", email);
    let data = {
      receiverIds: [student_id],
      senderId: null,
      content: emailBody,
      subject: "Class Reminder",
    };
    await axios.post(`${env.NEXTAUTH_URL}/api/pmApi/addNotification`, data);

 
  } catch (error) {
    return error;
  }
};

module.exports = SendEmailBeforeClass; // Use module.exports for CommonJS
