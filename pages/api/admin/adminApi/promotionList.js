const { connect , disconnect} = require("../../../../utilities/db");
const { Promotion } = require("../../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
  try {
    const connection = await connect();
  
    const response = await Promotion(
      connection,
 
    );

    disconnect(connection)
    return res.status(200).json({
      code:200,
      succuss: true,
      data : response.rows
    })
  } catch (error) {
    // console.log('the error is: ', error)
    return res.status("401").send(error);
    // return error;
  }
}
export default handler;
// module.exports = handler;
