const { connect, disconnect } = require('../../../../utilities/db');
// const { createAdmin } = require("../../controller/queries");
// const { default: adminExist } = require("./AdminExist");
// import DataSettings from "../../controller/getDataSettings";
import SendEmailTo from './testReq';
// import SendEmailAdmin from "./sendEmailAdminAfterRegister";

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();
    // filterStudent(connection, id, firstname, lastname, major, promotion, status);
    console.log('ana wslt aal sendReq');
    // console.log(
    //   // semester,
    //   academicYear,
    //   reason,
    //   student_id,
    //   major,
    //   student_name,
    //   student_email,
    //   gpa,
    //   pm_firstName,
    //   pm_lastname,
    //   promotion,
    //   pm_email
    // );
    console.log('ana clg');
    const {
      semester,
      academicYear,
      reason,
      student_id,
      major,
      student_name,
      student_email,
      gpa,
      pm_firstName,
      pm_lastname,
      promotion,
      pm_email,
    } = req.body;
    console.log('ana const');
    if (
      reason === '' ||
      student_id === '' ||
      major === '' ||
      student_name === '' ||
      pm_firstName === '' ||
      pm_lastname === '' ||
      pm_email === ''
    ) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: `Fields is Required`,
      });
    }
    // const exist = await adminExist(
    //   connection,
    //   admin_firstname,
    //   admin_lastname,
    //   adminemail
    // );
    // if (exist) {
    //   return res.status(200).send(exist);
    // }

    // const data = await createAdmin(
    //   connection,
    //   adminid,
    //   adminemail,
    //   admin_firstname,
    //   userpassword,
    //   admin_lastname,
    //   admin_status
    // );

    // const settings = await DataSettings(connection, "settings");
    // const esa_logo = settings[0].esa_logo;
    // await SendEmailAdmin(admin_firstname, adminemail, password ,adminid, esa_logo)
    console.log('ana wslt lal sendMailTo');
    // eslint-disable-next-line no-unused-vars
    const resp = await SendEmailTo(
      semester,
      academicYear,
      reason,
      student_id,
      major,
      student_name,
      student_email,
      gpa,
      pm_firstName,
      pm_lastname,
      pm_email,
      promotion
    );
    disconnect(connection);
    return res.status('200').send('ok');
  } catch (error) {
    console.log('the error is: ', error);
    return res.status('401').send(error);
    // return error;
  }
}
// export default handler;
module.exports = handler;
