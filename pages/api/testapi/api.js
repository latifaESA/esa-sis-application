const { connect } = require("../../../utilities/db");
const { filterStudent } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();

        const user = await filterStudent(connection, 'all', 'all', 'all', 'all', 'all', 'active');

        console.log(user)
        return res.status('200').send(user)
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;