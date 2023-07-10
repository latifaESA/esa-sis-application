const { connect } = require("../../../../utilities/db");
const { createPMAccount } = require("../../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();
        // filterStudent(connection, id, firstname, lastname, major, promotion, status);
        const {pm_id, pm_firstname, pm_lastname, pm_email, pm_status, userpassword, major_id} = req.body;
        console.log('======this=====')
        console.log(pm_id)
        const data = await createPMAccount(connection, pm_id, pm_firstname, pm_lastname, pm_email, pm_status, userpassword,major_id);
        console.log(data)
        return res.status('200').send(data)
        
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;