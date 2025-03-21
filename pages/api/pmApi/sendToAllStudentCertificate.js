import dotenv from 'dotenv';
import createTransporter from '../../../utilities/emailing/smtp';

dotenv.config('../env');
const transporter = createTransporter();
const SendEmailTo = async (emails, emailContent, subjectContent, selectedSignature) => {

  try {
    let emailBody;
    {selectedSignature ? 
      emailBody =
  '<!DOCTYPE html>' +
  '<html><head><title>Email Signature</title></head>' +
  '<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333;">' +
    '<div style="max-width: 600px;">' +
      '<p>Dear <span style="font-weight: bold;">Student</span>,</p>' +
      `<pre style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; margin: 0; padding: 0; white-space: pre-wrap;">${emailContent}</pre>` +
      '<br>' +
      '<p>Thank you.</p>' +
      '<br>' +
      '<p>Best Regards,</p>' +
      '<!-- Institutional Signature -->' +
      '<div style="margin-top: 20px; padding: 15px 0;">' +
        '<div style="font-size: 12px; line-height: 1.4; color: #555555;">' +
        `<strong style="font-size: 14px; color: #2A2A2A;">${selectedSignature.name ? selectedSignature.name : ''}</strong><br>` +
          'École Supérieure des Affaires<br>' +
          'Campus de l’ESA, 289 rue Clemenceau<br>' +
          'Beyrouth, Liban, B.P. 113-7318<br><br>' +
          `C <a href="mailto:${selectedSignature.email}" style="color: #2A2A2A; text-decoration: none;">${selectedSignature.email}</a><br>` +
          `T <a href="tel:${selectedSignature.phone}" style="color: #2A2A2A; text-decoration: none;">${selectedSignature.phone}</a><br>` +
          `${selectedSignature.mobile ? `M <a href="tel:${selectedSignature.mobile}" style="color: #2A2A2A; text-decoration: none;">${selectedSignature.mobile}</a><br>` : ''}` +
          '<a href="http://www.esa.edu.lb" style="color: #2A2A2A; text-decoration: none;">www.esa.edu.lb</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</body></html>'
      /*
      emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>From Program manager</title>' +
      '</head><body><div>' +
      `<p>Dear <span style="font-weight: bold">Student</span>,</p>` +
      `<pre style="font-family: inherit; font-size: inherit; line-height: inherit; margin: 0; padding: 0;">${emailContent}</pre>` +
      `</br>` +
      `<p>Thank you.</p> ` +
      `</br>` +
      `<p>Best Regards,</p> ` +
      `<!-- Updated Signature -->` +
      `<div style="margin-top:20px;">` +
        `<strong>${selectedSignature.name || ''}</strong><br>` +
        //  `${selectedSignature.title || 'Software Administrator'}<br>` +
        `<div style="font-size: 10px; padding: 20px;">` +
          `École Supérieure des Affaires<br>` +
          `Campus de l’ESA, 289 rue Clemenceau<br>` +
          `Beyrouth, Liban, B.P. 113-7318<br><br>` +
          `C <a href="mailto:${selectedSignature.email}" style="text-decoration:none;color:black;">${selectedSignature.email}</a><br>` +
          `T <a href="tel:${selectedSignature.phone}" style="text-decoration:none;color:black;">${selectedSignature.phone}</a><br>` +
          `${selectedSignature.mobile ? `M <a href="tel:${selectedSignature.mobile}" style="text-decoration:none;color:black;">${selectedSignature.mobile}</a><br>` : ''}` +
          `<a href="http://www.esa.edu.lb" style="text-decoration:none;color:black;">www.esa.edu.lb</a>` +
        `</div>` +
      `</div>` +
      '</div></body></html>'
      */
      /*
      emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>From Program manager</title>' +
      '</head><body><div>' +
      `<p>Dear <span style="font-weight: bold">Student</span>,</p>` +
      `<pre style="font-family: inherit; font-size: inherit; line-height: inherit; margin: 0; padding: 0;">${emailContent}</pre>` +
      `</br>` +
      `<p>Thank you.</p> ` +
      `</br>` +
      `<p>Best Regards,</p> ` +
      `<!-- Adding Signature -->
      <div style="margin-top:20px;">
          <strong>${selectedSignature.name ? selectedSignature.name : ''}</strong>
          <!-- <br>Senior Program Manager, Responsable de Programmes<br> -->
          <br>
          <div width="100" style="font-size: 10px; padding: 20px;">
          École Supérieure des Affaires<br>
          Campus de l’ESA, 289 rue Clemenceau<br>
          Beyrouth, Liban, B.P. 113-7318<br><br>
          T <a href=${selectedSignature.phone} style="text-decoration:none;color:black;">${selectedSignature.phone}</a><br>

          ${selectedSignature.tel_phone ? `F <a href=${selectedSignature.tel_phone} style="text-decoration:none;color:black;">${selectedSignature.tel_phone}</a><br>` : ''}
          E <a href=${selectedSignature.email} style="text-decoration:none;color:black;">${selectedSignature.email}</a><br>
          <a href="http://www.esa.edu.lb" style="text-decoration:none;color:black;">www.esa.edu.lb</a>
          </div>
      </div>` +
      '</div></body></html>'
      */
      :
      emailBody =
      '<!DOCTYPE html>' +
      '<html><head><title>From Program manager</title>' +
      '</head><body><div>' +
      `<p>Dear <span style="font-weight: bold">Student</span>,</p>` +
      `<pre style="font-family: inherit; font-size: inherit; line-height: inherit; margin: 0; padding: 0;">${emailContent}</pre>` +
      `</br>` +
      `<p>Thank you.</p> ` +
      `</br>` +
      `<p>Best Regards,</p> ` +
      '</div></body></html>'
      
    }
    // const emailTo = emails.join(', ');
    const mailOptions = {
      from: 'noreply@esa.edu.lb',
      to: emails,
      cc: 'batoulhareb2020@gmail.com',
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
