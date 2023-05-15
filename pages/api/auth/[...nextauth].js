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
import { findData } from '../controller/queries';
import axios from 'axios';
import https from 'https';
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
    async jwt({ token, user }) {
      if (user?.name) token.name = user.name;
      if (user?.email) token.email = user.email;
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token?.name) session.user.name = token.name;
      if (token?.email) session.user.email = token.email;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },

  useWebSocket: false, // disable WebSocket
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        let message = '';
        const userAgent = req.headers['user-agent'];
        const userAgentinfo = useragent.parse(userAgent);
        const connection = await connect();
        if (connection.success) {
          console.log('connection to DB succes nextauth signin');

          // try {
          //   const results = await new Promise((resolve, reject) => {
          //     connection.query(`SELECT * from users WHERE userid = ${credentials.email}`, (err, res) => {
          //       if (err) {
          //         reject(err);
          //       } else {
          //         resolve(res.rows);
          //       }
          //     });
          //   });
          //   console.log(results);
          // } catch (err) {
          //   console.error(err);
          // }

          // get the user info
          const user = await findData(
              connection,
              'users',
              'userid',
              credentials.email,
            );
            console.log(user)
          //  check if there is user with the given id
          if(user.rowCount > 0){
            // check if the password is correct
            if(bcryptjs.compareSync(credentials.password.trim(),user.rows[0].userpassword)){
               
              // check if the user completed the survey
              // change to 6 at last
                try {
                let {data} = await axios.get('https://survey.esa.edu.lb/BPI/PathwayService.svc/PWGetUserPreventAccess?pathway=140&userid=201705637', {
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                })
                })
                console.log(data.blocked)
                // if the user did not complete the survey then send the links
                if(data.blocked){
                  try{

                  let {data} = await axios.get('https://survey.esa.edu.lb/BPI/PathwayService.svc/PWBlueTasks?pathway=140&userid=201705637&SubjectIDs=2022_EMBA-CC-08_01,2022_EMBA-S-04_01,2022_EMBA-EC-03_02,2022_EMBA-EC-09_01', {

                    httpsAgent: new https.Agent({
                      rejectUnauthorized: false,
                    })
                    })
                    console.log(data.Tasks)
                    // return {data};
                    message = JSON.stringify(data);
             
                  }catch (error) {
                    console.log('the error is: ', error)
                    message = JSON.stringify(error);
                }
                }else{
                      // check if the user is admin
                      if(user.rows[0].role === 0){
                        // get the admin data
                        const admin = await findData(
                          connection,
                          'admin',
                          'adminid',
                          user.rows[0].userid,
                        );
                        // if the admin exists then send the data to frontend
                    if(admin.rows){

                      await disconnect(connection);
                      // Write to logger
                      if (req) {
                        // Log user information
                        // userinfo.role ==='1'?
                        sis_app_logger.info(
                          `${new Date()}=${user.rows[0].role}=login=${req.body.email}=${
                            userAgentinfo.os.family
                          }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                            userAgentinfo.source
                          }=${userAgentinfo.device.family}`
                        );
                      }
                      console.log('user.rows[0].role==',user.rows[0].role);
                      return {
                                name: admin.rows[0].adminname,
                                email: admin.rows[0].adminemail,
                                role: (user.rows[0].role).toString(),
                              };
                      }else{
                        // if the admin is not exists then send this message to frontend
                        message = 'Admin is not exists'
                      }
                    }else if(user.rows[0].role === 1){
                      // get the student data
                      const ST = await findData(
                        connection,
                        'student',
                        'student_id',
                        user.rows[0].userid,
                      );
                      console.log(user.rows[0].userid)
                      console.log(ST)
                      // if the program_manager exists then send the data to frontend
                  if(ST.rows){

                    await disconnect(connection);
                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${user.rows[0].role}=login=${req.body.email}=${
                          userAgentinfo.os.family
                        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                          userAgentinfo.source
                        }=${userAgentinfo.device.family}`
                      );
                    }

                    return {
                              name: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                              email: `${ST.rows[0].student_firstname} ${ST.rows[0].student_lastname}`,
                              role: (user.rows[0].role).toString(),
                            };
                    }else{
                      // if the student is not exists then send this message to frontend
                      message = 'Student is not exists'
                    }
                  }else if(user.rows[0].role === 2){
                      // get the program_manager data
                      const PM = await findData(
                        connection,
                        'program_manager',
                        'pm_id',
                        user.rows[0].userid,
                      );
                      console.log(user.rows[0].userid)
                      console.log(PM)
                      // if the program_manager exists then send the data to frontend
                  if(PM.rows){

                    await disconnect(connection);
                    // Write to logger
                    if (req) {
                      // Log user information
                      // userinfo.role ==='1'?
                      sis_app_logger.info(
                        `${new Date()}=${user.rows[0].role}=login=${req.body.email}=${
                          userAgentinfo.os.family
                        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                          userAgentinfo.source
                        }=${userAgentinfo.device.family}`
                      );
                    }

                    return {
                              name: `${PM.rows[0].pm_firstname} ${PM.rows[0].pm_lastname}`,
                              email: PM.rows[0].pm_email,
                              role: (user.rows[0].role).toString(),
                            };
                    }else{
                      // if the program manager is not exists then send this message to frontend
                      message = 'Program manager is not exists'
                    }
                  }else if(user.rows[0].role === 3){
                    // get the program_manager_assistance data
                    const AS = await findData(
                      connection,
                      'program_manager_assistance',
                      'pm_ass_id',
                      user.rows[0].userid,
                    );
                    console.log(user.rows[0].userid)
                    console.log(AS)
                    // if the program_manager_assistance exists then send the data to frontend
                if(AS.rows){

                  await disconnect(connection);
                  // Write to logger
                  if (req) {
                    // Log user information
                    // userinfo.role ==='1'?
                    sis_app_logger.info(
                      `${new Date()}=${user.rows[0].role}=login=${req.body.email}=${
                        userAgentinfo.os.family
                      }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                        userAgentinfo.source
                      }=${userAgentinfo.device.family}`
                    );
                  }

                  return {
                            name: `${AS.rows[0].pm_ass_firstname} ${AS.rows[0].pm_ass_lastname}`,
                            email: AS.rows[0].pm_ass_email,
                            role: (user.rows[0].role).toString(),
                          };
                  }else{
                    // if the admin is not exists then send this message to frontend
                    message = 'Program manager assistance is not exists'
                  }
                }
                    
                }
                console.log(data)          
                  } catch (error) {
                      console.log('the error is: ', error)
                      return {error};
                  }
              // message = 'hello'
          }else{
            // if the password is incorrect then send this message
            message = 'Invalid Password';
                sis_app_logger.error(
                  `${new Date()}=From nextauth signin=---=${
                    req.body.email
                  }=${message}=${userAgentinfo.os.family}=${
                    userAgentinfo.os.major
                  }=${userAgentinfo.family}=${userAgentinfo.source}=${
                    userAgentinfo.device.family
                  }`
                );
          }
                }else{
                  message = "user is not exists";
                }


          // connection.end();

          // const user = await findData(
          //   connection,
          //   'email',
          //   'user_profile',
          //   credentials.email
          // ); //email from req body

          // const userinfo = await Userinfo(connection, credentials.email); //email from req body
          // // console.log(user);
          // // console.log('User In Auth=', user);
          // if (user.result) {
          //   // console.log('User=', user);
          //   /* Checking if the user is verified and if the user is not obsolete. */
          //   if (
          //     bcryptjs.compareSync(
          //       credentials.password.trim(),
          //       userinfo.password
          //     ) &&
          //     userinfo.status !== 'obsolete' &&
          //     userinfo.isVerified
          //   ) {
          //     if (userinfo) {
          //       const program = await findmajor_name(
          //         connection,
          //         userinfo.user_id
          //       );
          //       const programid = await findmajor_id(
          //         connection,
          //         program.program
          //       );
          //       const current_app_promotion = await current_applicant_promotion(
          //         programid.major_id,
          //         userinfo.user_id,
          //         connection
          //       );

          //       //console.log('User', userinfo)
          //       //console.log(program.program)
          //       await disconnect(connection);
          //       // Write to logger
          //       if (req) {
          //         // Log user information
          //         // userinfo.role ==='1'?
          //         sis_app_logger.info(
          //           `${new Date()}=${userinfo.role}=login=${req.body.email}=${
          //             userAgentinfo.os.family
          //           }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          //             userAgentinfo.source
          //           }=${userAgentinfo.device.family}`
          //         );
          //       }

          //       return {
          //         _id: userinfo.user_id,
          //         ID: userinfo.user_id,
          //         name: userinfo.firstname + ' ' + userinfo.lastname,
          //         email: userinfo.email,
          //         major: program.program,
          //         status: userinfo.status,
          //         appisSaved: userinfo.appisSaved,
          //         application_Language: userinfo.application_Language,
          //         mobileNumber: userinfo.mobile_number,
          //         role: userinfo.role,
          //         profileUrl: userinfo.profileUrl,
          //         promotion: current_app_promotion.current_applicants_promotion,
          //       };
          //     }
          //   } else {
          //     /* Checking if the password is correct. */
          //     if (
          //       !bcryptjs.compareSync(credentials.password, userinfo.password)
          //     ) {
          //       message = 'Invalid Password';
          //       sis_app_logger.error(
          //         `${new Date()}=From nextauth signin=---=${
          //           req.body.email
          //         }=${message}=${userAgentinfo.os.family}=${
          //           userAgentinfo.os.major
          //         }=${userAgentinfo.family}=${userAgentinfo.source}=${
          //           userAgentinfo.device.family
          //         }`
          //       );
          //     }
          //     /* Checking if the user is obsolete. */
          //     if (userinfo.status === 'obsolete') {
          //       message =
          //         'Your application has been created a year ago and thus you need to submit a new application ';
          //       sis_app_logger.error(
          //         `${new Date()}=From nextauth signin=---=${
          //           req.body.email
          //         }=${message}=${userAgentinfo.os.family}=${
          //           userAgentinfo.os.major
          //         }=${userAgentinfo.family}=${userAgentinfo.source}=${
          //           userAgentinfo.device.family
          //         }`
          //       );
          //     }
          //     /* Checking if the user student is verified or not. */
          //     if (!userinfo.isVerified && userinfo.role === '1') {
          //       message =
          //         'Account Not Activated, Please Check Your Email Indox!';
          //       sis_app_logger.error(
          //         `${new Date()}=From nextauth signin=---=${
          //           req.body.email
          //         }=${message}=${userAgentinfo.os.family}=${
          //           userAgentinfo.os.major
          //         }=${userAgentinfo.family}=${userAgentinfo.source}=${
          //           userAgentinfo.device.family
          //         }`
          //       );
          //     }
          //     // case where admin account was locked by the super admin
          //     if (!userinfo.isVerified && userinfo.role !== '1') {
          //       message = 'Account Is Locked Contact The Admin!';
          //       sis_app_logger.error(
          //         `${new Date()}=From nextauth signin=---=${
          //           req.body.email
          //         }=${message}=${userAgentinfo.os.family}=${
          //           userAgentinfo.os.major
          //         }=${userAgentinfo.family}=${userAgentinfo.source}=${
          //           userAgentinfo.device.family
          //         }`
          //       );
          //     }
          //   }
          // } else {
          //   message =
          //     'Invalid Email:the account is not found, submit a new application';
          //   sis_app_logger.error(
          //     `${new Date()}=From nextauth signin=---=${
          //       req.body.email
          //     }=${message}=${userAgentinfo.os.family}=${
          //       userAgentinfo.os.major
          //     }=${userAgentinfo.family}=${userAgentinfo.source}=${
          //       userAgentinfo.device.family
          //     }`
          //   );
          // }
        } //(!connection.success)
        else {
          console.log('connection to DB unsucces nextauth signin');
          message = connection.message;
          sis_app_logger.error(
            `${new Date()}=From nextauth signin,connection unsuccess=---=${
              req.body.email
            }=${message}=${userAgentinfo.os.family}=${userAgentinfo.os.major}=${
              userAgentinfo.family
            }=${userAgentinfo.source}=${userAgentinfo.device.family}`
          );
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
