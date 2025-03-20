import SendEmailBeforeClass from "./emailBeforeClassSchedule";

const { connect , disconnect} = require("../../../utilities/db");
const { getScheduleAttendance , getClass , getStudent, getData} = require('../controller/queries')

async function handler(req , res){
    try {
        const connection = await connect();
        const getSchedule = await getScheduleAttendance(connection)
        const ClassId = getSchedule.rows[0].tmpclass_id
        const teacherId = getSchedule.rows[0].teacher_id
        const courseId = getSchedule.rows[0].course_id
        const courseDetails = await getData(connection , 'courses' , 'course_id' , courseId)
        const teacherDetails = await getData(connection , 'teacher' , 'teacher_id' , teacherId)
        const scheduleDetails = await getData(connection , 'tmpschedule' , 'class_id' , ClassId)
        const roomId = scheduleDetails.rows[0].roomId
        const roomDetails = getData(connection , 'rooms' , 'room_id' , roomId)

        const getAttendance = await getClass(connection , ClassId)
        const attendanceId = getAttendance.rows[0].attendance_id
        const getStudentData = await getStudent(connection , attendanceId)
        await Promise.all(
            getStudentData.map(async (id) => {
              const student = await getData(connection, "student", "student_id", id);
                const contactStudent = await getData(connection , 'user_contact' , 'userid' , id)
              if (student && contactStudent.rows[0].email) {
                
                await SendEmailBeforeClass( student.student_id, contactStudent.rows[0].email, student.student_firstname , student.student_lastname , courseDetails , teacherDetails , roomDetails , scheduleDetails);
              }
            })
          );

         await disconnect(connection)
         return res.status(200).json({
            code:200,
            success:true,
            message:'schedule success'
         })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: error.message
        });
    }
}
export default handler;