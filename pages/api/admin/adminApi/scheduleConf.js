// import emailing_data from "../../../../utilities/emailing/emailing_data";
import createTransporter from "../../../../utilities/emailing/smtp";
import dotenv from "dotenv";

dotenv.config("../env");
const transporter = createTransporter();

const SendEmailTo = async () =>
  //   semester,
  //   academicYear,
  //   reason,
  //   student_id,
  //   major,
  //   student_name,
  //   student_email,
  //   gpa,
  //   pm_firstName,
  //   pm_lastname,
  //   pm_email,
  //   promotion
  {
    // console.log(pm_email);
    try {
      // console.log(
      //   semester,
      //   academicYear,
      //   reason,
      //   student_id,
      //   major,
      //   student_name,
      //   student_email,
      //   gpa,
      //   pm_firstName,
      //   pm_lastname,
      //   pm_email
      // );
      // const itServiceDeskEmail = emailing_data.itServiceDeskEmail;
      // const fromEmail = emailing_data.fromEmail;
      // const link = `${process.env.NEXTAUTH_URL}`;
      // const bccEmail = emailing_data.bccEmail;
      // const subject = `Your ${role} Information System (SIS) Access`;

      // const attachments = [
      //   {
      //     path: `${esa_logo}`,
      //     cid: "esalogo",
      //   },
      // ];

      const emailBody =
        "<!DOCTYPE html>" +
        "<html><head><title>Student Request</title>" +
        "</head><body><div>" +
        // FIXME: Commented to deploy on VERCEL
        `<div style="text-align: center;">
          <img src="cid:esalogo" alt="" width = "120">
          </div>` +
        `<p>Dear <span style="font-weight: bold"> test</span>,</p>` +
        `</br>` +
        `<p>We have received a request for an academic transcript for test, who is enrolled in the test program. The details are provided below:</p>
         <ul>
         <li>Student ID: test</li>
         <li>Email Address: test</li>
         <li>GPA : test</li>
         <li>Promotion: test</li>
         <li>Reason for Request: test</li>
         </ul>` +
        `<p>Thank you.</p> ` +
        `</br>` +
        `<p>Best Regards,</p> ` +
        "</div></body></html>";

      const mailOptions = {
        from: "noreply@esa.edu.lb",
        to: "hass.ch.solutions@gmail.com",
        cc: "",
        bcc: "",
        subject: "test",
        html: emailBody,
        //   attachments: attachments,
        purpose: "test",
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      return error;
    }
  };

export default SendEmailTo;
