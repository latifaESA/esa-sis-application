import emailing_data from '../../../../utilities/emailing/emailing_data';
import createTransporter from '../../../../utilities/emailing/smtp';
import dotenv from "dotenv";



dotenv.config("../env");
const transporter = createTransporter();

const SendEmailOld = async (name, email, esa_logo , program) => {
  // console.log('wsll email' , password)
  try {
  //  console.log('pass' , password)
    const itServiceDeskEmail = emailing_data.itServiceDeskEmail;
    const fromEmail = emailing_data.fromEmail;
    const link = `${process.env.NEXTAUTHLOGIN_URL}`
    const bccEmail = emailing_data.bccEmail;
    const ccEmail = emailing_data.ccEmail;
    const subject = `Your Student Information System (SIS) Access`;

    const attachments = [
      {
        path: `${esa_logo}`,
        cid: 'esalogo',
      },
    ];

    const emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>Appointment</title>' +
      '</head><body><div>' +
      `<div style="text-align: center;">
      <img src="cid:esalogo" alt="" width = "120">
         </div>` +
      `</br>` +
      `<p>Dear <span style="font-weight: bold">${name}</span>,</p>` +
      `<p>Hope this email finds you well.</p> ` +
      `<p>Congratulations on your successful enrollment at ESA Business School ! As part of your academic journey with us, we've set up your access to the Student Information System (SIS). </p>` +

      `<p> We would like to inform you that your access to the Student Information System (SIS) remains active. Since you were previously enrolled in a certificate program at ESA, you can continue using the same credentials to sign in.</p>` +
      `<p> Please log in to the SIS to access the details of your ${program} using the link below:</p>` +
      `<div style="text-align: center;"> 
            <a href='${link}' target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #0c0c0c;text-decoration: none;font-weight:bold;display: inline-block;">
            Sign In            
            </a>
            </div>` +
      `</br>` +
      `</br>` +
      `<p>If you need any help or have trouble accessing the system, please contact our IT support team at: ${itServiceDeskEmail}.</p> ` +
      `</br>` +
      `<p>Best regards,</p> ` +
      `<p>ESA Business School</p> ` +

      '</div></body></html>';

    const mailOptions = {
      from: fromEmail,
      to: email,
      cc: ccEmail,
      bcc: bccEmail,
      subject: subject,
      html: emailBody,
      attachments: attachments,
      purpose: 'New Active Student',
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    return error;
  }
};



export default SendEmailOld;
