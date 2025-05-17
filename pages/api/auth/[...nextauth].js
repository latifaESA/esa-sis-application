/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\auth\[...nextauth].js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
/* Importing the required modules. */

import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { addStudentActivityToLogs } from '../controller/queries';
import { getStudentFromBlueForLogs } from '../controller/queries';

// import {
//   findData,
//   Userinfo,
//   findmajor_name,
//   current_applicant_promotion,
//   findmajor_id,
// } from '../controller/queries';
import { connect, disconnect } from '../../../utilities/db';


import sis_app_logger from '../logger';
import useragent from 'useragent';
import {
  findData,
  updateStatusBlue,
  updateStatusPreBlue,
} from '../controller/queries';
import { Userinfo } from '../controller/accountquery';
import axios from 'axios';
import https from 'https';
// import { start } from "repl";


// import client from '../../../utilities/db1'

// // Import cors
// import cors from 'cors';

// // Define the cors options
// const corsOptions = {
//   origin: '*', // Change this to a more specific origin in production
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
// };

// export default NextAuth({
export const authOptions = {
  /* A session strategy that is used to store the session data in the browser. */
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 6 * 1 * 60 * 60, //Hour
    // after xx min, the session expire:if the user has not interacted with the application for the duration of the session expiration time,the user don't made a request to the server, close the browser without logout,the auto-save function writes to the database without any user interaction, it may not be enough to keep the session active. In most cases, the session expiration time is based on user activity or interaction with the application, rather than automated background processes.
  },
  /* A callback function that is called by the `next-auth` module. */
  callbacks: {
    /* A function that is called by the `next-auth` module. */
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.user.name;
        return token
      }
      if (user?.name) token.name = user.name;
      if (user?.email) token.email = user.email;
      if (user?.role) token.role = user.role;
      if (user?.status) token.status = user.status;
      if (user?.accessToken) token.accessToken = user.accessToken;
      // if (user?.appisSaved) token.appisSaved = user.appisSaved;
      if (user?.userid) token.userid = user.userid;
      if (user?.ID) token.ID = user.ID;
      if (user?.majorName) token.majorName = user.majorName;
      if (user?.majorid) token.majorid = user.majorid;
      if (user?.promotion) token.promotion = user.promotion;
      if (user?.hasMultiMajor) token.hasMultiMajor = user.hasMultiMajor;
      if (user?.email) token.email = user.email;
      if (user?.profileurl) token.profileurl = user.profileurl;
      if (user?.pimsId) token.pimsId = user.pimsId;
      if (user?.extramajorid) token.extramajorid = user.extramajorid;
      if (user?.user_extra_id) token.user_extra_id = user.user_extra_id;
      if (user?.extraPromotion) token.extraPromotion = user.extraPromotion;
      return token;
    },
    async session({ session, token }) {
      if (token?.name) session.user.name = token.name;
      if (token?.accessToken) session.accessToken = token.accessToken;
      if (token?.email) session.user.email = token.email;
      if (token?.role) session.user.role = token.role;
      if (token?.status) session.user.status = token.status;
      if (token?.userid) session.user.userid = token.userid;
      if (token?.ID) session.user.ID = token.ID;
      if (token?.majorid) session.user.majorid = token.majorid;
      if (token?.promotion) session.user.promotion = token.promotion;
      if (token?.majorName) session.user.majorName = token.majorName;
      if (token?.hasMultiMajor) session.user.hasMultiMajor = token.hasMultiMajor;
      if (token?.email) session.user.email = token.email;
      // if (token?.appisSaved) session.user.appisSaved = token.appisSaved;
      if (token?.profileurl) session.user.image = token.image;
      if (token?.pimsId) session.user.pimsId = token.pimsId;
      if (token?.extramajorid) session.user.extramajorid = token.extramajorid;
      if (token?.user_extra_id) session.user.user_extra_id = token.user_extra_id;
      if (token?.extraPromotion) session.user.extraPromotion = token.extraPromotion;
      return session;
    },
  },

  useWebSocket: false, // disable WebSocket
  providers: [
    CredentialsProvider({
      // credentials: {
      //   userid: { label: "userid", type: "text"},
      //   password: { label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        let message = '';
        const userAgent = req.headers['user-agent'];
        const userAgentinfo = useragent.parse(userAgent);
        const connection = await connect();
        if (connection._connected) {

          // get the user info
          // const user = await findData(
          //   connection,
          //   'users',
          //   'userid',
          //   credentials.userid
          // );
          const user = await findData(
            connection,
            'users',
            'email',
            credentials.userid
          );

          let userinfoRowUser = user.rows[0]; // default to rows[0]
          if (userinfoRowUser.role === 1) {
            const extInfoUser = await findData(
              connection,
              'extra_user',
              'userid',
              user.rows[0].userid
            );
  
            if (extInfoUser.rowCount > 0 && user.rows.length > 1) {
              userinfoRowUser = user.rows[1]; // use second entry if exists
            }
          }
          // Check if user has extra info
        

          const userinfo = await Userinfo(connection, credentials.userid); //email from req bod
          let userinfoRow = userinfo.rows[0]; // default to rows[0]
          // Check if user has extra info
          const extInfo = await findData(
            connection,
            'extra_user',
            'userid',
            userinfo.rows[0].userid
          );

          if (extInfo.rowCount > 0 && userinfo.rows.length > 1) {
            userinfoRow = userinfo.rows[1]; // use second entry if exists
          }
          // console.log("---------------------------------")
          //  check if there is user with the given id
          if (user.rowCount > 0) {
            // check if the password is correct
            if (
              bcryptjs.compareSync(
                credentials.password.trim(),
                userinfoRowUser.userpassword
              )
            ) {
              // check if the user completed the survey
              // change to 6 at last
              // 201705636
              try {
                let { data } = await axios.get(
                  // FIXME: Dear SIS Developper use process.env to retrive the Blue HOST
                  `https://survey.esa.edu.lb/BPI/PathwayService.svc/PWGetUserPreventAccess?pathway=140&userid=${parseInt(
                    userinfoRowUser.userid
                  )}`,
                  {
                    //    let {data} = await axios.get(`https://survey.esa.edu.lb/BPI/PathwayService.svc/PWGetUserPreventAccess?pathway=140&userid=${credentials.email}`, {

                    httpsAgent: new https.Agent({
                      rejectUnauthorized: false,
                    }),
                  }
                );
                if (data.blocked) {
                  await updateStatusBlue(
                    connection,
                    userinfoRowUser.userid
                  );
                  // console.log('status blue', status);

                  const WeeklyLogs = await getStudentFromBlueForLogs(
                    connection,
                    userinfoRowUser.userid
                  );

                  if (WeeklyLogs.rowCount != 0) {

                    const lastLoginDate =
                      WeeklyLogs.rows[WeeklyLogs.rows.length - 1];

                    // console.log(lastLoginDate.date_time);

                    // get the date from db
                    const dateToday = lastLoginDate.date_time;
                    const [day, month, year] = dateToday.split('-').map(Number);
                    const dateObject = new Date(year, month - 1, day);

                    // Calculate a week from now
                    const oneWeekLater = new Date(dateObject);
                    oneWeekLater.setDate(dateObject.getDate() + 7);

                    // Format the date one week from now
                    const formattedOneWeekLater = `${oneWeekLater
                      .getDate()
                      .toString()
                      .padStart(2, '0')}-${(oneWeekLater.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${oneWeekLater.getFullYear()}`;

                    // console.log("Original Date:", formattedDate); // Output: "14-09-2023"

                    // eslint-disable-next-line no-inner-declarations

                    const formatDate = (date) => {
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0');
                      const year = date.getFullYear().toString();
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, '0');
                      const formattedDate = `${day}-${month}-${year}-${hours}:${minutes}`;
                      return formattedDate;
                    }
                    const currentDate = new Date();
                    const formattedCurrentDate = formatDate(currentDate);

                    if (
                      formattedOneWeekLater < formattedCurrentDate.slice(0, 10)
                    ) {
                      // console.log('ana jouet l if date format');
                      // eslint-disable-next-line no-unused-vars
                      await addStudentActivityToLogs(
                        connection,
                        data.userid,
                        'status',
                        'limited',
                        data.description,
                        'Blue',
                        formattedCurrentDate
                      );

                    }
                  } else {
                    // eslint-disable-next-line no-inner-declarations
                    function formatDate(date) {
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0');
                      const year = date.getFullYear().toString();
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, '0');
                      const formattedDate = `${day}-${month}-${year}-${hours}:${minutes}`;
                      return formattedDate;
                    }
                    const currentDate = new Date();
                    const formattedCurrentDate = formatDate(currentDate);

                    await addStudentActivityToLogs(
                      connection,
                      data.userid,
                      'status',
                      'limited',
                      data.description,
                      'Blue',
                      formattedCurrentDate
                    );
                    // console.log(insertToLogs);
                  }
                  if (userinfoRowUser.role === 1) {
                    // get the student data
                    const ST = await findData(
                      connection,
                      'student',
                      'student_id',
                      userinfoRowUser.userid
                    );


                    const ST_FIN = await findData(
                      connection,
                      'student_financial',
                      'student_financial_id',
                      userinfoRowUser.userid
                    );

                    const ST_Con = await findData(
                      connection,
                      'user_contact',
                      'userid',
                      userinfoRowUser.userid
                    );

                    const ST_major = await findData(
                      connection,
                      "major",
                      "major_id",
                      ST_major.rows[0].major_id
                    );
                    console.log('ST_major', ST_major)
                    const ST_Ext = await findData(
                      connection,
                      'extra_user',
                      'email',
                      ST_Con.rows[0].email
                    );

                    // console.log('this is ST ');
                    // console.log(ST);
                    // if the program_manager exists then send the data to frontend
                    if (ST.rows) {
                      await disconnect(connection);
                      // Write to logger
                      if (req) {

                        // Log user information
                        // userinfo.role ==='1'?
                        sis_app_logger.info(
                          `${new Date()}=${userinfoRowUser.role}=login=${req.body.userid
                          }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                          }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                          }`
                        );

                        return {
                          name: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                          // email: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                          role: userinfoRowUser.role.toString(),
                          email: `${ST_Con.rows[0].email}`,
                          status: `${data.blocked ? 'limited' : 'active'}`,
                          userid: `${userinfoRowUser.userid}`,
                          image:userinfoRow.profileurl,
                          accessToken: `${userinfoRowUser.access_token}`,
                          majorid: ST.rows[0].major_id,
                          promotion: ST.rows[0].promotion,
                          majorName: ST_major.rows[0].major_name,
                          extramajorid: `${ST_Ext.rows[0].majorid}`,
                          hasMultiMajor: `${ST_Ext.rowCount > 0 ? true : false}`,
                          user_extra_id: ST_Ext.rowCount > 0 ? ST_Ext.rows[0].userid : '',
                          extraPromotion: `${ST_Ext.rows[0].promotion}`,
                          pimsId: ST_FIN.rowCount > 0 ? ST_FIN.rows[0].pims_id : ''
                        };
                      } else {
                        // if the student is not exists then send this message to frontend
                        message = 'Student does not exists';
                      }
                    }
                  }
                } else {

                  if (userinfoRowUser.role === 1) {
                    // get the student data
                    const ST = await findData(
                      connection,
                      'student',
                      'student_id',
                      userinfoRowUser.userid
                    );

                    const ST_FIN = await findData(
                      connection,
                      'student_financial',
                      'stundent_financial_id',
                      userinfoRowUser.userid
                    );

                    const ST_major = await findData(
                      connection,
                      'major',
                      'major_id',
                      ST.rows[0].major_id
                    )

                    const ST_Con = await findData(
                      connection,
                      'user_contact',
                      'userid',
                      userinfoRowUser.userid
                    );

                    const ST_Ext = await findData(
                      connection,
                      'extra_user',
                      'email',
                      ST_Con.rows[0].email
                    );
                    console.log('ST_Ext', ST_Ext.rowCount > 0)

                    if (ST.rows[0].status === 'limited') {
                      await updateStatusPreBlue(
                        connection,
                        userinfoRowUser.userid
                      )

                    }
                    // console.log('this is ST ');
                    // console.log(ST);
                    // if the program_manager exists then send the data to frontend
                    if (ST.rows) {


                      await disconnect(connection);
                      // Write to logger
                      if (req) {
                        // Log user information
                        // userinfo.role ==='1'?

                        sis_app_logger.info(
                          `${new Date()}=${userinfoRowUser.role}=login=${req.body.userid
                          }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                          }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                          }`
                        );
                        // console.log('name', `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                        //                           // email: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                        //                           'role', userinfoRowUser.role.toString(),
                        //                           'status', `${data.blocked ? 'limited' : 'active'}`,
                        //                           'userid', `${userinfoRowUser.userid}`,
                        //                           'accessToken' ,`${userinfoRowUser.access_token}`,
                        //                           'image', userinfo.rows[0].profileurl,
                        //                           'majorid', ST.rows[0].major_id,
                        //                           'majorName', ST_major.rows[0].major_name,
                        //                           'promotion', ST.rows[0].promotion
                        //                           )
                        return {
                          name: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                          // email: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                          role: userinfoRowUser.role.toString(),
                          status: `${data.blocked ? 'limited' : 'active'}`,
                          userid: `${userinfoRowUser.userid}`,
                          accessToken: `${userinfoRowUser.access_token}`,
                          image: userinfoRow.profileurl,
                          majorid: ST.rows[0].major_id,
                          // email: user.ST_Con[0].email,
                          extramajorid: ST_Ext.rowCount > 0 ? `${ST_Ext.rows[0].majorid}` : '',
                          majorName: ST_major.rows[0].major_name,
                          promotion: ST.rows[0].promotion,
                          hasMultiMajor: `${ST_Ext.rowCount > 0 ? true : false}`,
                          email: `${ST_Con.rows[0].email}`,
                          extraPromotion: ST_Ext.rowCount > 0 ? `${ST_Ext.rows[0].promotion}` : '',
                          pimsId: ST_FIN.rowCount > 0 ? ST_FIN.rows[0].pims_id : '',
                          user_extra_id: ST_Ext.rowCount > 0 ? ST_Ext.rows[0].userid : '',
                        };
                      } else {
                        // if the student is not exists then send this message to frontend
                        message = 'Student does not exists';
                      }
                    }
                  }
                }
                // console.log("=======================");
                // console.log(data.blocked);
                // console.log(data);
                // if the user did not complete the survey then send the links
                // if(data.blocked){

                //   try{

                //   let {data} = await axios.get(`https://survey.esa.edu.lb/BPI/PathwayService.svc/PWBlueTasks?pathway=140&userid=${userinfoRowUser.userid}&SubjectIDs=2022_EMBA-CC-08_01,2022_EMBA-S-04_01,2022_EMBA-EC-03_02,2022_EMBA-EC-09_01`, {

                //   httpsAgent: new https.Agent({
                //       rejectUnauthorized: false,
                //     })
                //     })
                //     // console.log(data.Tasks)
                //     console.log('==========-=-=-=-=')
                //     console.log(data.StatusCode)
                //     console.log('==========-=-=-=-=')
                //     // return {data};
                //     message = JSON.stringify(data);

                //     const ST = await findData(
                //       connection,
                //       'student',
                //       'student_id',
                //       userinfoRowUser.userid,

                //     let {data} = await axios.get(`https://survey.esa.edu.lb/BPI/PathwayService.svc/PWBlueTasks?pathway=140&userid=${credentials.email}&SubjectIDs=2022_EMBA-CC-08_01,2022_EMBA-S-04_01,2022_EMBA-EC-03_02,2022_EMBA-EC-09_01`, {

                //     );
                //     if(ST.rows){

                // check if the user is admin
                if (userinfoRowUser.role === 0) {
                  // get the admin data
                  const admin = await findData(
                    connection,
                    'admin',
                    'adminid',
                    userinfoRowUser.userid
                  );
                  // if the admin exists then send the data to frontend
                  if (admin.rows) {
                    await disconnect(connection);
                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${userinfoRowUser.role}=login=${req.body.userid
                        }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                        }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                        }`
                      );
                    }
                    // console.log('userinfoRowUser.role==', userinfoRowUser.role);
                    // console.log(userinfoRowUser);
                    // console.log('userinfo.rows[0]==', userinfo.rows[0]);

                    return {
                      name: `${admin.rows[0].admin_firstname}  ${admin.rows[0].admin_lastname}`,
                      email: admin.rows[0].adminemail,
                      status: admin.rows[0].admin_status,
                      role: userinfoRowUser.role.toString(),
                      userid: `${userinfoRowUser.userid}`,
                      image: userinfoRow.profileurl,
                    };
                  } else {
                    // if the admin is not exists then send this message to frontend
                    message = 'Admin does not exists';
                  }
                }

                else if (userinfoRowUser.role === 2) {
                  // get the program_manager data
                  const PM = await findData(
                    connection,
                    'program_manager',
                    'pm_id',
                    userinfoRowUser.userid
                  );
                  const pm_major = await findData(
                    connection,
                    'major',
                    'major_id',
                    PM.rows[0].major_id
                  )
                  const extra = await findData(
                    connection,
                    'program_manager_extra_major',
                    'pm_id',
                    PM.rows[0].pm_id
                  )
                  const isExtra = extra.rowCount
                  // console.log(isExtra >0)
                  // console.log(userinfoRowUser.userid);
                  // console.log(PM);
                  // if the program_manager exists then send the data to frontend
                  if (PM.rows) {
                    await disconnect(connection);


                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${userinfoRowUser.role}=login=${req.body.userid
                        }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                        }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                        }`
                      );
                    }

                    return {
                      //<<<<<<< batoul
                      //                              name: `${PM.rows[0].pm_firstname} ${PM.rows[0].pm_lastname}`,
                      //                              email: PM.rows[0].pm_email,
                      //                              majorid: PM.rows[0].major_id,
                      //                              role: (userinfoRowUser.role).toString(),
                      //                              userid: userinfoRowUser.userid,
                      //                              image: userinfo.rows[0].profileurl
                      //
                      //                            };
                      //                    }else{
                      //                      // if the program manager is not exists then send this message to frontend
                      //                      message = 'Program manager does not exists'
                      //                    }
                      //                  }else if(userinfoRowUser.role === 3){
                      //                    // get the program_manager_assistance data
                      //                    const AS = await findData(
                      //                      connection,
                      //                      'program_manager_assistance',
                      //                      'pm_ass_id',
                      //                      userinfoRowUser.userid,
                      //                    );
                      //                    console.log(userinfoRowUser.userid)
                      //                    console.log(AS)
                      //                    // if the program_manager_assistance exists then send the data to frontend
                      //                if(AS.rows){
                      //
                      //                  await disconnect(connection);
                      //                  // Write to logger
                      //                  if (req) {
                      //                    // Log user information
                      //                    // userinfo.role ==='1'?
                      //                    sis_app_logger.info(
                      //                      `${new Date()}=${userinfoRowUser.role}=login=${req.body.email}=${
                      //                        userAgentinfo.os.family
                      //                      }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                      //                        userAgentinfo.source
                      //                      }=${userAgentinfo.device.family}`
                      //                    );
                      //=======
                      name: `${PM.rows[0].pm_firstname} ${PM.rows[0].pm_lastname}`,
                      email: PM.rows[0].pm_email,
                      role: userinfoRowUser.role.toString(),
                      status: PM.rows[0].pm_status,
                      userid: userinfoRowUser.userid,
                      majorid: PM.rows[0].major_id,
                      majorName: pm_major.rows[0].major_name,
                      hasMultiMajor: `${isExtra > 0 ? true : false}`,
                      image: userinfoRow.profileurl,
                    };
                  } else {
                    // if the program manager is not exists then send this message to frontend
                    message = 'Program manager does not exists';
                  }
                } else if (userinfoRowUser.role === 3) {
                  // get the program_manager_assistance data
                  const AS = await findData(
                    connection,
                    'program_manager_assistance',
                    'pm_ass_id',
                    userinfoRowUser.userid
                  );
                  const pm_major = await findData(
                    connection,
                    'major',
                    'major_id',
                    AS.rows[0].major_id
                  )

                  const extra = await findData(
                    connection,
                    'program_manager_assistance_extra_major',
                    'pm_ass_id',
                    AS.rows[0].pm_ass_id
                  )
                  const isExtra = extra.rowCount
                  // console.log(userinfoRowUser.userid);
                  // console.log(AS);
                  // if the program_manager_assistance exists then send the data to frontend
                  if (AS.rows) {
                    await disconnect(connection);
                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${userinfoRowUser.role}=login=${req.body.email
                        }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                        }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                        }`
                      );
                    }

                    return {
                      name: `${AS.rows[0].pm_ass_firstname} ${AS.rows[0].pm_ass_lastname}`,
                      email: AS.rows[0].pm_ass_email,
                      role: userinfoRowUser.role.toString(),
                      userid: userinfoRowUser.userid,
                      status: AS.rows[0].pm_ass_status,
                      majorid: AS.rows[0].major_id,
                      majorName: pm_major.rows[0].major_name,
                      image: userinfoRow.profileurl,
                      hasMultiMajor: `${isExtra > 0 ? true : false}`,

                    };
                  } else {
                    // if the admin is not exists then send this message to frontend
                    message = 'Program manager assistance does not exists';
                  }
                  //=======
                  //                      name: `${PM.rows[0].pm_firstname} ${PM.rows[0].pm_lastname}`,
                  //                     email: PM.rows[0].pm_email,
                  //                     role: userinfoRowUser.role.toString(),
                  //                     userid: userinfoRowUser.userid,
                  //                     image: userinfo.rows[0].profileurl,
                  //                  };
                  //                 } else {
                  //                   // if the program manager is not exists then send this message to frontend
                  //                   message = 'Program manager does not exists';
                  // />>>>>>> main
                } else if (userinfoRowUser.role === 4) {
                  // get the admin data
                  const admin = await findData(
                    connection,
                    'admin',
                    'adminid',
                    userinfoRowUser.userid
                  );
                  // if the admin exists then send the data to frontend
                  if (admin.rows) {
                    await disconnect(connection);
                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${userinfoRowUser.role}=login=${req.body.userid
                        }=${userAgentinfo.os.family}=${userAgentinfo.os.major
                        }=${userAgentinfo.family}=${userAgentinfo.source}=${userAgentinfo.device.family
                        }`
                      );
                    }
                    // console.log('userinfoRowUser.role==', userinfoRowUser.role);
                    // console.log(userinfoRowUser);
                    console.log('userinfo.rows[0]==', userinfo.rows[0]);

                    return {
                      name: `${admin.rows[0].admin_firstname}  ${admin.rows[0].admin_lastname}`,
                      email: admin.rows[0].adminemail,
                      status: admin.rows[0].admin_status,
                      role: userinfoRowUser.role.toString(),
                      userid: `${userinfoRowUser.userid}`,
                      image: userinfoRow.profileurl,
                    };
                  } else {
                    // if the admin is not exists then send this message to frontend
                    message = 'Super Admin does not exists';
                  }
                }
                // } else if (userinfoRowUser.role === 3) {
                //   // get the program_manager_assistance data
                //   const AS = await findData(
                //     connection,
                //     'program_manager_assistance',
                //     'pm_ass_id',
                //     user.rows[0].userid
                //   );
                //   console.log(user.rows[0].userid);
                //   console.log(AS);
                //   // if the program_manager_assistance exists then send the data to frontend
                //   if (AS.rows) {
                //     await disconnect(connection);
                //     // Write to logger
                //     if (req) {
                //       // Log user information
                //       // userinfo.role ==='1'?
                //       sis_app_logger.info(
                //         `${new Date()}=${user.rows[0].role}=login=${
                //           req.body.email
                //         }=${userAgentinfo.os.family}=${
                //           userAgentinfo.os.major
                //         }=${userAgentinfo.family}=${userAgentinfo.source}=${
                //           userAgentinfo.device.family
                //         }`
                //       );
                //     }

                //     return {
                //       name: `${AS.rows[0].pm_ass_firstname} ${AS.rows[0].pm_ass_lastname}`,
                //       email: AS.rows[0].pm_ass_email,
                //       role: user.rows[0].role.toString(),
                //       userid: user.rows[0].userid,
                //       // image: userinfo.rows[0].profileurl,
                //     };
                //   } else {
                //     // if the admin is not exists then send this message to frontend
                //     message = 'Program manager assistance does not exists';
                //   }
                // }

                // }
                // end of if data.bloked
                // console.log(data);
              } catch (error) {
                // console.log('the error is: ', error);
                return { error };
              }
              // message = 'hello'
            } else {
              // if the password is incorrect then send this message
              message = 'Invalid Password';

            }
          } else {
            message = 'user does not exist';
          }

        } //(!connection.success)
        else {
          // console.log('connection to DB unsucces nextauth signin');
          message = connection.message;
        }

        await disconnect(connection);
        throw new Error(message);
      },
    }),
  ],

  // random string used to hash tokens, sign cookies and generate cryptographic keys
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);

// export default cors(corsOptions)(NextAuth(authOptions));
