/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: utilities\emailing\emailForResetPassword.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import emailing_data from "../emailing_data";
//import selection_data from '../selection_data';
import encrypt from "../../utilities/encrypt_decrypt/encryptText";
import decrypt from "../encrypt_decrypt/decryptText";
// import { useSelector } from 'react-redux';
// import axios from 'axios';
async function EmailForResetPassword({
  emailToken,
  // lname,
  // fname,
  ID,
  idForRes,
  router,
}) {
  console.log("resetemail");
  console.log(idForRes);
  // console.log(emailToken)
  // console.log(ID)
  // console.log(email)
  // const apiUrl = '/api/controller/settingdata';
  const response = await fetch("/api/controller/settingdata");
  const data = await response.json();

  const decryptedData = JSON.parse(decrypt(data.data));
  // console.log('decryptedData:',decryptedData);
  // console.log('descrypt setts')
  // console.log('hello.set')
  // console.log(decryptedData.esa_logo)
  const esa_logo = decryptedData.esa_logo;
  // // console.log(esa_logo)
  //// console.log(data.data)JSON.parse(decrypt(response.data.data)
  //const data = await JSON.parse(decrypt(response.json()));
  //// console.log(data)
  // FIXME: After verification signin and go to home or filling application
  //// console.log(esa_logo)
  const encryptedQuery = encodeURIComponent(
    encrypt(
      JSON.stringify({
        token: `${emailToken}`,
        email: `${idForRes}`,
        id: `${ID}`,
      })
    )
  );
  const link = `${window.location.origin}/api/user/password/resetpassword?query=${encryptedQuery}`;
  // console.log("link")
  // console.log(link)
  // const link = `${window.location.origin}/api/user/password/resetpassword?token=${emailToken}&email=${email}`;
  const itServiceDeskEmail = emailing_data.itServiceDeskEmail;
  // console.log(itServiceDeskEmail)
  const fromEmail = emailing_data.fromEmail;
  // console.log(fromEmail)
  const ccEmail = emailing_data.ccEmail;
  // const bccEmail = emailing_data.bccEamil;
  const subject = `New mail for Reset Password from ${fromEmail}`;
  // console.log('this is subject')
  // console.log(subject)

  // const link = emailing_data.link;
  // const appState = useSelector(
  //   (state) => state.persistedReducer.app_state.appState
  // );

  const attachments = [
    {
      path: `${esa_logo}`,
      cid: "esalogo",
    },
  ];
  // console.log('this attachments')
  // console.log(attachments)
  const emailBody =
    "<!DOCTYPE html>" +
    "<html><head><title>Appointment</title>" +
    "</head><body><div>" +
    // FIXME: Commented to deploy on VERCEL
    `<div style="text-align: center;">
        <img src="cid:esalogo" alt="" width = "120">
        </div>` +
    // `<p>Dear <span style="font-weight: bold"> ${lname} ${fname}</span>,</p>` +
    `<p>Application ID: <span style="font-weight: bold"> ${ID}</span>,</p>` +
    `</br>` +
    `<p>We have received a password reset request for your SIS Application at ESA Business School.</p>
        <p>To confirm this request, and set a new password for your account, please click on the following link: </p>` +
    `<div style="text-align: center;"> 
        <a href=${link} target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #0c0c0c;text-decoration: none;font-weight:bold;display: inline-block;">
       Reset Password             
        </a>
        </div>` +
    `</br>` +
    `<p> <span style="font-weight: bold">(This link is valid for 30 minutes from the time this reset was first requested)</span> </p> ` +
    `</br>` +
    `<p>For further assistance, you may contact us on the following email:  ${itServiceDeskEmail}.</p> ` +
    `</br>` +
    `<p>Best Regards,</p> ` +
    `<p>The Admissions Department </p> ` +
    `<p> +961 3 394 584 | WhatsApp or Phone Call </p> ` +
    "</div></body></html>";
  const payload = JSON.stringify({
    from: fromEmail,
    to: idForRes,
    cc: ccEmail,
    // bcc: bccEmail,
    subject: subject,
    emailBody: emailBody,
    attachments: attachments,
    purpose: "reset password",
  });
  // Encrypt the data before sending in the body
  // end-to-end encryption for query parameters
  const encryptedBody = JSON.stringify({ data: encrypt(payload) });

  await fetch("/api/emailing/sendEmail", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: encryptedBody,
    // body: JSON.stringify({
    //   from: fromEmail,
    //   to: email,
    //   cc: ccEmail,
    //   subject: subject,
    //   emailBody: emailBody,
    //   // FIXME: Commented to deploy on VERCEL
    //   attachments: attachments,
    // }),
  }).then((res) => {
    // // console.log('Fetch= ', res);
    let title = "Sending Reset Password Email Failed";
    let message = "Emailing Service Not Available!";
    let instructions = "Please contact us on the following email:";
    let email = "itservicedesk@esa.edu.lb";

    res.status === 200
      ? router.push("/user/password/sentEmailAlert")
      : // FIXME: if (res.status!==200) I Suggest To send an message to the admin content the ID
        router.push(
          `/user/message/messageEmailingService?title=${title}&message=${message}&instructions=${instructions}&email=${email}`
        );
  });
  // End send email
}

export default EmailForResetPassword;
