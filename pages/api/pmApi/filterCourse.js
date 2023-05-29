const { connect } = require("../../../utilities/db");
const { filterCourses } = require("../controller/queries");

// const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const connection = await connect();
        // filterStudent(connection, id, firstname, lastname, major, promotion, status);
        const {course_id, course_name, course_credit, major_id} = req.body;
        const data = await filterCourses(connection, course_id, course_name, course_credit, major_id);
        console.log('data.rows')
        console.log(data)
        console.log('data.rows')
        return res.status('200').send(data.rows)
        
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;