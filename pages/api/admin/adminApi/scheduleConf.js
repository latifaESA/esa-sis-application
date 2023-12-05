// import emailing_data from "../../../../utilities/emailing/emailing_data";
import createTransporter from "../../../../utilities/emailing/smtp";
import dotenv from "dotenv";

dotenv.config("../env");
const transporter = createTransporter();

const SendEmailTo = async (emails, content) => {
  //   console.log(emails, content);
  try {
    //   const emailBody =
    //     "<!DOCTYPE html>" +
    //     "<html><head><title>Student Request</title>" +
    //     "</head><body><div>" +
    //     // FIXME: Commented to deploy on VERCEL
    //     `<div style="text-align: center;">
    //       <img src="cid:esalogo" alt="" width = "120">
    //       </div>` +
    //     `<p>Dear <span style="font-weight: bold"> test</span>,</p>` +
    //     `</br>` +
    //     `<p>We have received a request for an academic transcript for test, who is enrolled in the test program. The details are provided below:</p>
    //      <ul>
    //      <li>Student ID: test</li>
    //      <li>Email Address: test</li>
    //      <li>GPA : test</li>
    //      <li>Promotion: test</li>
    //      <li>Reason for Request: test</li>
    //      </ul>` +
    //     `<p>Thank you.</p> ` +
    //     `</br>` +
    //     `<p>Best Regards,</p> ` +
    //     "</div></body></html>";

    const mailOptions = {
      from: "noreply@esa.edu.lb",
      to: emails,
      cc: "",
      bcc: "",
      subject: "Class Reminder",
      html: content,
      //   attachments: attachments,
      purpose: "Class Reminder",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};

export default SendEmailTo;
