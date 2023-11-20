const { connect , disconnect} = require("../../../utilities/db");
const { updateGradesExED } = require("../controller/queries");


async function handler(req, res) {
  try {
    const connection = await connect();
    
    const { 
        table ,
        grades , 
        student_id ,
        course_id
    } =
      req.body;

 await updateGradesExED(
      connection,
      table ,
      grades , 
      student_id , 
      course_id
    );
 
  
    await disconnect(connection)   
      return res.status(201).json({
        success: true,
        code: 201,
        message: "Grade updated successfully",
      });
 
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}
module.exports = handler;
