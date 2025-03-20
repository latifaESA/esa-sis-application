const SendEmailBeforeClass = require("./emailBeforeClassSchedule"); // Use require() for CommonJS
const { connect, disconnect } = require("../../../utilities/db");
const { getScheduleAttendance, getClass, getStudent, getData } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    const scheduleResult = await getScheduleAttendance(connection);

    if (!scheduleResult.rows.length) {
      await disconnect(connection);
      return res.status(200).json({
        code: 200,
        success: true,
        message: "No data available",
      });
    }

    const schedule = scheduleResult.rows[0];
    const classId = schedule.tmpclass_id;
    const teacherId = schedule.teacher_id;
    const courseId = schedule.course_id;

    // Fetch required details sequentially
    const courseDetails = await getData(connection, "courses", "course_id", courseId);
    const teacherDetails = await getData(connection, "teachers", "teacher_id", teacherId);
    const scheduleDetails = await getData(connection, "tmpschedule", "class_id", classId);

    // Fetch room details if available
    
      const roomDetails = await getData(connection, "rooms", "room_id", scheduleDetails.rows[0].room);
    
    

    // Fetch class attendance
    const classAttendance = await getClass(connection, classId);
    console.log('classAttendance' , classAttendance)
    if (!classAttendance.rows.length) {
      await disconnect(connection);
      return res.status(200).json({
        code: 200,
        success: true,
        message: "No attendance records found",
      });
    }

    const attendanceId = classAttendance.rows[0].attendance_id;
    const studentRecords = await getStudent(connection, attendanceId);

    // Send emails sequentially
    for (const studentRecord of studentRecords.rows) {
      const studentId = studentRecord.student_id;

      const student = await getData(connection, "student", "student_id", studentId);
      console.log('studemt' , student)
      const contact = await getData(connection, "user_contact", "userid", studentId);

      if (student && contact.rows.length > 0 && contact.rows[0].email) {
        await SendEmailBeforeClass(
          studentId,
          contact.rows[0].email,
          student.student_firstname,
          student.student_lastname,
          courseDetails,
          teacherDetails,
          roomDetails,
          scheduleDetails
        );
        await disconnect(connection);
        return res.status(200).json({
          code: 200,
          success: true,
          message: "Emails sent successfully",
        });
      }
    }



  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}

module.exports = handler; // Use module.exports for CommonJS
