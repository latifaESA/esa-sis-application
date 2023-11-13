const { connect } = require("../../../utilities/db");
const { getEmailsSender } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    // const { student_id } = req.body;
    const data = await getEmailsSender(connection, '20231229');
    return res.status("200").json(data.rows);
  } catch (error) {
    // console.log('the error is: ', error)
    return res.status("401").send(error);
    // return error;
  }
}
// module.exports = handler;
export default handler;