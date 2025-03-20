const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config("../env");

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: "587",
    auth: {
      user: process.env.OFFICE365_EMAIL,
      pass: process.env.OFFICE365_PASSWORD,
    },
    secureConnection: false,
    tls: { ciphers: "SSLv3", rejectUnauthorized: false },
    debug: false,
    logger: false,
  });

  return transporter;
};

module.exports = createTransporter;
