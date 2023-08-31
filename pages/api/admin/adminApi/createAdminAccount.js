const { connect  , disconnect} = require("../../../../utilities/db");
const { createAdmin } = require("../../controller/queries");
const { default: adminExist } = require("./AdminExist");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();
    // filterStudent(connection, id, firstname, lastname, major, promotion, status);
    
    const { adminid, adminemail, admin_firstname, userpassword , admin_lastname  , admin_status} = req.body;
    if(adminemail === '' || admin_firstname === '' || admin_lastname === '' || admin_status === ''){
      return res.status(400).json({
        success:false,
        code : 400,
        message:`Fields is Required`
      })
    }
    const exist = await adminExist(connection , admin_firstname , admin_lastname , adminemail)
    if(exist){
      return res.status(200).send(exist);
    }
    const data = await createAdmin(
      connection,
      adminid,
      adminemail,
      admin_firstname,
      userpassword,
      admin_lastname,
      admin_status
    );

    disconnect(connection)
    return res.status("200").send(data);
  } catch (error) {
    console.log("the error is: ", error);
    return res.status("401").send(error);
    // return error;
  }
}
// export default handler;
module.exports = handler;
