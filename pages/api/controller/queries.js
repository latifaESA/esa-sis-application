/*
 * Created By: Mohamad Yassine
 * Project: SIS Application
 * File: pages\api\controller\queries.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import { executeQuery } from '../../../utilities/db';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

async function current_applicant_promotion(major_id, user_id, connection) {
  try {
    let [result] = await executeQuery(
      connection,
      'select major.current_applicants_promotion from major inner join user_profile where user_profile.major=major.major_id and major.major_id=? and user_profile.user_id=?',
      [major_id, user_id]
    );
    return result;
  } catch (err) {
    return err;
  }
}

/**
 * It finds Data from the databasevand returns true or false
 * </code>
 */
async function findData(connection, name, table, value) {
  try {
    const [result] = await executeQuery(
      connection,
      `select max(if(${name}=?,true,false)) AS result from ${table}`,
      [value]
    );

    return result;
  } catch (err) {
    return err;
  }
}

/**
 * It saves the userinfo at signup(register) page FOR BBA .
 * </code>
 */
async function NewUser(
  connection,
  user_id,
  email,
  password,
  major,
  firstname,
  lastname,
  mobile_number,
  application_Language
) {
  let emailToken = crypto.randomBytes(64).toString('hex');
  password = bcryptjs.hashSync(password);

  try {
    await executeQuery(
      connection,
      'insert into user_profile(user_id,email,password,major,emailToken,application_Language) value(?,?,?,?,?,?)',
      [user_id, email, password, major, emailToken, application_Language]
    );
    await executeQuery(
      connection,
      "insert into user_personal_info values(?,1,?,'',?,'','',1,null,'','','',1,'','')",
      [user_id, firstname, lastname]
    );
    await executeQuery(
      connection,
      "insert into user_address_info values(?,'','','','','','','')",
      [user_id]
    );
    await executeQuery(
      connection,
      "insert into user_contact_info values(?,'',?,'')",
      [user_id, mobile_number]
    );
    await executeQuery(
      connection,
      "insert into emergency_contact_info values(?,'1','','','','1','','','1')",
      [user_id]
    );
    await executeQuery(
      connection,
      "insert into user_education_info values(?,'1','1','1','1','','1','','','1','','')",
      [user_id]
    );
    await executeQuery(
      connection,
      'insert into user_languages_sat(user_id) values(?)',
      [user_id]
    );
    await executeQuery(connection, "insert into user_motivation values(?,'')", [
      user_id,
    ]);
    await executeQuery(
      connection,
      "insert into user_source(user_id,source) values(?, JSON_ARRAY(''))",
      [user_id]
    );
    await executeQuery(
      connection,
      'insert into user_document(user_id) values(?)',
      [user_id]
    );
    if (major === 10) {
      console.log('I am adding BBA user');
      await executeQuery(
        connection,
        'insert into user_study_grade(user_id) values (?)',
        [user_id]
      );
    } else if (major === 13 || major === 15) {
      console.log('I am adding MBA/EMBA user');
      await executeQuery(
        connection,
        "insert into user_questions values(?,'','','','','','','')",
        [user_id]
      );
      await executeQuery(
        connection,
        'INSERT INTO user_company_experience (user_id) VALUES (?)',
        [user_id]
      );
      await executeQuery(
        connection,
        'insert into user_payment(user_id) values(?)',
        [user_id]
      );
    } else {
      console.log('I am adding one of the common majors');
      await executeQuery(
        connection,
        "Insert into user_past_experience(user_id,rolesAndTasks) values(?,'')",
        [user_id]
      );
      await executeQuery(
        connection,
        'insert into user_payment(user_id) values(?)',
        [user_id]
      );
    }
  } catch (error) {
    return error;
  }
}
/**
 * It updates user's profile from firstname,lastname and password.
 * </code>
 */
