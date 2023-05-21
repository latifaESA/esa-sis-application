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
    const result = connection.query(`SELECT * from ${table} WHERE ${where} = '${columnName}'`)
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
      SELECT student.*, major.major_name
      FROM student
      LEFT JOIN major ON student.major_id = major.major_id
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
      query += ` AND student.major_id = ${major}`;
    }
    if (promotion.trim() != '') {
      query += ` AND promotion = '${promotion}'`;
    }
    if (status.trim() != '') {
      query += ` AND status = '${status}'`;
    }

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
      query += ` AND teachers.teacher_id = ${id}`;
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
      query += ` AND lower(trim(teacher_id)) LIKE lower(trim('%${courseid}%'))'`;
    }

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
  findData,
  filterTeacher
};
