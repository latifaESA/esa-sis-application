/*
 * Created By: KANSO Adi, Ali Mroueh
 * Project: SIS Application
 * File: pages\api\external_application\recieve_active_student_info_in_SIS.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

const { insertData, getAllById } = require('../controller/queries');
const { insertMajor } = require('../controller/queries');
const { addStudentActivityToLogs } = require('../controller/queries');
const { connect } = require('../../../utilities/db');
// const { sis_app_logger } = require('../logger');
// const useragent = require('useragent');
const { env } = require('process');
// import crypto from "crypto";
// import axios from 'axios'
import bcryptjs from "bcryptjs";
// import EmailAfterCreateAccount from "../../../utilities/emailing/emailAfterCreateAccount";
import SendEmail from "../admin/adminApi/emailFormat";
import SendEmailOld from "../admin/adminApi/emailExistUser";

const getCurrentMonthYear = () => {
  const date = new Date();
  const options = { month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const formatDateForDB = (dateString) => {
  // Split the DD/MM/YYYY string into parts
  const [day, month, year] = dateString.split('/');

  // Return in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
};

function generatePassword(length) {
  const patternList = "0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz#$%&()*+,-./:;<=>!?@[]^_`{|}~";

  const getCrypto = () => {
    if (typeof window !== "undefined" && window.crypto) {
      return window.crypto;
    } else if (typeof require !== "undefined") {
      return require("crypto").webcrypto;
    } else {
      throw new Error("Crypto API not available");
    }
  };

  const cryptoObj = getCrypto();
  const array = new Uint8Array(length);
  cryptoObj.getRandomValues(array);

  let password = Array.from(array)
    .map(x => patternList[x % patternList.length])
    .join("");

  return password;
}



async function handler(req, res) {
  try {
    // Generate a strong KEY from an online key generator
    const ONLINE_SIS_SECRET_KEY = env.ONLINE_SIS_SECRET_KEY;
    // for dev mode should be localhost:3001
    const ONLINE_URL = env.ONLINE_APPLICATION_URL;
    // Allow integration with the online application
    // during SIS development the value should be false until the integration is done
    // because we plan to deploy progresvly the SIS application in the production server
    const allowIntegration = env.ALLOW_INTEGRATION;

    res.setHeader('Access-Control-Allow-Origin', ONLINE_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Authorization', ONLINE_SIS_SECRET_KEY);
    if (
      allowIntegration &&
      req.method === 'POST' &&
      req.url === '/api/external_applications/recieve_active_student_info_in_SIS_EXED'
    ) {
      // Verify authorization token
      const authHeader = req.headers['authorization'];
      if (!authHeader || authHeader !== ONLINE_SIS_SECRET_KEY) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
      }
      // const userAgent = req.headers['user-agent'];
      // const userAgentinfo = useragent.parse(userAgent);

      let { studentInfo, adminName } = req.body;
      // console.log(adminName);
      // console.log('===============');
      // console.log(studentInfo.rows);
      // console.log('===============');
      let isSuccess = true;

      if (studentInfo) {
        const recieved_data = studentInfo.rows[0];
        console.log('recieved_data' , recieved_data)
        const connection = await connect();
        const new_pass = generatePassword(8);
        const salt = await bcryptjs.genSalt(8);
        const genPass = await bcryptjs.hash(new_pass, salt);

        const exist = await getAllById(connection , 'user_contact' ,'email' , `${recieved_data.personal_email}`)
        console.log(
          'exist',
          exist
        )
        let insertExtraUser 
        if(exist.rows.length > 0){
          const columns_extra = ['userid', 'majorid', 'promotion' , 'email' , 'major_name'];
        const extra_data = [`${recieved_data.CID}`, `${recieved_data.major_id}`, `${recieved_data.promotion}` , `${recieved_data.personal_email}` , `${recieved_data.major_name}`];
         insertExtraUser = await insertData(connection, 'extra_user', columns_extra, extra_data);
      
        }
        isSuccess = isSuccess && insertExtraUser.rowCount > 0;
                  // Insert major
        const columns_major = ['major_id', 'major_name' , 'status'];
        const values_major = [`${recieved_data.major_id}`, `EXED-${recieved_data.major_name}` , 'active'];
        const resMajor = await insertMajor(connection, 'major', columns_major, values_major);
        console.log('resMajor' , resMajor)
        recieved_data.major_id = resMajor
      

    
        isSuccess = isSuccess && resMajor.rowCount > 0;

        // Insert promotion if not exist
        const date = new Date();
        let current_year = date.getFullYear();
        const time_acc = getCurrentMonthYear()
        const columns_promotion = ['promotion_name', 'major_id', 'academic_year'];
        const promotion_data = [`${recieved_data.promotion}`, `${recieved_data.major_id}`, current_year];
        let insertIntoPromotionIfNotExist = await insertData(connection, 'promotions', columns_promotion, promotion_data);
      
        isSuccess = isSuccess && insertIntoPromotionIfNotExist.rowCount > 0;

        // Insert user
        const columns_user = ['userid', 'role', 'userpassword' , 'email'];
        const values_user = [`${recieved_data.CID}`, 1, `${genPass}`,`${recieved_data.personal_email}`];
        let resUser = await insertData(connection, 'users', columns_user, values_user);
     
        isSuccess = isSuccess && resUser.rowCount > 0;

        // Insert into logs
        const formattedCurrentDate = formatDate(new Date());
        await addStudentActivityToLogs(connection, recieved_data.CID, 'status', 'active', 'online application', adminName, formattedCurrentDate);

        // Insert student
        const columns_student = ['student_id', 'status', 'promotion', 'academic_year', 'student_firstname', 'student_lastname', 'major_id', 'graduated_year'];
        const values_student = [`${recieved_data.CID}`, 'active', `${recieved_data.promotion}`, `${time_acc}`, `${recieved_data.first_name}`, `${recieved_data.last_name}`, `${recieved_data.major_id}`, 2023];
        let resstudent = await insertData(connection, 'student', columns_student, values_student);
   
        isSuccess = isSuccess && resstudent.rowCount > 0;

        // Insert user personal info
        const dateBirthFormate = formatDateForDB(recieved_data.dob);
        const columns_user_personal_info = ['userid', 'title', 'firstname', 'fathername', 'lastname', 'maidename', 'mothername', 'gender', 'dateofbirth', 'countryofbirth', 'placeofbirth', 'registrationnumber', 'maritalstatus', 'firstnationality', 'secondnationality'];
        const values_user_personal_info = [`${recieved_data.CID}`, `${recieved_data.title}`, `${recieved_data.first_name}`, `${recieved_data.father_name}`, `${recieved_data.last_name}`, '', '', `${recieved_data.gender}`, `${dateBirthFormate}`, '', `${recieved_data.place_of_birth}`, '', `${recieved_data.marital_status}`, `${recieved_data.nationality_1}`, `${recieved_data.nationality_2}`];
        const resUserPersonalInfo = await insertData(connection, 'user_personal_info', columns_user_personal_info, values_user_personal_info);
        
        

        isSuccess = isSuccess && resUserPersonalInfo.rowCount > 0;

        // Insert user contact
        const columns_user_contact = ['userid', 'email', 'email_two', 'mobile_number', 'landline_number'];
        const values_user_contact = [`${recieved_data.CID}`, `${recieved_data.personal_email}`, '', `${recieved_data.mobile_number}`, ''];
        const res_user_contact = await insertData(connection, 'user_contact', columns_user_contact, values_user_contact);
        isSuccess = isSuccess && res_user_contact.rowCount > 0;

        // Insert user personal address
        const columns_user_personal_address = ['userid', 'address_country', 'address_region', 'address_city', 'address_street', 'address_building', 'address_floor', 'address_postal'];
        const values_user_personal_address = [`${recieved_data.CID}`, `${recieved_data.country}`, `${recieved_data.region}`, `${recieved_data.home_address}`, '', '', '', ''];
        const res_user_personal_address = await insertData(connection, 'user_personal_address', columns_user_personal_address, values_user_personal_address);
        
        isSuccess = isSuccess && res_user_personal_address.rowCount > 0;

        // Insert user emergency contact
        const columns_user_emergency_contact = ['userid', 'prefix', 'emerg_firstname', 'emerg_middlename', 'emerg_lastname', 'emerg_phonenumber', 'emerg_relationship', 'emerg_medicalhealth', 'emerg_diseasetype'];
        const values_user_emergency_contact = [`${recieved_data.CID}`, '', '', '', '', '', '', '', ''];
        const res_user_emergency_contact = await insertData(connection, 'user_emergency_contact', columns_user_emergency_contact, values_user_emergency_contact);

        isSuccess = isSuccess && res_user_emergency_contact.rowCount > 0;

        // Insert user education
        const columns_user_education = ['userid', 'degree_level', 'series', 'obtain_date', 'education_country', 'establishment', 'other_establishment'];
        const values_user_education = [`${recieved_data.CID}`, `${recieved_data.degree}`, `${recieved_data.major}`, `${recieved_data.year}`, '', `${recieved_data.university_name}`, ''];
        const res_user_education = await insertData(connection, 'user_education', columns_user_education, values_user_education);
       
        isSuccess = isSuccess && res_user_education.rowCount > 0;

        // Insert user document
        const columns_document = ['userid', 'profileURL' ,'email'];
        const values_document = [`${recieved_data.CID}`, '' , `${recieved_data.personal_email}`];
        const resDocument = await insertData(connection, 'user_document', columns_document, values_document);
        
        isSuccess = isSuccess && resDocument.rowCount > 0;
        isSuccess =resDocument.rowCount > 0 ? true : false
        console.log('isSucess' , isSuccess)

        // Send the email
        const lname = recieved_data.last_name;
        const fname = recieved_data.first_name;
        const name = `${fname} ${lname}`;
        const studentId = recieved_data.CID;
        const email = recieved_data.personal_email;
        const program = recieved_data.major_name
        if(exist.rows.length > 0){
          SendEmailOld(name, email, 'https://esasis.esa.edu.lb/file/setting/public/esa.png', program);

        }else{
          SendEmail(name, email, new_pass, studentId, 'https://esasis.esa.edu.lb/file/setting/public/esa.png');

        }
        // Return final response
        if (isSuccess) {
          return res.status(200).json({ message: 'Received student info' });
        } else {
          return res.status(200).json({ message: 'Failed to insert student info' });
        }
      } else {
        return res.status(200).json({ message: 'No Student Info' });
      }
    } else {
      return res.status(200).send('Not found');
    }
  } catch (error) {
    console.log('Error in recieve_active_student_info_in_SIS_EXED.js in external_applications API:', error);
    return res.status(500).send('Internal Server Error');
  }
}

// Helper function to format date
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}-${month}-${year}-${hours}:${minutes}`;
}

// // Helper function to format the date for DB (adjust as needed)
// function formatDateForDB(date) {
//   return date;  // Adjust depending on the format needed
// }


export default handler
