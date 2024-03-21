const { connect, disconnect } = require("../../../utilities/db");
const { teacherReport } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    const {teacher_id , pmMajor} =  req.body

    // console.log(major_id)
 
          const  response= await teacherReport(connection ,teacher_id , pmMajor);
   
   
    await disconnect(connection);
   
   
        
        if(response.rows.length>0){
            return res.status(200).json({
                success: true,
                code: 200,
                data: response.rows,
              });
        }else{
            return res.status(201).json({
                success: true,
                code: 201,
                message:`NO data Found`,
                data:response.rows
              });
            }


   
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}
export default handler;
