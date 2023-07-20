/*
 * Created By: Ali Mroueh
 * Project: SIS Application
 * File: pages\api\controller\queries.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import { executeQuery } from "../../../utilities/db";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
// const { executeQuery } = require('../../../utilities/db');

// async function current_applicant_promotion(major_id, user_id, connection) {
//   try {
//     let [result] = await executeQuery(
//       connection,
//       'select major.current_applicants_promotion from major inner join user_profile where user_profile.major=major.major_id and major.major_id=? and user_profile.user_id=?',
//       [major_id, user_id]
//     );
//     return result;
//   } catch (err) {
//     return err;
//   }
// }

/* Start Postegresql */
/**
 * It finds Data from the databasevand returns true or false
 * </code>
 */
// async function findData(connection, name, table, value) {
//   try {
//     const [result] = await executeQuery(
//       connection,
//       `select max(if(${name}=?,true,false)) AS result from ${table}`,
//       [value]
//     );

//     return result;
//   } catch (err) {
//     return err;
//   }
// }
// const results = await new Promise((resolve, reject) => {
//   connection.query(`SELECT * from users WHERE userid = ${credentials.email}`, (err, res) => {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(res.rows);
//     }
//   });
// });

async function findDataForResetPassword(connection, table, where, columnName) {
  try {
    let result =
      connection.query(`SELECT users.*, user_contact.email from ${table} 
    LEFT JOIN user_contact ON user_contact.userid = users.userid WHERE ${where} = '${columnName}'`);
    return result;
  } catch (err) {
    return err;
  }
}

async function findData(connection, table, where, columnName) {
  try {
    let result = connection.query(
      `SELECT * from ${table} WHERE ${where} = '${columnName}'`
    );
    return result;
  } catch (err) {
    return err;
  }
}

