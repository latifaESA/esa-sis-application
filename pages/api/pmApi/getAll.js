const { connect, disconnect } = require("../../../utilities/db");
const { getAll } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();

    const { table } = req.body;
    const data = await getAll(connection, table);
    await disconnect(connection);

    // // console.log(data.rows)
    return res.status("200").send(data);
  } catch (error) {
    // console.log('the error is: ', error)
    return res.status("500").send(error);
    // return error;
  }
}
export default handler;
// module.exports = handler;
