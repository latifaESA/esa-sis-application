const { connect , disconnect} = require("../../../../utilities/db");
const { createTeacher } = require("../../controller/queries");



async function handler(req, res) {
  try {
    const connection = await connect();

    const { 
        teacher_id,
        teacher_firstname ,
        teacher_mail,
        teacher_lastname
     } = req.body;
    const response = await createTeacher(
      connection,
      teacher_id,
      teacher_firstname ,
        teacher_mail,
        teacher_lastname
    );
    console.log(response)
    await disconnect(connection)
    return res.status(201).json({
        success:true,
        code:201,
        message:"Teacher Create Successfully "
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
