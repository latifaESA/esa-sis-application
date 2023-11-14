import axios from "axios";
import dateFormatter from "../dateFormatter";
import timeFormatter from "../timeFormatter";
const sendMailClass = async () => {
  console.log("function triggered");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const todayFormattedDate = `${year}-${month}-${day}`;

  const asd = await axios.post(
    "http://localhost:3001/api/user/getSendMailInfo"
  );

  let allClasses = [];
  for (let i = 0; i < asd.data.rows.length; i++) {
    // console.log(`${i} course`, asd.rows[i].startdate);
    allClasses.push(asd.data.rows[i].course_id);
  }

  let stEmails = [];
  let startdate;
  let courseName;
  let teacherName;
  let class_id;
  let from_time = "00:00:00+02:00";
  let to_time = "00:00:00+02:00";
  let room_name = "";
  let building = "";
  for (let k = 0; k < allClasses.length; k++) {
    let sendData = {
      course_id: allClasses[k],
    };
    console.log("second axios");
    const searchForClassInfo = await axios.post(
      "http://localhost:3001/api/user/emailInfo",
      sendData
    );

    for (let f = 0; f < searchForClassInfo.data.rows.length; f++) {
      // console.log(searchForClassInfo.rows[f].email);
      stEmails.push(searchForClassInfo.data.rows[f].email);
      startdate = searchForClassInfo.data.rows[0].startdate;
      courseName = searchForClassInfo.data.rows[0].course_name;
      teacherName = `${searchForClassInfo.data.rows[0].teacher_firstname} ${searchForClassInfo.data.rows[0].teacher_lastname}`;
      class_id = searchForClassInfo.data.rows[0].tmpclass_id;
    }
    console.log("second axios done");
    let classInfo = {
      class_id: class_id,
    };
    const roomAndTime = await axios.post(
      "http://localhost:3001/api/user/getRoomAndTimeForSendMail",
      classInfo
    );
    // console.log("roomAndTime : ", roomAndTime.data.rows[0]);
    if (roomAndTime.data.rows[0] != undefined) {
      console.log("yes");
      console.log(roomAndTime.data.rows[0]);
      from_time = roomAndTime.data.rows[0].from_time;
      to_time = roomAndTime.data.rows[0].to_time;
      room_name = roomAndTime.data.rows[0].room_name;
      building = roomAndTime.data.rows[0].room_building;
    } else {
      console.log("no");
    }
    const inputDate = startdate; // Replace this with your actual date

    // Parse the input date into a Date object
    const dateParts = inputDate.split("-");
    const year1 = parseInt(dateParts[0], 10);
    const month1 = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
    const day1 = parseInt(dateParts[2], 10);
    const originalDate = new Date(year1, month1, day1);

    // Calculate the date 7 days before the input date
    const sevenDaysAgo = new Date(originalDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // console.log("all classes", allClasses);
    // Format the result as "YYYY-MM-DD"
    const formattedDateBeforeSeven = `${sevenDaysAgo.getFullYear()}-${String(
      sevenDaysAgo.getMonth() + 1
    ).padStart(2, "0")}-${String(sevenDaysAgo.getDate()).padStart(2, "0")}`;
    // if (todayFormattedDate == formattedDateBeforeSeven) {
    let sendData1 = {
      email: stEmails,
      className: allClasses[k],
      startdate: dateFormatter(startdate),
      courseName: courseName,
      teacherName: teacherName,
      from_time: from_time,
      to_time: to_time,
      room_name: room_name,
      building: building,
    };
    console.log(sendData1);

    const sendMailToSt = await axios.post(
      "http://localhost:3001/api/admin/adminApi/sendMailToSt",
      sendData1
    );

    console.log(sendMailToSt);

    // }

    stEmails = [];
    startdate = 0;
    from_time = "";
    to_time = "";
    room_name = "";
    building = "";
  }
};

export default sendMailClass;
