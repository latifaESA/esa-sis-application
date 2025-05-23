const { connect, disconnect } = require("../../../utilities/db");
const { updateSchedule, getAllById } = require("../controller/queries");
import axios from "axios";
const dotenv = require("dotenv");


dotenv.config(); // Assuming the .env file is in the root of your project
import moment from 'moment-timezone';
import SendEmail from "./emailUpdateScheduleContent";
const FormatTime = (timeWithTimeZone) => {
  const [time] = timeWithTimeZone.split('+'); // Remove the timezone offset
  const [hours, minutes] = time.split(':');
  const formattedHours = parseInt(hours) % 12 === 0 ? 12 : parseInt(hours) % 12;

  const period = parseInt(hours) < 12 ? 'AM' : 'PM';
  return `${formattedHours}:${minutes} ${period}`;
};

async function handler(req, res) {

  try {
    const connection = await connect();
    const {
      tmpscheduleID, classID, day,
      fromTime, toTime, room_id,
      pm_id, is_online, student,
      building, room_name,
      courseName,
      oldData } =
      req.body;
  // console.log('room id' , room_id)
    const classFilter = oldData.filter((sched) => sched.tmpschedule_id === tmpscheduleID)
    // console.log('----------------------classfilter---------------------------' , classFilter)
    const formattedDate = moment(day).format('DD-MM-YYYY');
    const formattedDateold = moment(classFilter[0].date).format('DD-MM-YYYY');
    const oldTeacher = classFilter[0].teacher
    const oldFromTime = FormatTime(classFilter[0].from)
    const oldToTime = FormatTime(classFilter[0].to)

    const oldDate = formattedDateold
    const oldIsOnline = classFilter[0].is_online
    const oldRoom = classFilter[0].room_name
    const oldBuilding = classFilter[0].room_building
    let table
    let colName
    let val
    table = 'tmpschedule'
    colName = 'tmpschedule_id'
    val = tmpscheduleID
    const data = await getAllById(connection, table, colName, val);
    //console.log('data', data)
    table = 'tmpclass'
    colName = 'tmpclass_id'
    val = data.rows[0].class_id
    const dataclass = await getAllById(connection, table, colName, val);
    //console.log('dataclass', dataclass)
    table = 'courses'
    colName = 'course_id'
    val = dataclass.rows[0].course_id
    const datacourse = await getAllById(connection, table, colName, val);
    //console.log('datacourse', datacourse)
    table = 'teachers'
    colName = 'teacher_id'
    val = dataclass.rows[0].teacher_id
    const datateacher = await getAllById(connection, table, colName, val);
    table = 'rooms'
    colName = 'room_id'
    val = room_id
    const dataroom = await getAllById(connection, table, colName, val);
    //console.log('datateacher', datateacher)
    const response = await updateSchedule(
      connection,
      classID,
      day,
      fromTime,
      toTime,
      room_id,
      pm_id,
      tmpscheduleID,
      is_online
    );

    
    let formate;
    // const fromTimeEmail = FormatTime(fromTime);
    // const ToTimeEmail = FormatTime(toTime);
   
    if (is_online === 'true') {
      formate = 'online';
    } else if (is_online === 'false') {
      formate = 'onsite';
    } else if (!is_online) {
      formate = 'onsite';
    } else {
      formate = 'online';
    }
    console.log('new', is_online, formate);

    let oldFormate;
    if (oldIsOnline === 'true') {
      oldFormate = 'online';
    } else if (oldIsOnline === 'false') {
      oldFormate = 'onsite';
    } else if (!oldIsOnline) {
      oldFormate = 'onsite';
    } else {
      oldFormate = 'online';
    }
    console.log('old', oldIsOnline, oldFormate === 'false');


    await disconnect(connection)
    // console.log(response)

    if (response.rowCount > 0) {
      
      for (const students of student) {
        try {
           await SendEmail(
            students.email,
            students.student_firstname,
            students.student_lastname,
            datacourse.rows[0].course_name,
            oldDate,
            oldFromTime,
            oldToTime,
            oldIsOnline,
            oldRoom,
            oldBuilding,
            oldTeacher,
            formate,
            oldFormate,
            formattedDate,
            oldFromTime,
            toTime,
            is_online,
            room_name,
            dataroom.rows[0].room_building,
            datateacher.rows[0].teacher_firstname,
            datateacher.rows[0].teacher_lastname
          );
        
          await axios.post(`${process.env.NEXTAUTH_URL}/api/pmApi/addNotification`, {
            receiverIds: [students.student_id],
            senderId: pm_id,
            content: `<!DOCTYPE html><html><head><title>Grades</title></head><body><div><div style="text-align: center;"></div></br><p>Dear <span style="font-weight: bold">${students.student_firstname} ${students.student_lastname}</span>,</p><p>We trust this email finds you well.</p> <p>We We would like to inform you of a necessary change to our ${courseName} schedule:</p><p>Previous Schedule:</p><p><ul><li>Date(s) and Time(s):${oldDate}/${oldFromTime} To ${oldToTime}</li>${oldIsOnline ? `` : `<li>Location:${oldRoom}-${oldBuilding}</li>`}<li>Professor:${oldTeacher}</li><li>Formate:${oldFormate}</li></ul></p><p>Update Schedule:</p><p><ul><li>Date(s) and Time(s):${formattedDate}/${fromTime} To ${toTime}</li>${is_online ? `` : `<li>Location:${room_name}-${building}</li>`}<li>Professor:${datateacher.rows[0].teacher_firstname} ${data.rows[0].teacher_lastname}</li><li>Formate:${formate}</li></ul></p><p>If you have any questions or concerns regarding these changes, please don't hesitate to contact your program manager.</p><p>Best regards,</p> <p>ESA Business School</p> '</div></body></html>`,
            subject: 'Updated Schedule',
          });
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }

      return res.status(201).json({
        success: true,
        code: 201,
        message: "Single Schedule updated successfully",
      });
    } else {
      return res.status(400).json({
        success: true,
        code: 400,
        message: "Single Schedule did not updated successfully",
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
