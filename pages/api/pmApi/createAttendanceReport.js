const { connect } = require("../../../utilities/db");
const { createAttendance } = require('../controller/queries')

async function handler(req , res){

    try {
        const connection = await connect();
        const {
            
           teacher_id,
           course_id,
           major_id,
           attendance_date
        }=req.body;
        const response = await createAttendance(connection , teacher_id,
            course_id,
            major_id,
            attendance_date);
            console.log(response)
    
            return res.status(201).json({
                success:true,
                code:201,
                message : 'attendance create successfully',
            })

        
        } catch (error) {
        return res.status(500).json({
            success:false,
            code:500,
            message: error.message
        })
    }
}
module.exports = handler;