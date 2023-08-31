import emailing_data from '../../../../utilities/emailing/emailing_data';
import createTransporter from '../../../../utilities/emailing/smtp';
import dotenv from "dotenv";


dotenv.config("../env");
const transporter = createTransporter();

const SendEmail = async (name, email, password, studentId) => {
  try {
    const itServiceDeskEmail = emailing_data.itServiceDeskEmail;
    const fromEmail = emailing_data.fromEmail;
    const link  = `${process.env.NEXTAUTH_URL}`
    const bccEmail = emailing_data.bccEmail;
    const subject = `Welcome to ESA`;
    // const esa_logo = 'C:\\Users\\user\\Desktop\\ese-SiS-project\\esa-project-sis-app\\public\\esa.png';
    // const attachments = [
    //   {
    //     path: `${esa_logo}`,
    //     cid: 'esalogo',
    //   },
    // ];
     
    const emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>Appointment</title>' +
      '</head><body><div>' +
      `<div style="text-align: center;">
         <img src='' alt="" width="120">
         </div>` +
      `</br>` +
      `<p>Dear <span style="font-weight: bold">${name}</span>,</p>` +
      `<p>Welcome to ESA(Ecole superieure des affaires) </p>` +
      `<p>Your ID is: <span style="font-weight: bold">${studentId}</span>.</p>` +
      // `<p> Please login using the below credentials:</p>` +
      // `<p>Your username: <span style="font-weight: bold">${email}</span>.</p>` +
      // `<p>Your password: <span style="font-weight: bold">${defaultpassword}</span>.</p>` +

      `<p>Please Find your new credentials:
        <ul>
        • Your username: <span style="font-weight: bold">${email}</span> <br>
        • Your password: <span style="font-weight: bold">${password}</span>
        </ul>
        </p>
        ` +
      `<p>Click on the below link to sign in to your account:</p>` +
      `<div style="text-align: center;"> 
            <a href='${link}' target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #0c0c0c;text-decoration: none;font-weight:bold;display: inline-block;">
            Sign In            
            </a>
            </div>` +
      `</br>` +
      `</br>` +
      `<p>For further assistance, you may contact us on the following email: ${itServiceDeskEmail}.</p> ` +
      `</br>` +
      `<p>Best regards,</p> ` +
      `<p>The Admissions Department </p> ` +
      `<p> +961 3 394 584 | WhatsApp or Phone Call </p> ` +
      '</div></body></html>';

    const mailOptions = {
      from: fromEmail,
      to: email,
      cc: '',
      bcc: bccEmail,
      subject: subject,
      html: emailBody,
      // attachments: attachments,
      purpose: 'New Active Student',
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};



export default SendEmail;
