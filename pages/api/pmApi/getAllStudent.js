const { connect } = require("../../../utilities/db");
const { getAllStudent } = require('../controller/queries')

async function handler(req , res){

    try {
        const connection = await connect();
        const {
           major_id
          
        }=req.body;
        const response = await getAllStudent(connection , major_id);
       console.log(response.data)
        if(response.rows.length === 0){
            return res.status(404).json({
                success:false,
                code:404,
                message:"student Not found"
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