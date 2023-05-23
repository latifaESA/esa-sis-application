const { connect } = require("../../../utilities/db");
const { filterStudent } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();
        // filterStudent(connection, id, firstname, lastname, major, promotion, status);
        const {id,firstname,lastname,major,promotion,status} = req.body;
        const data = await filterStudent(connection, id,firstname,lastname,major,promotion,status);
        console.log(data.rows)
        return res.status('200').send(data)
        
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;