// const { connect } = require("../../../utilities/db");
// const {teacherCourse} = require("../controller/queries");

// async function handler(req , res){

//     try {
//         const connection = await connect();
//         const {
//            courseId,
//            courseXId,
//            teacher_firstname,
//            teacher_lastname,
//         } = req.body;
        
//         const response = await teacherCourse(connection ,courseId ,courseXId,teacher_firstname , teacher_lastname);
//           if(response.rows.length === 0){
//             return res.status(404).json({
//                 success: false,
//                 code:404,
//                 message:`attendance not found`
//             })
//           }
//           else{
//              return res.status(201).json({
//                 success:true,
//                 code:201,
//                 data: response.rows
//              })
//           }
//     } catch (error) {
//         // console.log(message.error);
//         return res.status(500).json({
//             success:false,
//             code:500,
//             message: error.message
//         })
//     }
// }
// module.exports = handler;