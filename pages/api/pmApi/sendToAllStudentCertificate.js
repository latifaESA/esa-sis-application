import dotenv from "dotenv";
import createTransporter from "../../../utilities/emailing/smtp";

dotenv.config("../env");
const transporter = createTransporter();

const SendEmailTo = async (
  emails,
  emailContent
) => {
  try {
    const attachments = [
      {
        path: `http://80.77.180.245:3000/file/setting/public/esa.png`,
        cid: "esalogo",
      },
    ];
    const emailBody =
      "<!DOCTYPE html>" +
      "<html><head><title>From Program manage</title>" +
      "</head><body><div>" +
      `<div style="text-align: center;">
        <img src="cid:esalogo" alt="" width = "120">
        </div>` +
      `<p>${emailContent}</p>` +
      `</br>` +
      `<p>Thank you.</p> ` +
      `</br>` +
      `<p>Best Regards,</p> ` +
      "</div></body></html>";
      const emailTo = emails.join(', ')
    const mailOptions = {
      from: "noreply@esa.edu.lb",
      to: emailTo,
      cc: "",
      bcc: "",
      subject: "Certificat purpose",
      html: emailBody,
      attachments: attachments,
      purpose: "Certificat purpose",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};

export default SendEmailTo;
