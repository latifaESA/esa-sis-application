const { connect } = require("../../../../utilities/db");
const { createASAccount } = require("../../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();
        // filterStudent(connection, id, firstname, lastname, major, promotion, status);
        const {pm_id, pm_ass_id, pm_ass_firstname, pm_ass_lastname, pm_ass_email, pm_ass_status, userpassword, major_id} = req.body;
        console.log('======this=====')
        console.log(pm_id)
        const data = await createASAccount(connection, pm_ass_id, pm_ass_firstname, pm_ass_lastname, pm_ass_email, pm_ass_status, userpassword,major_id);
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