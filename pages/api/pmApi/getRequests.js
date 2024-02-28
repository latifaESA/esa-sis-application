const { connect, disconnect } = require("../../../utilities/db");
const { getRequestsForPm } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();

    const { pm_id, req_id, student_id, student_email, status, type , major_id } = req.body;
    const data = await getRequestsForPm(
      connection,
      pm_id,
      req_id,
      student_id,
      student_email,
      status,
      type , 
      major_id
    );
    // console.log("=====================");
    // console.log(data);
    // console.log("=====================");
    // console.log(pm_id, req_id, student_id, student_email, status);
    await disconnect(connection);

    // console.log(data);
    // // console.log(data.rows)
    return res.status("200").send(data);
  } catch (error) {
    // console.log('the error is: ', error)
    return res.status("401").send(error);
    // return error;
  }
}
// export default handler;
export default handler;
