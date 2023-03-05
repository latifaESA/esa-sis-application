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
import {
  findData,
  Userinfo,
  findmajor_name,
  current_applicant_promotion,
  findmajor_id,
} from '../controller/queries';
import { connect, disconnect } from '../../../utilities/db';

import sis_app_logger from '../logger';
import useragent from 'useragent';

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
      if (user?._id) token._id = user._id;
      if (user?.ID) token.ID = user.ID;
      if (user?.fname && user?.lname)
        token.name = user.fname + ' ' + user.lname;
      if (user?.role) token.role = user.role;
      if (user?.major) token.major = user.major;
      if (user?.mobileNumber) token.mobileNumber = user.mobileNumber;
      if (user?.status) token.status = user.status;
      if (user?.appisSaved) token.appisSaved = user.appisSaved;
      if (user?.promotion) token.promotion = user.promotion;
      if (user?.application_Language)
        token.application_Language = user.application_Language;
      if (user?.profileUrl) token.profileUrl = user.profileUrl;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.ID) session.user.ID = token.ID;
      if (token?.name) session.user.name = token.name;
      if (token?.role) session.user.role = token.role;
      if (token?.major) session.user.major = token.major;
      if (token?.mobileNumber) session.user.mobileNumber = token.mobileNumber;
      if (token?.status) session.user.status = token.status;
      if (token?.appisSaved) session.user.appisSaved = token.appisSaved;
      if (token?.promotion) session.user.promotion = token.promotion;
      if (token?.application_Language)
        session.user.application_Language = token.application_Language;
      if (token?.profileUrl) session.user.profileUrl = token.profileUrl;
      // console.log('Session=', session);
      return session;
    },
    // // route the app to /auth-error instead of /api/auth/error
    // async redirect(URL, { error } = {}) {
    //   const baseUrl = URL.baseUrl;
    //   const url = URL.url;
    //   console.log('-------------------');
    //   console.log('Testing Version:');
    //   console.log('URL==', URL);
    //   console.log('url==', url);
    //   const errorMessage = error?.toString
    //     ? encodeURIComponent(error.toString())
    //     : '';
    //   console.log('route to==', `${baseUrl}/auth-error?error=${errorMessage}`);
    //   console.log('-------------------');
    //   if (error && url === `${baseUrl}/api/auth/error`) {
    //     return `${baseUrl}/auth-error?error=${errorMessage}`;
    //   }
    //   return url;
    // },
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
          const user = await findData(
            connection,
            'email',
            'user_profile',
            credentials.email
          ); //email from req body
          const userinfo = await Userinfo(connection, credentials.email); //email from req body
          // console.log(user);
          // console.log('User In Auth=', user);
          if (user.result) {
            // console.log('User=', user);
            /* Checking if the user is verified and if the user is not obsolete. */
            if (
              bcryptjs.compareSync(
                credentials.password.trim(),
                userinfo.password
              ) &&
              userinfo.status !== 'obsolete' &&
              userinfo.isVerified
            ) {
              if (userinfo) {
                const program = await findmajor_name(
                  connection,
                  userinfo.user_id
                );
                const programid = await findmajor_id(
                  connection,
                  program.program
                );
                const current_app_promotion = await current_applicant_promotion(
                  programid.major_id,
                  userinfo.user_id,
                  connection
                );

                //console.log('User', userinfo)
                //console.log(program.program)
                await disconnect(connection);
                // Write to logger
                if (req) {
                  // Log user information
                  // userinfo.role ==='1'?
                  sis_app_logger.info(
                    `${new Date()}=${userinfo.role}=login=${req.body.email}=${
                      userAgentinfo.os.family
                    }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
                      userAgentinfo.source
                    }=${userAgentinfo.device.family}`
                  );
                }

                return {
                  _id: userinfo.user_id,
                  ID: userinfo.user_id,
                  name: userinfo.firstname + ' ' + userinfo.lastname,
                  email: userinfo.email,
                  major: program.program,
                  status: userinfo.status,
                  appisSaved: userinfo.appisSaved,
                  application_Language: userinfo.application_Language,
                  mobileNumber: userinfo.mobile_number,
                  role: userinfo.role,
                  profileUrl: userinfo.profileUrl,
                  promotion: current_app_promotion.current_applicants_promotion,
                };
              }
            } else {
              /* Checking if the password is correct. */
              if (
                !bcryptjs.compareSync(credentials.password, userinfo.password)
              ) {
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
              /* Checking if the user is obsolete. */
              if (userinfo.status === 'obsolete') {
                message =
                  'Your application has been created a year ago and thus you need to submit a new application ';
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
              /* Checking if the user student is verified or not. */
              if (!userinfo.isVerified && userinfo.role === '1') {
                message =
                  'Account Not Activated, Please Check Your Email Indox!';
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
              // case where admin account was locked by the super admin
              if (!userinfo.isVerified && userinfo.role !== '1') {
                message = 'Account Is Locked Contact The Admin!';
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
            }
          } else {
            message =
              'Invalid Email:the account is not found, submit a new application';
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
