const { connect } = require("../../../utilities/db");
const { getTeachersByMajorCourse } = require('../controller/queries')

async function handler(req , res){

    try {
        const connection = await connect();
        const {
           major_id
          
        }=req.body;
        const response = await getTeachersByMajorCourse(connection , major_id);
       
        if(response.rows.length === 0){
            return res.status(404).json({
                success:false,
                code:404,
                message:"teacher Not found"
            })
        }else{
            return res.status(201).json({
                success:true,
                code:201,
                data:response.rows
            })

        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            code:500,
            message: error.message
        })
    }
}
module.exports = handler;