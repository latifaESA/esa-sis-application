/*
 * Created By: Ali Mroueh
 * Project: SIS Application
 * File: pages\api\controller\queries.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

// import { executeQuery } from '../../../utilities/db';
// import crypto from 'crypto';
// import bcryptjs from 'bcryptjs';
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



async function findData(connection, table, where, columnName){
  try{
    let result = connection.query(`SELECT * from ${table} WHERE ${where} = '${columnName}'`)
    return result;
  }catch(err){
    return err
  }
}


// insert to the database as much as you like columns and values
async function insertData(connection, table, columns, values) {
  try {
    const columnList = columns.join(", ");
    const valueList = values.map(val => `'${val}'`).join(", ");
    const result = await connection.query(`INSERT INTO ${table} (${columnList}) VALUES (${valueList})`);
    return result;
  } catch (err) {
    return err;
  }
}

// get all data from specific column
async function getAll(connection, table){
  try{
    const result = connection.query(`SELECT * from ${table}`)
    return result;
  }catch(err){
    return err
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

async function filterStudent(connection, id, firstname, lastname, major, promotion, status) {
  try {
    let query = `
      SELECT student.*, major.major_name, user_contact.email, user_contact.mobile_number
      FROM student
      LEFT JOIN major ON student.major_id = major.major_id
      LEFT JOIN user_contact ON student_id = user_contact.userid
      WHERE 1=1`;

    if (id.trim() != '') {
      query += ` AND lower(trim(student_id)) LIKE lower(trim('%${id}%'))`;
    }
    if (firstname.trim() != '') {
      query += ` AND lower(trim(student_firstname)) LIKE lower(trim('%${firstname}%'))`;
    }
    if (lastname.trim() != '') {
      query += ` AND lower(trim(student_lastname)) LIKE lower(trim('%${lastname}%'))`;
    }
    if (major != '') {
      query += ` AND major.major_name = ${major}`;
    }
    if (promotion.trim() != '') {
      query += ` AND promotion = '${promotion}'`;
    }
    if (status.trim() != '') {
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

async function filterTeacher(connection, id, firstname, lastname, email, courseid) {
  try {
    let query = `
      SELECT * FROM teachers
      WHERE 1=1`;

    if (id != '') {
      query += ` AND teacher_id = '${id}'`;
    }
    if (firstname.trim() != '') {
      query += ` AND lower(trim(teacher_firstname)) LIKE lower(trim('%${firstname}%'))`;
    }
    if (lastname.trim() != '') {
      query += ` AND lower(trim(teacher_lastname)) LIKE lower(trim('%${lastname}%'))`;
    }
    if (email != '') {
      query += ` AND lower(trim(teacher_mail)) LIKE lower(trim('%${email}%'))`;
    }
    if (courseid.trim() != '') {
      query += ` AND lower(trim(course_id)) LIKE lower(trim('%${courseid}%'))'`;
    }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}

//<<<<<<< batoul
//async function ReadDropdown(connection, table) {
//  try {
//    const query = `SELECT * FROM ${table}`;
//    const result = await executeQuery(connection, query, []);
//=======

async function filterCourses(connection, course_id, course_name, course_credit, major_id) {
  try {
    let query = `
    SELECT courses.*, major.major_name
    FROM courses
    LEFT JOIN major ON courses.major_id = major.major_id
    WHERE 1=1`;

    if (course_id != '') {
      query += ` AND lower(trim(course_id)) LIKE lower(trim('%${course_id}%'))`;
    }
    if (course_name.trim() != '') {
      query += ` AND lower(trim(course_name)) LIKE lower(trim('%${course_name}%'))`;
    }
    if (course_credit != '') {
      query += ` AND courses.course_credit = ${course_credit}`;
    }
    if (major_id != '') {
      query += ` AND courses.major_id = ${major_id}`;
    }

    const result = await connection.query(query);

    return result;
  } catch (err) {
    return err;
  }
}

async function filterpm(connection, pm_id, pm_firstname, pm_lastname, pm_email, pm_status) {
  try {
    let query = `
      SELECT * FROM program_manager
      WHERE 1=1`;

    if (pm_id != '') {
      query += ` AND lower(trim(pm_id)) LIKE lower(trim('%${pm_id}%'))`;
    }
    if (pm_firstname.trim() != '') {
      query += ` AND lower(trim(pm_firstname)) LIKE lower(trim('%${pm_firstname}%'))`;
    }
    if (pm_lastname.trim() != '') {
      query += ` AND lower(trim(pm_lastname)) LIKE lower(trim('%${pm_lastname}%'))`;
    }
    if (pm_email != '') {
      query += ` AND lower(trim(pm_email)) LIKE lower(trim('%${pm_email}%'))`;
    }
    if (pm_status.trim() != '') {
      query += ` AND program_manager.pm_status = '${pm_status}'`;
    }

    const result = await connection.query(query);
    return result;
  } catch (err) {
    return err;
  }
}
async function filterassistance(connection, pm_ass_id, pm_ass_firstname, pm_ass_lastname, pm_ass_email, pm_ass_status) {
  try {
    let query = `
      SELECT * FROM program_manager_assistance
      WHERE 1=1`;

    if (pm_ass_id.trim() != '') {
      query += ` AND lower(trim(pm_ass_id)) LIKE lower(trim('%${pm_ass_id}%'))`;
    }
    if (pm_ass_firstname.trim() != '') {
      query += ` AND lower(trim(pm_ass_firstname)) LIKE lower(trim('%${pm_ass_firstname}%'))`;
    }
    if (pm_ass_lastname.trim() != '') {
      query += ` AND lower(trim(pm_ass_lastname)) LIKE lower(trim('%${pm_ass_lastname}%'))`;
    }
    if (pm_ass_email != '') {
      query += ` AND lower(trim(pm_ass_email)) LIKE lower(trim('%${pm_ass_email}%'))`;
    }
    if (pm_ass_status.trim() != '') {
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



/* End Postegresql */


module.exports = {
  filterStudent,
  getAll,
  insertData,
  // ReadDropdown,
  findData,
  // filterAttendance,
  filterTeacher,
  filterCourses,
  filterpm,
  filterassistance,
  updateStatusPM,
  updateStatusAssistance,
  enableUserpm,
  deleteUserpm,
  enableUserAs
};