async function newEmailToken(connection, userid) {
  let emailToken = crypto.randomBytes(64).toString("hex");
  try {
    let query = `
    UPDATE users
    SET token = '${emailToken}'
    WHERE userid = '${userid}'`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

async function UpdateToken(connection, emailToken) {
  try {
    let UserData = await executeQuery(
      connection,
      "UPDATE users set token=null where token=?;",
      [emailToken]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}

async function Userinfo(connection, email) {
  try {
    let result = connection.query(`SELECT users.*, user_contact.* from users 
    LEFT JOIN user_contact ON
	user_contact.userid = users.userid WHERE user_contact.email = '${email}'`);
    return result;
  } catch (err) {
    return err;
  }
}

async function newpassword(connection, email, newPassword) {
  let password = bcryptjs.hashSync(newPassword);
  try {
    let query = `
    UPDATE users
    SET userpassword = '${password}'
    WHERE userid = '${email}'`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

async function getCourseMajor(connection) {
  try {
    let result =
      connection.query(`SELECT courses.course_id, courses.course_name, courses.course_credit, COALESCE(major.major_name, '') AS major_name
    FROM courses
    LEFT JOIN major ON courses.major_id = major.major_id;`);
    return result;
  } catch (error) {
    return error;
  }
}
// course
async function updateCourse(connection, course_id, major_name) {
  try {
    let result = connection.query(`UPDATE courses
    SET major_id = (
      SELECT major_id
      FROM major
      WHERE major_name = '${major_name}'
    )
    WHERE course_id = '${course_id}'`);
    return result;
  } catch (error) {
    return error;
  }
}

// Create Class
async function createClass(
  connection,
  course_id,
  teacher_id,
  promotion,
  startdate,
  enddate,
  pm_id,
  major_id
) {
  try {
    const query = ` INSERT INTO tmpclass (course_id , teacher_id, promotion, startdate, enddate, pm_id, major_id) VALUES ('${course_id}','${teacher_id}','${promotion}','${startdate}','${enddate}', '${pm_id}', '${major_id}') `;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}

// Copy Class
async function copyClass(
  connection,
  course_id,
  teacher_id,
  promotion,
  startdate,
  enddate,
  pm_id,
  major_id
) {
  try {
    const query = ` INSERT INTO tmpclass (course_id , teacher_id, promotion, startdate, enddate, pm_id, major_id) VALUES ('${course_id}','${teacher_id}','${promotion}','${startdate}','${enddate}', '${pm_id}', '${major_id}') 
    RETURNING tmpclass_id;`;
    const res = await connection.query(query);
    return res.rows[0].tmpclass_id;
  } catch (error) {
    return error;
  }
}

async function insertPromotion(connection, table, columns, values) {
  try {
    const columnList = columns.join(", ");
    const valueList = values.map((val) => `'${val}'`).join(", ");
    const result = await connection.query(
      `INSERT INTO ${table} (${columnList}) VALUES (${valueList}) 
      ON CONFLICT (promotion_name) DO NOTHING`
    );
    return result;
  } catch (err) {
    return err;
  }
}

// Create Schedule
// async function createSchedule(connection,class_id,day,from_time,to_time){
//   try {
//     const query = `INSERT INTO tmpschedule (class_id, day, from_time, to_time)
//     VALUES (${class_id}, ARRAY[${day}], '${from_time}', '${to_time}')`;
//     const res = await connection.query(query);
//     return res;
//   } catch (error) {
//     return error;
//   }
// }

// async function createSchedule(connection, class_id, day, from_time, to_time,room) {
//   try {
//     const query = `INSERT INTO tmpschedule (class_id, day, from_time, to_time, room)
//     VALUES ($1, $2, $3, $4, $5)`;
//     const values = [class_id, day, from_time, to_time, room];
//     const res = await connection.query(query, values);
//     return res;
//   } catch (error) {
//     return error;
//   }
// }

async function createSchedule(
  connection,
  classId,
  days,
  fromTime,
  toTime,
  room,
  pmID
) {
  try {
    let res = null;
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const query = `
        INSERT INTO tmpschedule (class_id, day, from_time, to_time, room, pm_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      res = await connection.query(query, [
        classId,
        day,
        fromTime,
        toTime,
        room,
        pmID,
      ]);
    }
    return res;
  } catch (error) {
    return error;
  }
}

// GET course based on course_id and major_name
async function filterCourseMajor(connection, course_id, major_name) {
  try {
    let query = `
    SELECT c.course_id, c.course_name, c.course_credit, m.major_name
    FROM courses c
    LEFT JOIN major m ON c.major_id = m.major_id
    WHERE 
      (c.course_id = '${course_id}' OR '${course_id}' = '') 
      AND
      (m.major_name = '${major_name}' OR '${major_name}' = '') 
      AND
      (m.major_name != '' OR c.major_id IS NULL);
    ;`;
    const result = await connection.query(query);
    return result;
    // return `couse id: ${course_id} major name: ${major_name}`
  } catch (err) {
    return err;
  }
}

// eslint-disable-next-line no-unused-vars
async function UpdateData(connection, table, whereValue, ...columnValuePairs) {
  // try {
  //   let query = `UPDATE ${table} SET `;
  //   let values = [];
  //   columnValuePairs.forEach((pair, index) => {
  //     query += `${pair[0]} = ?`;
  //     if (index !== columnValuePairs.length - 1) {
  //       query += ', ';
  //     }
  //     values.push(pair[1]);
  //   });
  //   query += ` WHERE user_id= ?`;
  //   values.push(whereValue);
  //   const result = await executeQuery(connection, query, values);
  //   return result;
  // } catch (err) {
  //   return err;
  // }
}

// eslint-disable-next-line no-unused-vars
async function UpdateActivityTime(userid, connection) {
  // try {
  //   const result = await executeQuery(
  //     connection,
  //     'UPDATE users SET users.update_time = CURRENT_TIMESTAMP WHERE userid = ?',
  //     [userid]
  //   );
  //   return result;
  // } catch (err) {
  //   return err;
  // }
}

// insert to the database as much as you like columns and values
async function insertData(connection, table, columns, values) {
  try {
    const columnList = columns.join(", ");
    const valueList = values.map((val) => `'${val}'`).join(", ");
    const result = await connection.query(
      `INSERT INTO ${table} (${columnList}) VALUES (${valueList})`
    );
    return result;
  } catch (err) {
    return err;
  }
}

// get all data from specific column
async function getAll(connection, table) {
  try {
    const result = connection.query(`SELECT * from ${table}`);
    return result;
  } catch (err) {
    return err;
  }
}

// get all data from specific column
async function getAllById(connection, table, colName, val) {
  try {
    const result = connection.query(
      `SELECT * from ${table} Where ${colName} = '${val}' `
    );
    return result;
  } catch (err) {
    return err;
  }
}

// get schedule based on class_id
async function getScheduleByPM(connection, pmID) {
  try {
    const result = connection.query(`
  SELECT
  tmpschedule.*,
  courses.*,
  teachers.*,
  rooms.*
  FROM
    tmpschedule
  JOIN
    tmpclass ON tmpclass.tmpclass_id = tmpschedule.class_id
  JOIN
    courses ON courses.course_id = tmpclass.course_id
  JOIN
    teachers ON teachers.teacher_id = tmpclass.teacher_id
  JOIN 
    rooms ON rooms.room_id = tmpschedule.room
  WHERE
    tmpclass.pm_id = '${pmID}';
    `);
    return result;
  } catch (err) {
    return err;
  }
}

// delete
async function deleteByID(connection, table, colName, id) {
  try {
    const result = connection.query(
      `Delete FROM ${table} WHERE ${colName} = ${id}`
    );
    return result;
  } catch (error) {
    return error;
  }
}

// Add Schedule
async function addSchedule(
  connection,
  classID,
  day,
  fromTime,
  toTime,
  room_id,
  pm_id
) {
  try {
    // classID, day, fromTime, toTime, room_id, pm_id
    const result = connection.query(
      `INSERT INTO tmpschedule (day, from_time, to_time, room, pm_id,class_id) VALUES ('${day}','${fromTime}','${toTime}', ${room_id}, '${pm_id}' , ${classID})`
    );
    return result;
  } catch (error) {
    return error;
  }
}

// copy Schedule
async function copySchedule(connection, classID, newClassID) {
  try {
    // classID, day, fromTime, toTime, room_id, pm_id
    const query = `INSERT INTO tmpschedule (class_id, day, from_time, to_time, room, pm_id)
    SELECT $1, to_char(day::date + INTERVAL '1 year', 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS day, from_time, to_time, room, pm_id
    FROM tmpschedule
    WHERE class_id = ${classID};`;
    const classId = newClassID;
    let res = await connection.query(query, [classId]);

    return res;
  } catch (error) {
    return error;
  }
}
// update Schedule
async function updateSchedule(
  connection,
  classID,
  day,
  fromTime,
  toTime,
  room_id,
  pm_id,
  tmpscheduleID
) {
  try {
    const query =
      "UPDATE tmpschedule SET class_id = $1, day = $2, from_time = $3, to_time = $4, room = $5, pm_id = $6 WHERE tmpschedule_id = $7";
    const values = [
      classID,
      day,
      fromTime,
      toTime,
      room_id,
      pm_id,
      tmpscheduleID,
    ];
    const res = await connection.query(query, values);
    return res;
  } catch (error) {
    return error;
  }
}

// filter search of student
// async function filterStudent(connection, id, firstname, lastname, major, promotion, status){
//   try{
//     const result = connection.query(`SELECT * from student WHERE student_id = '${id}' AND student_firstname = '${firstname}' AND student_lastname = '${lastname}' AND major_id = ${major} AND promotion = '${promotion}' AND status ='${status}'`)
//     return result;
//   }catch(err){
//     return err
//   }
// }
// async function filterStudent(connection, id, firstname, lastname, major, promotion, status) {
//   try {
//     let query = `SELECT * FROM student WHERE 1=1`;

//     if (id != 'all') {
//       query += ` AND lower(trim(student_id)) LIKE lower(trim('%${id}%'))`;
//     }
//     if (firstname != 'all') {
//       query += ` AND lower(trim(student_firstname)) LIKE lower(trim('%${firstname}%'))`;
//     }
//     if (lastname != 'all') {
//       query += ` AND lower(trim(student_lastname)) LIKE lower(trim('%${lastname}%'))`;
//     }
//     if (major != 'all') {
//       query += ` AND major_id = ${major}`;
//     }
//     if (promotion != 'all') {
//       query += ` AND promotion = '${promotion}'`;
//     }
//     if (status != 'all') {
//       query += ` AND status = '${status}'`;
//     }

//     const result = await connection.query(query);
//     return result;
//   } catch (err) {
//     return err;
//   }
// }

async function filterStudent(
  connection,
  id,
  firstname,
  lastname,
  major,
  promotion,
  status
) {
  try {
    let query = `
      SELECT student.*, major.major_name, user_contact.email, user_contact.mobile_number
      FROM student
      LEFT JOIN major ON student.major_id = major.major_id
      LEFT JOIN user_contact ON student_id = user_contact.userid
      WHERE 1=1`;

    if (id.trim() != "") {
      query += ` AND lower(trim(student_id)) LIKE lower(trim('%${id}%'))`;
    }
    if (firstname.trim() != "") {
      query += ` AND lower(trim(student_firstname)) LIKE lower(trim('%${firstname}%'))`;
    }
    if (lastname.trim() != "") {
      query += ` AND lower(trim(student_lastname)) LIKE lower(trim('%${lastname}%'))`;
    }
    if (major != "") {
      query += ` AND major.major_name = ${major}`;
    }
    if (promotion.trim() != "") {
      query += ` AND promotion = '${promotion}'`;
    }
    if (status.trim() != "") {
      query += ` AND status = '${status}'`;
    }
    // if (phoneNumber.trim() != '') {
    //   query += ` AND user_contact.mobile_number = '${phoneNumber}'`;
    // }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

async function filterTeacher(
  connection,
  id,
  firstname,
  lastname,
  email,
  courseid
) {
  try {
    let query = `
      SELECT * FROM teachers
      WHERE 1=1`;

    if (id != "") {
      query += ` AND teacher_id = '${id}'`;
    }
    if (firstname.trim() != "") {
      query += ` AND lower(trim(teacher_firstname)) LIKE lower(trim('%${firstname}%'))`;
    }
    if (lastname.trim() != "") {
      query += ` AND lower(trim(teacher_lastname)) LIKE lower(trim('%${lastname}%'))`;
    }
    if (email != "") {
      query += ` AND lower(trim(teacher_mail)) LIKE lower(trim('%${email}%'))`;
    }
    if (courseid.trim() != "") {
      query += ` AND lower(trim(course_id)) LIKE lower(trim('%${courseid}%'))'`;
    }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

// get the user and the teacher info
async function getUserTeacher(connection, pmID) {
  try {
    let query = `SELECT 
    tmpclass.*, 
    teachers.*
    FROM 
    tmpclass
    JOIN
    teachers ON teachers.teacher_id = tmpclass.teacher_id
    WHERE 
    pm_id = '${pmID}'
    `;
    const result = await connection.query(query);
    return result;
  } catch (error) {
    return error;
  }
}
//<<<<<<< batoul
//async function ReadDropdown(connection, table) {
//  try {
//    const query = `SELECT * FROM ${table}`;
//    const result = await executeQuery(connection, query, []);
//=======

async function filterCourses(
  connection,
  course_id,
  course_name,
  course_credit,
  major_id
) {
  try {
    let query = `
    SELECT courses.*, major.major_name
    FROM courses
    LEFT JOIN major ON courses.major_id = major.major_id
    WHERE 1=1`;

    if (course_id != "") {
      query += ` AND lower(trim(course_id)) LIKE lower(trim('%${course_id}%'))`;
    }
    if (course_name.trim() != "") {
      query += ` AND lower(trim(course_name)) LIKE lower(trim('%${course_name}%'))`;
    }
    if (course_credit != "") {
      query += ` AND courses.course_credit = ${course_credit}`;
    }
    if (major_id != "") {
      query += ` AND courses.major_id = ${major_id}`;
    }

    const result = await connection.query(query);
    console.log(result);
    return result;
  } catch (err) {
    return err;
  }
}
async function getAllCourses(connection, course_id, major_id) {
  // console.log(course_id)

  try {
    const query = `SELECT * FROM courses WHERE course_id ='${course_id}' AND major_id='${major_id}'`;
    const res = connection.query(query);

    return res;
  } catch (error) {}
}
//filter attendance
async function filterAttendances(
  connection,
  attendance_id,
  teacher_id,
  major_id,
  course_id,
  attendance_date,
  present,
  teacher_firstname,
  teacher_lastname,
  major_name
) {
  try {
    let query = `SELECT attendance_report .* ,  major.major_name , teachers.teacher_firstname , teachers.teacher_lastname ,courses.course_name
    FROM attendance_report
    INNER JOIN teachers ON attendance_report.teacher_id = teachers.teacher_id
    INNER JOIN major ON attendance_report.major_id = major.major_id 
    INNER JOIN courses ON attendance_report.course_id = courses.course_id
    WHERE 1=1  
    `;

    if (attendance_id != "") {
      query += ` AND attendance_id = '${attendance_id}'`;
    }
    if (teacher_id != "") {
      query += ` AND teachers.teacher_id = '${teacher_id}'`;
    }
    if (teacher_firstname) {
      query += ` AND lower(trim(teachers.teacher_firstname)) LIKE lower(trim('%${teacher_firstname}%')) `;
    }
    if (teacher_lastname) {
      query += ` AND lower(trim(teachers.teacher_lastname)) LIKE lower(trim('%${teacher_lastname}%'))`;
    }
    if (major_id != "") {
      query += ` AND major.major_id= '${major_id}'`;
    }
    if (major_name) {
      query += ` AND lower(trim(major.major_name) LIKE lower(trim('%${major_name}%'))`;
    }
    if (course_id != "") {
      query += ` AND lower(trim(course_id)) LIKE lower(trim('%${course_id}%'))`;
    }
    if (attendance_date != "") {
      query += ` AND attendance_date = '${attendance_date}'`;
    }
    if (present != "") {
      query += ` AND present = '${present}'  `;
    }

    const res = await connection.query(query);

    return res;
  } catch (error) {
    return error;
  }
}

async function getCourse(connection, table, where, id) {
  try {
    let query = `SELECT * FROM ${table} WHERE ${where}='${id}'`;
    const response = await connection.query(query);
    return response;
  } catch (error) {
    return error;
  }
}
// get course_id in table teacher_courses use in function exist

async function getExistCourse(connection, course_id, teacher_idC, major_id) {
  try {
    let query = `SELECT teacher_courses .*  , courses.major_id FROM teacher_courses 
    INNER JOIN courses ON  teacher_courses.course_id = courses.course_id
    WHERE teacher_courses.course_id ='${course_id}' AND  teacher_courses.teacher_id='${teacher_idC}' AND major_id='${major_id}'`;
    const res = await connection.query(query);
    // console.log('res', res)

    // console.log('query',query)
    return res;
  } catch (error) {
    return error;
  }
}

async function getTeachersByMajorCourse(connection, major_id) {
  try {
    let query = `SELECT  teachers.teacher_id ,concat(teachers.teacher_firstname ,' ', teachers.teacher_lastname) AS teacher_fullname 
    from teachers 
    `;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function getTeachersCourses(connection, teacher_id, course_id, major_id) {
  try {
    const query = `SELECT teacher_courses .* , courses.major_id FROM teacher_courses
    INNER JOIN courses ON teacher_courses.course_id = courses.course_id
    WHERE teacher_id='${teacher_id}' AND teacher_courses.course_id ='${course_id}' AND major_id='${major_id}'`;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}

async function updatePresent(connection, present, student_id, attendance_id) {
  console.log(attendance_id);
  try {
    const query = `UPDATE attendance SET present = ${present} WHERE student_id = '${student_id}' AND attendance_id = '${attendance_id}'`;
    const res = await connection.query(query);

    return res;
  } catch (error) {
    return error;
  }
}

async function getAllStudent(connection, major_id, promotion) {
  try {
    const query = `SELECT * FROM student WHERE major_id = '${major_id}' AND (trim(promotion)) = '${promotion}'`;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
//insert data to attendance_table
async function createAttendanceStudent(connection, student_id, attendance_id) {
  try {
    const query = `INSERT INTO attendance (attendance_id , student_id) 
    VALUES ('${attendance_id}' , '${student_id}')`;
    const res = await connection.query(query);
    // console.log("[[[[[[[[[[[[[[[",res.lastrowid)
    return res;
  } catch (error) {
    return error;
  }
}
//select
async function createAttendance(
  connection,
  teacher_id,
  course_id,
  major_id,
  attendance_date
) {
  try {
    const query = ` INSERT INTO attendance_report (teacher_id , course_id , major_id, attendance_date) VALUES ('${teacher_id}','${course_id}','${major_id}','${attendance_date}') RETURNING attendance_id `;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function AttendanceView(connection, attendance_id) {
  try {
    const query = ` SELECT attendance .* ,  student.student_firstname , student.student_lastname, courses.course_name
    FROM attendance 
    INNER JOIN student ON attendance.student_id = student.student_id 
	  INNER JOIN attendance_report ON attendance.attendance_id = attendance_report.attendance_id
	  INNER JOIN courses ON attendance_report.course_id = courses.course_id
    WHERE attendance.attendance_id = '${attendance_id}'`;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function getAttendanceByCTD(
  connection,
  teacher_id,
  course_id,
  attendance_date
) {
  try {
    const query = `SELECT * FROM attendance_report 
    WHERE teacher_id = '${teacher_id}' AND course_id = '${course_id}' AND attendance_date = '${attendance_date}'`;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function filterpm(
  connection,
  pm_id,
  pm_firstname,
  pm_lastname,
  pm_email,
  pm_status
) {
  try {
    let query = `
      SELECT * FROM program_manager
      WHERE 1=1`;

    if (pm_id != "") {
      query += ` AND lower(trim(pm_id)) LIKE lower(trim('%${pm_id}%'))`;
    }
    if (pm_firstname.trim() != "") {
      query += ` AND lower(trim(pm_firstname)) LIKE lower(trim('%${pm_firstname}%'))`;
    }
    if (pm_lastname.trim() != "") {
      query += ` AND lower(trim(pm_lastname)) LIKE lower(trim('%${pm_lastname}%'))`;
    }
    if (pm_email != "") {
      query += ` AND lower(trim(pm_email)) LIKE lower(trim('%${pm_email}%'))`;
    }
    if (pm_status.trim() != "") {
      query += ` AND program_manager.pm_status = '${pm_status}'`;
    }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function filterassistance(
  connection,
  pm_ass_id,
  pm_ass_firstname,
  pm_ass_lastname,
  pm_ass_email,
  pm_ass_status
) {
  try {
    let query = `
      SELECT * FROM program_manager_assistance
      WHERE 1=1`;

    if (pm_ass_id.trim() != "") {
      query += ` AND lower(trim(pm_ass_id)) LIKE lower(trim('%${pm_ass_id}%'))`;
    }
    if (pm_ass_firstname.trim() != "") {
      query += ` AND lower(trim(pm_ass_firstname)) LIKE lower(trim('%${pm_ass_firstname}%'))`;
    }
    if (pm_ass_lastname.trim() != "") {
      query += ` AND lower(trim(pm_ass_lastname)) LIKE lower(trim('%${pm_ass_lastname}%'))`;
    }
    if (pm_ass_email != "") {
      query += ` AND lower(trim(pm_ass_email)) LIKE lower(trim('%${pm_ass_email}%'))`;
    }
    if (pm_ass_status.trim() != "") {
      query += ` AND program_manager_assistance.pm_ass_status = '${pm_ass_status}'`;
    }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function updateStatusPM(connection, pm_id, pm_status) {
  try {
    let query = `
    UPDATE program_manager
    SET pm_status = '${pm_status}'
    WHERE pm_id = '${pm_id}'`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function updateStatusAssistance(connection, pm_ass_id, pm_ass_status) {
  try {
    let query = `
    UPDATE program_manager_assistance
    SET pm_ass_status = '${pm_ass_status}'
    WHERE pm_ass_id = '${pm_ass_id}'`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

// //filter attendance
// async function filterAttendance( connection,student_id , teacher_id , major_id , course_id , attendance_date , present){
//   try {
//     let sql = 'select * from attendance WHERE 1=1';
//     if(student_id != ''){
//         sql  += `AND student_id = '${student_id}'`;
//     }
//     if(teacher_id !=''){
//       sql += `AND teacher_id = '${teacher_id}'`;
//     }
//     if(major_id != ''){
//       sql += `AND major_id = '${major_id}'`;
//     }
//     if(course_id != ''){
//       sql += `AND course_id = '${course_id}'`;
//     }
//     if(attendance_date != ''){
//       sql += `AND attendance_date = '${attendance_date}'`;
//     }
//     if(present != ''){
//       sql += `AND present = ${present}`
//     }
//     const res = await connection.query(sql);
//     return res;
//   } catch (error) {
//     return error
//   }
// }

async function enableUserpm(connection, pm_id, userpassword) {
  try {
    let query = `
      INSERT INTO users(userid ,role , userpassword)
        VALUES('${pm_id}', 2, '${userpassword}')`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function enableUserAs(connection, pm_ass_id, userpassword) {
  try {
    let query = `
      INSERT INTO users(userid ,role , userpassword)
        VALUES('${pm_ass_id}', 3, '${userpassword}')`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function deleteUserpm(connection, pm_id) {
  try {
    let query = `
    DELETE FROM users
    WHERE userid = '${pm_id}'`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
//filter teacher-course

async function teacherCourse(
  connection,
  teacher_id,
  course_id,
  teacher_firstname,
  teacher_lastname,
  course_name,
  major_id
) {
  // console.log(course_id)
  try {
    //<<<<<<< Hassan
    //    let query = `SELECT teachers.* , teacher_extra_course.course_id
    //    from teachers
    //    INNER JOIN teacher_extra_course ON teachers.teacher_id = teacher_extra_course.teacher_id
    //   where 1=1`;
    //   if (teacher_firstname.trim() != "") {
    //     query += ` AND lower(trim(teacher_firstname)) LIKE lower(trim('%${teacher_firstname}%'))`;
    //   }
    //   if (teacher_lastname.trim() != "") {
    //     query += ` AND lower(trim(teacher_lastname)) LIKE lower(trim('%${teacher_lastname}%'))`;
    //   }
    //   if (course_id.trim() != "") {
    //     query += ` AND lower(trim(course_id)) LIKE lower(trim('%${course_id}%'))`;
    //   }
    //   if (courseex_id.trim() != "") {
    //     query += ` AND lower(trim(teacher_extra_course.course_id)) LIKE lower(trim('%${courseex_id}%'))`;
    //=======
    let query = `SELECT teacher_courses.* , teachers.teacher_firstname,teachers.teacher_lastname , courses.course_name,courses.major_id , courses.major_id
    from teacher_courses 
    INNER JOIN teachers ON teacher_courses.teacher_id = teachers.teacher_id
	INNER JOIN courses ON teacher_courses.course_id = courses.course_id
    where courses.major_id= '${major_id}'`;
    if (teacher_id.trim() != "") {
      query += ` AND lower(trim(teacher_courses.teacher_id)) LIKE lower(trim('%${teacher_id}%'))`;
    }
    if (course_id.trim() != "") {
      query += ` AND lower(trim(teacher_courses.course_id)) LIKE lower(trim('%${course_id}%'))`;
    }
    if (teacher_firstname.trim() != "") {
      query += ` AND lower(trim(teachers.teacher_firstname)) LIKE lower(trim('%${teacher_firstname}%'))`;
    }
    if (teacher_lastname.trim() != "") {
      query += ` AND lower(trim(teachers.teacher_lastname)) LIKE lower(trim('%${teacher_lastname}%'))`;
    }

    if (course_name.trim() != "") {
      query += ` AND lower(trim(courses.course_name)) LIKE lower(trim('%${course_name}%'))`;
      //>>>>>>> main
    }
    const res = await connection.query(query);
    // console.log(query);
    return res;
  } catch (error) {
    return error;
  }
}
//get Schedule by major and promotion to each student
async function getScheduleToStudents(connection, major_id, promotion) {
  try {
    const query = `SELECT tmpschedule.*,tmpclass.promotion ,tmpclass.major_id  , tmpclass.teacher_id , tmpclass.course_id , rooms.room_name,
    rooms.room_building,
     courses.course_name , concat(teachers.teacher_firstname , '' , teachers.teacher_lastname) AS teacher_fullname FROM tmpschedule 
     INNER JOIN tmpclass ON tmpschedule.class_id = tmpclass.tmpclass_id
   INNER JOIN rooms ON  tmpschedule.room = rooms.room_id
     INNER JOIN courses ON tmpclass.course_id = courses.course_id
     INNER JOIN teachers ON tmpclass.teacher_id = teachers.teacher_id
     WHERE tmpclass.major_id = '${major_id}' AND (trim(tmpclass.promotion)) = '${promotion}'`;
    const result = await connection.query(query);
    return result;
  } catch (error) {
    return error;
  }
}
//unassign teacher to course

async function unassign(connection, teacher_id, course_id) {
  try {
    const query = `DELETE FROM teacher_courses WHERE teacher_id ='${teacher_id}' AND course_id = '${course_id}'`;

    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
// update query to upload url
async function uploadFile(connection, Url, attendance_id) {
  try {
    const query = `UPDATE attendance_report SET url='${Url}' WHERE attendance_id ='${attendance_id}'`;
    const res = await connection.query(query);
    console.log(query);
    return res;
  } catch (error) {
    return error;
  }
}
//update teacher
async function updateAssign(connection, teacher_id, course_id, condition) {
  // console.log('query' , query)
  try {
    const query = `UPDATE teacher_courses SET teacher_id = '${teacher_id}' WHERE course_id = '${course_id}' AND teacher_id='${condition}' RETURNING teacher_courses_id`;
    const res = await connection.query(query);
    // console.log('query' , query)
    return res;
  } catch (error) {
    return error;
  }
}
// assignment  course to teacher

async function assignmentTeacherCourse(connection, course_id, teacher_id) {
  try {
    const query = `INSERT INTO teacher_courses(teacher_id , course_id) VALUES ('${teacher_id}','${course_id}') RETURNING teacher_courses_id `;
    const res = await connection.query(query);
    // console.log("add",query)
    return res;
  } catch (error) {
    return error;
  }
}
//get teacher by id of courses
async function coursesTeachers(connection, course_id) {
  try {
    const query = `SELECT teacher_courses.* , concat(teachers.teacher_firstname, ' ', teachers.teacher_lastname) AS teacher_fullName 
    FROM teacher_courses 
    INNER JOIN teachers ON teacher_courses.teacher_id = teachers.teacher_id WHERE course_id = '${course_id}'
    `;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
//attendance details
async function AttendanceDetails(connection, attendance_id) {
  try {
    const query = `SELECT attendance_report.* , teachers.teacher_firstname , teachers.teacher_lastname , courses.course_name
    FROM attendance_report 
    INNER JOIN teachers ON attendance_report.teacher_id = teachers.teacher_id 
    INNER JOIN courses  ON attendance_report.course_id = courses.course_id
    WHERE attendance_id = '${attendance_id}'
    `;
    const res = await connection.query(query);

    return res;
  } catch (error) {
    return error;
  }
}
//get student fullname and promotion by attendance_id
async function getStudentPromotion(connection, attendance_id, promotion) {
  try {
    const query = `SELECT attendance .* , concat(student_firstname ,' ',student_lastname) AS student_fullname 
    from attendance 
    INNER JOIN student ON attendance.student_id = student.student_id
    WHERE attendance_id = '${attendance_id}' AND student.promotion= '${promotion}'`;
    const res = await connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function getAllMajor(connection) {
  try {
    let query = `
      SELECT major_name, major_id FROM major`;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
//create courses
async function createCourse(
  connection,
  course_id,
  course_name,
  course_credit,
  major_id,
  course_type
) {
  // console.log(major_id)

  try {
    const query = `INSERT INTO courses (course_id , course_name , course_credit , major_id , course_type) VALUES ('${course_id}','${course_name}',${course_credit},${major_id} , '${course_type}')`;
    const res = connection.query(query);
    return res;
  } catch (error) {
    return error;
  }
}
async function createPMAccount(
  connection,
  pm_id,
  pm_firstname,
  pm_lastname,
  pm_email,
  pm_status,
  userpassword,
  major_id
) {
  try {
    let query = `
    insert into program_manager(pm_id, pm_firstname, pm_lastname, pm_email, pm_status, major_id)
    values ('${pm_id}', '${pm_firstname}', '${pm_lastname}', '${pm_email}', '${pm_status}', '${major_id}') on conflict (pm_id) do nothing
    RETURNING CASE
    WHEN pm_id = '${pm_id}' THEN 'ID already exists'
    ELSE 'Conflict occurred'
    END AS message; 
    insert into users(userid, role, userpassword)
    values ('${pm_id}', '2', '${userpassword}') on conflict (userid) do nothing;

    INSERT INTO user_document(userid)
      VALUES('${pm_id}') on conflict (userid) do nothing
      RETURNING CASE
      WHEN userid = '${pm_id}' THEN 'ID already exists'
      ELSE 'Conflict occurred'
      END AS message; 
    `;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function createASAccount(
  connection,
  pm_ass_id,
  pm_ass_firstname,
  pm_ass_lastname,
  pm_ass_email,
  pm_ass_status,
  userpassword,
  major_id
) {
  try {
    let query = `
    insert into program_manager_assistance(pm_ass_id, pm_ass_firstname, pm_ass_lastname, pm_ass_email, pm_ass_status, major_id)
    values ('${pm_ass_id}', '${pm_ass_firstname}', '${pm_ass_lastname}', '${pm_ass_email}', '${pm_ass_status}', '${major_id}') on conflict (pm_ass_id) do nothing
    RETURNING CASE
    WHEN pm_ass_id = '${pm_ass_id}' THEN 'ID already exists'
    ELSE 'Conflict occurred'
    END AS message; 
    insert into users(userid, role, userpassword)
    values ('${pm_ass_id}', '3', '${userpassword}') on conflict (userid) do nothing;

    INSERT INTO user_document(userid)
      VALUES('${pm_ass_id}') on conflict (userid) do nothing
      RETURNING CASE
      WHEN userid = '${pm_ass_id}' THEN 'ID already exists'
      ELSE 'Conflict occurred'
      END AS message; 
    `;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function createAdmin(
  connection,
  adminid,
  adminemail,
  adminname,
  userpassword
) {
  try {
    let query = `
    insert into admin(adminid, adminemail, adminname)
    values ('${adminid}', '${adminemail}', '${adminname}') on conflict (adminid) do nothing
    RETURNING CASE
    WHEN adminid = '${adminid}' THEN 'ID already exists'
    ELSE 'Conflict occurred'
    END AS message; 
    insert into users(userid, role, userpassword)
    values ('${adminid}', '0', '${userpassword}') on conflict (userid) do nothing;

    INSERT INTO user_document(userid)
      VALUES('${adminid}') on conflict (userid) do nothing
      RETURNING CASE
      WHEN userid = '${adminid}' THEN 'ID already exists'
      ELSE 'Conflict occurred'
      END AS message; 
    `;

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

/* End Postegresql */

module.exports = {
  getStudentPromotion,
  createCourse,
  coursesTeachers,
  assignmentTeacherCourse,
  unassign,
  getScheduleToStudents,
  AttendanceView,
  filterAttendances,
  filterStudent,
  getTeachersByMajorCourse,
  getAllStudent,
  getAll,
  getExistCourse,
  createAttendance,
  updatePresent,
  insertData,
  getCourse,
  findData,
  filterTeacher,
  AttendanceDetails,
  filterCourses,
  filterpm,
  filterassistance,
  updateStatusPM,
  updateStatusAssistance,
  enableUserpm,
  deleteUserpm,
  enableUserAs,
  newEmailToken,
  Userinfo,
  createAttendanceStudent,
  UpdateData,
  UpdateActivityTime,
  teacherCourse,
  findDataForResetPassword,
  UpdateToken,
  newpassword,
  getCourseMajor,
  updateCourse,
  filterCourseMajor,
  createClass,
  getAllCourses,
  createSchedule,
  getAttendanceByCTD,
  getAllById,
  getScheduleByPM,
  updateAssign,
  deleteByID,
  addSchedule,
  updateSchedule,
  copySchedule,
  copyClass,
  insertPromotion,
  getUserTeacher,
  getTeachersCourses,
  getUserTeacher,
  uploadFile,
  getAllMajor,
  createASAccount,
  createPMAccount,
  createAdmin,
};
