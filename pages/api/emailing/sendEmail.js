/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\emailing\registerEmail.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import decrypt from "../../../utilities/encrypt_decrypt/decryptText";
import sis_app_logger from "../../api/logger";
import useragent from "useragent";

/* Loading the environment variables from the .env file. */
require("dotenv").config();

const nodemailer = require("nodemailer");

async function sendEmail(req, res) {
  // const sendEmail = (req, res) => {
  // // console.log('sendEmail..........');
  // // console.log('req.body=', req.body);
  const incomingEmail = JSON.parse(decrypt(req.body.data));
  // // console.log('incomingEmail=', incomingEmail);
  const { from, to, cc, bcc, subject, emailBody, attachments, purpose } =
    incomingEmail;
  const userAgent = req.headers["user-agent"];
  const userAgentinfo = useragent.parse(userAgent);
  // const { from, to, cc,bcc, subject, emailBody, attachments } = req.body;
  /* Creating a transporter object using the default SMTP transport. */
  const mailTransporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: "587",
    auth: {
      // TODO:will be changed to read from admin dashbord setting ()
      user: process.env.OFFICE365_EMAIL,
      pass: process.env.OFFICE365_PASSWORD,
    },
    secureConnection: false,
    tls: { ciphers: "SSLv3" },
    debug: false, // show debug output
    logger: false, // log information in console
  });
  let mailOption;
  if (attachments) {
    /* The mail option. */
    mailOption = {
      from: from,
      to: to,
      cc: cc,
      bcc: bcc,
      subject: subject,
      html: emailBody,
      attachments: attachments,

      // dsn: {
      //   id: 'some random message specific id',
      //   return: 'headers',
      //   notify: ['failure', 'delay', 'success'],
      //   recipient: cc,
      // },
    };
  } else {
    /* The mail option. */
    mailOption = {
      from: from,
      to: to,
      cc: cc,
      bcc: cc,
      subject: subject,
      html: emailBody,

      // dsn: {
      //   id: 'some random message specific id',
      //   return: 'headers',
      //   notify: ['failure', 'delay', 'success'],
      //   recipient: cc,
      // },
    };
  }

  /* Sending the email. */
  // eslint-disable-next-line no-unused-vars
  mailTransporter.sendMail(mailOption, (err, data) => {
    if (err) {
      // // console.log(err);
      sis_app_logger.error(
        `${new Date()}=---=${purpose} email Failed=${to}=${JSON.stringify(
          err
        )}=${userAgentinfo.os.family}=${userAgentinfo.os.major}=${
          userAgentinfo.family
        }=${userAgentinfo.source}=${userAgentinfo.device.family}`
      );
      // send warnning

      // sis_app_logger.warn(
      //   `${new Date()}=0=---=${purpose}=email Failed=${to}=${JSON.stringify(
      //     err
      //   )}=${userAgentinfo.os.family}=${userAgentinfo.os.major}=${
      //     userAgentinfo.family
      //   }=${userAgentinfo.source}=${userAgentinfo.device.family}`
      // );

      res.status(500).send({ error: JSON.stringify(err) });
    } else {
      // // console.log('Email sent: ' + data.response);
      res.status(200).send({ message: "success" });

      sis_app_logger.info(
        `${new Date()}=1=${purpose} email Sent=${to}=${
          userAgentinfo.os.family
        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          userAgentinfo.source
        }=${userAgentinfo.device.family}`
      );
    }
  });
  return;
}
export default sendEmail;
