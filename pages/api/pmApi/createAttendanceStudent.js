const { connect ,disconnect} = require("../../../utilities/db");
const { createAttendanceStudent } = require('../controller/queries')

async function handler(req , res){

    try {
        const connection = await connect();
        const {
            
           attendance_id,
           student_id
        }=req.body;
        const response = await createAttendanceStudent(connection , student_id,attendance_id);
            // console.log(response)
            await disconnect(connection);
    
           return res.status(201).json({
            success:true,
            code:201,
            message:"Student Report Create Successfully",
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