async function UpdateUserpassword(connection, password, fname, lname, userid) {
  /*  user will be taken from a session userid  */

  password = bcryptjs.hashSync(password);
  try {
    let UserData = await executeQuery(
      connection,
      'UPDATE user_profile, user_personal_info SET user_profile.password = ?,user_personal_info.firstname = ?,user_personal_info.lastname = ? WHERE user_profile.user_id = user_personal_info.user_id AND user_profile.user_id = ?;',
      [password, fname, lname, userid]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}

/**
 * it updates the emailtoken to null and isverified to true.it's used when the user verifues the email
 * </code>
 */
async function UpdateToken(connection, emailToken) {
  try {
    let UserData = await executeQuery(
      connection,
      'UPDATE user_profile A JOIN user_profile B  ON A.user_id=B.user_id set A.emailToken=null,A.isVerified="1" where  B.emailToken=?;',
      [emailToken]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}
/**
 * It deletes a user's ID from the database
 * </code>
 */
async function DeleteTableBYID(ID, tables, connection) {
  try {
    let results = [];
    for (const table of tables) {
      let UserData = await executeQuery(
        connection,
        `Delete from ${table} where user_id=?`,
        [ID]
      );
      results.push(UserData);
    }
    return results;
  } catch (err) {
    return err;
  }
}
async function InsertDataByID(connection, tables, ID) {
  try {
    let results = [];
    for (const table of tables) {
      let query = `INSERT INTO ${table} (user_id) VALUES (?)`;
      let values = [ID];

      const result = await executeQuery(connection, query, values);
      results.push(result);
    }
    return results;
  } catch (err) {
    return err;
  }
}
/**
 * adds new emailToken to this specific email
 * </code>
 */
async function newEmailToken(connection, email) {
  let emailToken = crypto.randomBytes(64).toString('hex');
  try {
    let [UserData] = await executeQuery(
      connection,
      'update user_profile set emailToken=? where email=?',
      [emailToken, email]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}
/**
 * Selects email,emailToken,ID,role,major,appissaved,application-language,status,isverified,password,fnam,lname,mobile from this email
 * </code>
 */
async function Userinfo(connection, email) {
  try {
    let [UserData] = await executeQuery(
      connection,
      'select user_profile.user_id,user_profile.email,user_profile.emailToken,user_profile.role,user_profile.major,user_profile.appisSaved,user_profile.application_Language,user_profile.status,user_profile.isVerified,user_profile.password,user_personal_info.firstname,user_personal_info.lastname,user_contact_info.mobile_number,user_document.profileUrl from user_profile,user_personal_info,user_contact_info,user_document where user_profile.user_id=user_personal_info.user_id and user_profile.user_id=user_contact_info.user_id and user_profile.user_id=user_document.user_id  and user_profile.email=?',
      [email]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}

/**
 * It takes a connection and an email as parameters, and returns the role of the user with the given
 * email.
 * @param connection - the connection to the database
 * @param email - email of the user
 * @returns An array of objects.
 */
async function Userrole(connection, email) {
  try {
    let [UserData] = await executeQuery(
      connection,
      'select user_profile.role  from  user_profile where user_profile.email=?',
      [email]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}
/**
 * resets to a new password at this specific email
 * </code>
 */
async function newpassword(connection, email, newPassword) {
  let password = bcryptjs.hashSync(newPassword);
  try {
    let UserData = await executeQuery(
      connection,
      'Update user_profile set password=? where email=?',
      [password, email]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}

//----------------------------------------------------------------
///THIS SECTION TAKES A String VALUE AND RETURNS A INT VALUE
/**
 * It takes program name and return its respective id
 * </code>
 */

async function findId(connection, id, table, column1, column2, value) {
  try {
    const query = `SELECT ${id} FROM ${table} WHERE ${column1} = ? OR ${column2} = ?`;
    const [result] = await executeQuery(connection, query, [value, value]);

    return result;
  } catch (err) {
    return err;
  }
}
async function findmajor_id(connection, major_program) {
  try {
    let [UserData] = await executeQuery(
      connection,
      'SELECT major.major_id from major where major.program=?',
      [major_program]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}

///THIS SECTION TAKES A String VALUE AND RETURNS A INT VALUE ENDS HERE
//----------------------------------------------------------------
///THIS SECTION TAKES A INT VALUE AND RETURNS A STRING VALUE
/**
 * It takes userid  and return its respective program name
 * </code>
 */
async function findName(
  connection,
  name,
  table,
  joinTable,
  joinColumn,
  joinValue,
  id
) {
  try {
    const query = `SELECT ${name} FROM ${table} INNER JOIN ${joinTable} ON ${joinTable}.${joinColumn} = ${table}.${joinValue} and ${joinTable}.user_id=?`;
    const [result] = await executeQuery(connection, query, [id]);

    return result;
  } catch (err) {
    return err;
  }
}
async function findmajor_name(connection, userid) {
  try {
    let [UserData] = await executeQuery(
      connection,
      'SELECT major.program from major inner join user_profile on user_profile.major=major.major_id and user_profile.user_id=?',
      [userid]
    );

    return UserData;
  } catch (err) {
    return err;
  }
}
///THIS SECTION TAKES A INT VALUE AND RETURNS A STRING VALUE ENDS HERE
//----------------------------------------------------------------

//Read tables//
//Reads Data from userprofile table

async function ReadData(connection, table, user_id) {
  try {
    const query = `SELECT * FROM ${table} WHERE user_id = ?`;
    const [result] = await executeQuery(connection, query, [user_id]);

    return result;
  } catch (err) {
    return err;
  }
}

async function ReadDropdown(connection, table) {
  try {
    const query = `SELECT * FROM ${table}`;
    const result = await executeQuery(connection, query, []);

    return result;
  } catch (err) {
    return err;
  }
}

async function ReadDropdownSotred(connection, table,sort) {
  try {
    const query = `SELECT * FROM ${table} order by ${sort}='Other'`;
    const result = await executeQuery(connection, query, []);

    return result;
  } catch (err) {
    return err;
  }
}
//Read tables END//
//----------------------------------------------------------------
//Update Data//
//Update Data To userprofile table

async function UpdateData(connection, table, whereValue, ...columnValuePairs) {
  try {
    let query = `UPDATE ${table} SET `;
    let values = [];

    columnValuePairs.forEach((pair, index) => {
      query += `${pair[0]} = ?`;
      if (index !== columnValuePairs.length - 1) {
        query += ', ';
      }
      values.push(pair[1]);
    });

    query += ` WHERE user_id= ?`;
    values.push(whereValue);
    const result = await executeQuery(connection, query, values);

    return result;
  } catch (err) {
    return err;
  }
}

//Update Data into source table
async function UpdateSource(connection, source, othersource, userid) {
  try {
    const result = await executeQuery(
      connection,
      'Update user_source set source=JSON_ARRAY(?),othersource=? where user_source.user_id=?',
      [source, othersource, userid]
    );

    return result;
  } catch (err) {
    return err;
  }
}

//Update Activity time for a user
async function UpdateActivityTime(userid, connection) {
  try {
    const result = await executeQuery(
      connection,
      'UPDATE user_profile SET user_profile.update_time = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userid]
    );

    return result;
  } catch (err) {
    return err;
  }
}

//end of Updating tables
//----------------------------------------------------------------
//Queries for the admin page
async function FilterData(connection, table, wherevalues, limit, skip) {
  try {
    let query = `Select * from ${table} ${wherevalues} LIMIT ? OFFSET ? `;
    let values = [limit, skip];

    const result = await executeQuery(connection, query, values);

    return result;
  } catch (err) {
    return err;
  }
}
// Add values english french to dropdown lists
async function AddtoDropdown(table, columns, values, connection) {
  try {
    const sql = `insert into ${table} (${columns.join(', ')}) values (${values
      .map(() => '?')
      .join(', ')})`;
    await executeQuery(connection, sql, values);
    //example how to use it
    //console.log(await AddtoDropdown('title', ['title_eng', 'title_fr'], ['eng name', 'fr name'], connection));
  } catch (err) {
    return err;
  }
}
async function DeletefromDropdown(table, where, ID, connection) {
  // eslint-disable-next-line no-useless-catch
  try {
    const sql = `Delete from ${table} where ${where}=?`;
    await executeQuery(connection, sql, [ID]);
  } catch (err) {
    throw err;
  }
}
async function UpdateintoDropdown(
  table,
  where,
  eng,
  fr,
  columneng,
  columnfr,
  ID,
  connection
) {
  try {
    const sql = `Update ${table} set ${columneng}=?,${columnfr}=? where ${where}=?`;
    await executeQuery(connection, sql, [eng, fr, ID]);
  } catch (err) {
    return err;
  }
}

async function UpdateintoDropdownformajor(
  table,
  where,
  eng,
  fr,
  promotion,
  columneng,
  columnfr,
  ID,
  connection
) {
  try {
    const sql = `Update ${table} set ${columneng}=?,${columnfr}=?, current_applicants_promotion=? where ${where}=?`;
    await executeQuery(connection, sql, [eng, fr,promotion ,ID]);
  } catch (err) {
    return err;
  }
}

async function ResetSetting(connection) {
  try {
    let result = await executeQuery(
      connection,
      `UPDATE setting set auto_Save_Timing='10',max_characters_count='3000',Year_of_Acquisition_Limit='20',message_disapear_timing='5',personalinfo_dob_min='1990-05-20',personalinfo_dob_max='2006-10-31',upload_file_single_size='4',upload_file_total_size='4',logger_expiry_day='30',logger_max_file_size='20' where setting_name='app'`,
      []
    );

    return result;
  } catch (err) {
    return err;
  }
}

async function UpdateAny(
  connection,
  table,
  id,
  whereValue,
  ...columnValuePairs
) {
  try {
    let query = `UPDATE ${table} SET `;
    let values = [];

    columnValuePairs.forEach((pair, index) => {
      query += `${pair[0]} = ?`;
      if (index !== columnValuePairs.length - 1) {
        query += ', ';
      }
      values.push(pair[1]);
    });

    query += ` WHERE ${id}= ?`;
    values.push(whereValue);
    const result = await executeQuery(connection, query, values);

    return result;
  } catch (err) {
    return err;
  }
}

export {
  UpdateUserpassword,
  NewUser,
  UpdateSource,
  UpdateToken,
  newEmailToken,
  Userinfo,
  Userrole,
  newpassword,
  findmajor_id,
  current_applicant_promotion,
  findData,
  findName,
  ReadData,
  findId,
  findmajor_name,
  UpdateData,
  FilterData,
  UpdateActivityTime,
  ReadDropdown,
  DeleteTableBYID,
  InsertDataByID,
  AddtoDropdown,
  DeletefromDropdown,
  UpdateintoDropdown,
  ResetSetting,
  UpdateAny,
  ReadDropdownSotred,
  UpdateintoDropdownformajor,
};
