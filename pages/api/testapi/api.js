const { connect } = require("../../../utilities/db");
const { filterStudent, getAll } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();
        // filterStudent(connection, id, firstname, lastname, major, promotion, status);
//<<<<<<< Hassan
        // const user = await filterStudent(connection, 'all', 'all', 'all', 'all', 'all', 'active');

        const user = await getAll(connection, req.body.student);

        console.log(user.rows)
        return res.status('200').send(user.rows)
//=======
//        const user = await filterStudent(connection, '', '', '', '', '', '');

//        // const user = await getAll(connection, req.body.student);

//        console.log(user.rows)
//        return res.status('200').send(user)
//>>>>>>> main
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;