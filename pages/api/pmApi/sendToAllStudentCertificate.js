import dotenv from 'dotenv';
import createTransporter from '../../../utilities/emailing/smtp';

dotenv.config('../env');
const transporter = createTransporter();

const SendEmailTo = async (emails, emailContent, subjectContent) => {
  try {
    // const attachments = [
    //   {
    //     path: `http://80.77.180.245:3000/file/setting/public/esa.png`,
    //     cid: 'esalogo',
    //   },
    // ];
    const emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>From Program manager</title>' +
      '</head><body><div>' +
      `<p>Dear <span style="font-weight: bold">Student</span>,</p>` +
      `<pre style="font-family: inherit; font-size: inherit; line-height: inherit; margin: 0; padding: 0;">${emailContent}</pre>` +
      `</br>` +
      `<p>Thank you.</p> ` +
      `</br>` +
      `<p>Best Regards,</p> ` +
      '</div></body></html>';
    const emailTo = emails.join(', ');
    const mailOptions = {
      from: 'noreply@esa.edu.lb',
      to: '',
      cc: '',
      bcc: '',
      subject: subjectContent,
      html: emailBody,
      // attachments: attachments,
      purpose: 'Certificate purpose',
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('this error is in email in pmApi : ', error)
    return error;
  }
};

export default SendEmailTo;
