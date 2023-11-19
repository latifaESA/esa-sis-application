
import emailing_data from '../../../utilities/emailing/emailing_data';
import createTransporter from '../../../utilities/emailing/smtp';
import dotenv from "dotenv";



dotenv.config("../env");
const transporter = createTransporter();

const SendEmail = async (CertificateName,email) => {
  try {
   
    
    const fromEmail = emailing_data.fromEmail;
   
    // const bccEmail = emailing_data.bccEmail;
    const subject = `Student Grades`;

    const emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>Appointment</title>' +
      '</head><body><div>' +
      `<div style="text-align: center;">
         </div>` +
      `</br>` +
      `<p>Dear <span style="font-weight: bold">Student</span>,</p>` +
      `<p>Hope this email finds you well.</p> ` +
      `<p>Your grade of certificate ${CertificateName} available now in SIS </p>` +
      // `<p> Please login using the below credentials:</p>` +
      // `<p>Your username: <span style="font-weight: bold">${email}</span>.</p>` +
      // `<p>Your password: <span style="font-weight: bold">${defaultpassword}</span>.</p>` +

      `<p>if you have any question please content with you'r program manager</p>` +
      `<p>Best regards,</p> ` +
      `<p>ESA Business School</p> ` +

      '</div></body></html>';

    const mailOptions = {
      from: fromEmail,
      to: email,
    //   cc: '',
    //   bcc: bccEmail,
      subject: subject,
      html: emailBody,
    //   attachments: attachments,
      purpose: 'Grades',
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};



export default SendEmail;
