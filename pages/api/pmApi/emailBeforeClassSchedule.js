

import emailing_data from '../../../utilities/emailing/emailing_data';
import createTransporter from '../../../utilities/emailing/smtp';
import dotenv from "dotenv";
import { env } from 'process';
import axios from 'axios'


dotenv.config("../env");
const transporter = createTransporter();

const SendEmailBeforeClass = async (           
   student_id,
    email, 
    student_firstname , 
    student_lastname , 
    courseDetails ,
     teacherDetails , 
     roomDetails , 
     scheduleDetails) => {
  try {
   
    
    const fromEmail = emailing_data.fromEmail;
   
    // const bccEmail = emailing_data.bccEmail;
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
          scheduleDetails.rows[0].startdate
        )} at  ${timeFormatter(scheduleDetails.rows[0].from_time)} till  ${timeFormatter(scheduleDetails.rows[0].to_time)}   </li>
            <li> Building: ${roomDetails.rows[0].room_building} - Room: ${roomDetails.rows[0].room_name
        }</li>
          </ul>` +
        `<p>If you have any questions or require any further information, please do
          not hesitate to contact your program manager.</p>` +
        `<p>  We look forward to your active participation and engagement in the
          upcoming class.</p>` +
        `<p>Best regards,</p>` +
        `<p>ESA Business School</p>` +
        `</br>` +
        "</div></body></html>";

          let data = {
            receiverIds: student_id,
            senderId: null,
            content: emailBody,
            subject: "Class Reminder",
          };
         await axios.post(
            `${env.NEXTAUTH_URL}/api/pmApi/addNotification`,
            data
          );
    

    const mailOptions = {
      from: fromEmail,
      to: email,
      cc: 'batoulhareb2020@gmail.com',
    //   bcc: bccEmail,
      subject: subject,
      html: emailBody,
    //   attachments: attachments,
      purpose: 'Class Reminder',
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};



export default SendEmailBeforeClass;
