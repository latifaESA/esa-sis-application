/*
 * Created By: KANSO Adi, Ali Mroueh
 * Project: SIS Application
 * File: pages\api\external_application\recieve_active_student_info_in_SIS.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

const { insertData } = require('../controller/queries');
const { connect } = require('../../../utilities/db');
const sis_app_logger = require('../logger');
const useragent = require('useragent');
const { env } = require('process');

// // Generate a strong KEY from an online key generator
// const ONLINE_SIS_SECRET_KEY = 'ONLINE_SIS_SECRET_KEY';
// // for dev mode should be localhost:3000
// const ONLINE_URL = 'http://localhost:3000';
// // const ONLINE_URL = 'https://online-application-url.com';

// // TODO: Dear SIS developer,I prefer to use another method, but in a quick search, I did not find an integrated approach other than creating a new server
// const server = http.createServer((req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', ONLINE_URL);
//   res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

//   if (
//     req.method === 'POST'
//     &&
//     req.url === '/pages/api/external_applications/recieve_active_student_info_in_SIS'
//     // FIXME: Maybe req.url need Modification
//   ) {
//     // Verify authorization token
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || authHeader !== ONLINE_SIS_SECRET_KEY) {
//       res.writeHead(401, { 'Content-Type': 'text/plain' });
//       res.end('Unauthorized');
//       return;
//     }

//     // Read request body
//     let body = '';
//     req.on('data', (chunk) => {
//       body += chunk;
//     });
//     req.on('end',async () => {

//       const userAgent = req.headers['user-agent'];
//       const userAgentinfo = useragent.parse(userAgent);
//       const studentInfo = await JSON.parse(body).studentInfo;
//       // console.log('Received student info:', studentInfo);
//       // TODO: Dear SIS developper
//       // TODO: send recieved data to the database
//       if(studentInfo){
//         console.log(studentInfo[0])
//         let recieved_data = studentInfo[0];
//         // connect to data base
//         const connection = await connect();

//         // insert the user
//         const columns_user = ['userid', 'role', 'userpassword'];
//         const values_user = [`${recieved_data.UserProfileID}`, 2, `${recieved_data.password}`];
//         let resUser = await insertData(connection, 'users', columns_user, values_user);
//         console.log("resUser: ", resUser)

//         // insert the major
//         const columns_major = ['major_id', 'major_name', 'current_promotion'];
//         const values_major = [`${recieved_data.major}`, `${recieved_data.program}`, `${recieved_data.promotion}`];
//         // const insertmajor =
//         const resMajor = await insertData(connection, 'major', columns_major, values_major);
//         console.log('resMajor: ',resMajor)

//         // insert the user_personal_info
//         const columns_user_personal_info = ['userid', 'title', 'firstname', 'fathername', 'lastname', 'maidename', 'mothername', 'gender', 'dateofbirth', 'countryofbirth', 'placeofbirth', 'registrationnumber', 'maritalstatus', 'firstnationality', 'secondnationality'];
//         const values_user_personal_info = [`${recieved_data.UserProfileID}`, `${recieved_data.title}`, `${recieved_data.firstname}`, `${recieved_data.fathername}`, `${recieved_data.lastname}`, `${recieved_data.maidename}`, `${recieved_data.mothername}`, `${recieved_data.gender}`, `${recieved_data.dateofbirth}`, `${recieved_data.countryofbirth}`, `${recieved_data.placeofbirth}`, `${recieved_data.registrationnumber}`, `${recieved_data.maritalstatus}`, `${recieved_data.firstnationality}`, `${recieved_data.secondnationality}`];
//         const resUserPersonalInfo = await insertData(connection, 'user_personal_info', columns_user_personal_info, values_user_personal_info);

//         console.log('resUserPersonalInfo: ',resUserPersonalInfo)

//         // insert the user_contact
//         const columns_user_contact = ['userid', 'email', 'email_two', 'mobile_number', 'landline_number'];
//         const values_user_contact = [`${recieved_data.UserProfileID}`, `${recieved_data.email}`, `${recieved_data.email_two}`, `${recieved_data.mobile_number}`, `${recieved_data.landline_number}`];
//         const res_user_contact = insertData(connection, 'user_contact', columns_user_contact, values_user_contact);

//         console.log('res_user_contact: ', res_user_contact)

//         // insert the user_personal_address
//         const columns_user_personal_address = ['userid', 'address_country', 'address_region', 'address_city', 'address_street', 'address_building', 'address_floor', 'address_postal'];
//         const values_user_personal_address = [`${recieved_data.UserProfileID}`, `${recieved_data.address_country}`, `${recieved_data.address_region}`, `${recieved_data.address_city}`, `${recieved_data.address_street}`,`${recieved_data.address_building}`, `${recieved_data.address_floor}`, `${recieved_data.address_postal}`];
//         const res_user_personal_address = insertData(connection, 'user_personal_address', columns_user_personal_address, values_user_personal_address);

//         console.log('res_user_personal_address: ', res_user_personal_address)

//         // insert the user_emergency_contact
//         const columns_user_emergency_contact = ['userid', 'prefix', 'emerg_firstname', 'emerg_middlename', 'emerg_lastname', 'emerg_phonenumber', 'emerg_relationship', 'emerg_medicalhealth', 'emerg_diseasetype'];
//         const values_user_emergency_contact = [`${recieved_data.UserProfileID}`, `${recieved_data.prefix}`, `${recieved_data.emerg_firstname}`, `${recieved_data.emerg_middlename}`, `${recieved_data.emerg_lastname}`,`${recieved_data.emerg_phonenumber}`, `${recieved_data.emerg_relationship}`, `${recieved_data.emerg_medicalhealth}`, `${recieved_data.emerg_diseasetype}`];
//         const res_user_emergency_contact = await insertData(connection, 'user_emergency_contact', columns_user_emergency_contact, values_user_emergency_contact);

//         console.log('res_user_emergency_contact: ', res_user_emergency_contact)

//         // insert the user_education
//         const columns_user_education = ['userid', 'degree_level', 'series', 'obtain_date', 'education_country', 'establishment', 'other_establishment'];
//         const values_user_education = [`${recieved_data.UserProfileID}`, `${recieved_data.degree_level}`, `${recieved_data.series}`, `${recieved_data.obtain_date}`, `${recieved_data.education_country}`,`${recieved_data.establishment}`, `${recieved_data.other_establishment}`];
//         const res_user_education = await insertData(connection, 'user_education', columns_user_education, values_user_education);

//         console.log('res_user_education: ', res_user_education)

//         }else{
//           console.log('no student info')
//         }

//       // TODO: write an info log
//       sis_app_logger.info(
//         `${new Date()}=received a new active user=${
//           userAgentinfo.os.family
//         }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
//           userAgentinfo.source
//         }=${userAgentinfo.device.family}`
//       );

//       // Send a response to the online application
//       const responseData = { message: 'Received student info' };
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify(responseData));
//     });
//   } else {
//     console.log('hello how are you?')
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Not found');
//     // TODO: Dear SIS developper
//     // TODO: write an error log
//   }
// });

// const port = process.env.PORT || 3001;
// server.listen(port, () => {
//   console.log('SIS application listening on port 3001');
// });

export default async function handler(req, res) {
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
  if (
    allowIntegration &&
    req.method === 'POST' &&
    req.url === '/api/external_applications/recieve_active_student_info_in_SIS'
  ) {
    // Verify authorization token
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== ONLINE_SIS_SECRET_KEY) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
      return;
    }
    const userAgent = req.headers['user-agent'];
    const userAgentinfo = useragent.parse(userAgent);

    let { studentInfo } = req.body;
    if (studentInfo) {
      console.log(studentInfo[0]);
      let recieved_data = studentInfo[0];
      // connect to data base
      const connection = await connect();

      // insert the user
      const columns_user = ['userid', 'role', 'userpassword'];
      const values_user = [
        `${recieved_data.UserProfileID}`,
        1,
        `${recieved_data.password}`,
      ];
      let resUser = await insertData(
        connection,
        'users',
        columns_user,
        values_user
      );
      console.log('resUser: ', resUser);

      // insert the student
      const columns_student = [
        'student_id',
        'student_firstname',
        'student_lastname',
        'status',
        'major_id',
        'promotion',
        'academic_year',
      ];
      const values_student = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.firstname}`,
        `${recieved_data.lastname}`,
        `${recieved_data.status}`,
        `${recieved_data.major}`,
        `${recieved_data.promotion}`,
        '2023',
      ];
      let resstudent = await insertData(
        connection,
        'student',
        columns_student,
        values_student
      );
      console.log('resstudent: ', resstudent);

      // insert the major
      const columns_major = ['major_id', 'major_name', 'current_promotion'];
      const values_major = [
        `${recieved_data.major}`,
        `${recieved_data.program}`,
        `${recieved_data.promotion}`,
      ];
      // const insertmajor =
      const resMajor = await insertData(
        connection,
        'major',
        columns_major,
        values_major
      );
      console.log('resMajor: ', resMajor);

      // insert the user_personal_info
      const columns_user_personal_info = [
        'userid',
        'title',
        'firstname',
        'fathername',
        'lastname',
        'maidename',
        'mothername',
        'gender',
        'dateofbirth',
        'countryofbirth',
        'placeofbirth',
        'registrationnumber',
        'maritalstatus',
        'firstnationality',
        'secondnationality',
      ];
      const values_user_personal_info = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.title}`,
        `${recieved_data.firstname}`,
        `${recieved_data.fathername}`,
        `${recieved_data.lastname}`,
        `${recieved_data.maidename}`,
        `${recieved_data.mothername}`,
        `${recieved_data.gender}`,
        `${recieved_data.dateofbirth}`,
        `${recieved_data.countryofbirth}`,
        `${recieved_data.placeofbirth}`,
        `${recieved_data.registrationnumber}`,
        `${recieved_data.maritalstatus}`,
        `${recieved_data.firstnationality}`,
        `${recieved_data.secondnationality}`,
      ];
      const resUserPersonalInfo = await insertData(
        connection,
        'user_personal_info',
        columns_user_personal_info,
        values_user_personal_info
      );

      console.log('resUserPersonalInfo: ', resUserPersonalInfo);

      // insert the user_contact
      const columns_user_contact = [
        'userid',
        'email',
        'email_two',
        'mobile_number',
        'landline_number',
      ];
      const values_user_contact = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.email}`,
        `${recieved_data.email_two}`,
        `${recieved_data.mobile_number}`,
        `${recieved_data.landline_number}`,
      ];
      const res_user_contact = await insertData(
        connection,
        'user_contact',
        columns_user_contact,
        values_user_contact
      );

      console.log('res_user_contact: ', res_user_contact);

      // insert the user_personal_address
      const columns_user_personal_address = [
        'userid',
        'address_country',
        'address_region',
        'address_city',
        'address_street',
        'address_building',
        'address_floor',
        'address_postal',
      ];
      const values_user_personal_address = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.address_country}`,
        `${recieved_data.address_region}`,
        `${recieved_data.address_city}`,
        `${recieved_data.address_street}`,
        `${recieved_data.address_building}`,
        `${recieved_data.address_floor}`,
        `${recieved_data.address_postal}`,
      ];
      const res_user_personal_address = await insertData(
        connection,
        'user_personal_address',
        columns_user_personal_address,
        values_user_personal_address
      );

      console.log('res_user_personal_address: ', res_user_personal_address);

      // insert the user_emergency_contact
      const columns_user_emergency_contact = [
        'userid',
        'prefix',
        'emerg_firstname',
        'emerg_middlename',
        'emerg_lastname',
        'emerg_phonenumber',
        'emerg_relationship',
        'emerg_medicalhealth',
        'emerg_diseasetype',
      ];
      const values_user_emergency_contact = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.prefix}`,
        `${recieved_data.emerg_firstname}`,
        `${recieved_data.emerg_middlename}`,
        `${recieved_data.emerg_lastname}`,
        `${recieved_data.emerg_phonenumber}`,
        `${recieved_data.emerg_relationship}`,
        `${recieved_data.emerg_medicalhealth}`,
        `${recieved_data.emerg_diseasetype}`,
      ];
      const res_user_emergency_contact = await insertData(
        connection,
        'user_emergency_contact',
        columns_user_emergency_contact,
        values_user_emergency_contact
      );

      console.log('res_user_emergency_contact: ', res_user_emergency_contact);

      // insert the user_education
      const columns_user_education = [
        'userid',
        'degree_level',
        'series',
        'obtain_date',
        'education_country',
        'establishment',
        'other_establishment',
      ];
      const values_user_education = [
        `${recieved_data.UserProfileID}`,
        `${recieved_data.degree_level}`,
        `${recieved_data.series}`,
        `${recieved_data.obtain_date}`,
        `${recieved_data.education_country}`,
        `${recieved_data.establishment}`,
        `${recieved_data.other_establishment}`,
      ];
      const res_user_education = await insertData(
        connection,
        'user_education',
        columns_user_education,
        values_user_education
      );

      console.log('res_user_education: ', res_user_education);

      // insert the promotion
      const columns_promotion = ['promotion_name'];
      const values_promotion = [ `${recieved_data.program}`];
      let resPromotion = await insertData(connection, 'promotions', columns_promotion, values_promotion);
      console.log("respromotion: ", resPromotion);

      // insert the user_document
      const columns_document = ['userid', 'profileURL'];
      const values_document = [ `${recieved_data.UserProfileID}`, `${recieved_data.profilePhotoURL}`];
      let resDocument = await insertData(connection, 'user_document', columns_document, values_document);
      console.log("resDocument: ", resDocument);

      // inseFIXME:Dear SIS team, please fix this useEffect to read SIS settings from the databasee.log("resDocument: ", resDocument);
    } else {
      console.log('no student info');
    }

    // TODO: write an info log
    sis_app_logger.info(
      `${new Date()}=received a new active user=${userAgentinfo.os.family}=${
        userAgentinfo.os.major
      }=${userAgentinfo.family}=${userAgentinfo.source}=${
        userAgentinfo.device.family
      }`
    );
    // Send a response to the online application
    // FIXME: Dear SIS developper please handle if the student record inserted or not
    //  if inserted send
    const responseData = { message: 'Received student info' };
    // else send
    // const responseData = { message: 'Failed to insert student info' };
    // the online application will handle the response for further actions
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseData));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    // TODO: Dear SIS developper
    // TODO: write an error log
  }
}
