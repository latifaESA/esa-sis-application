/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\verifyemail.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
/* Importing the required modules. */
import UserProfile from '../../../models/user/ProfileModel';
import db from '../../../utilities/connectToDb';
import { connect, disconnect } from '../../../utilities/db';
import { findData, UpdateToken } from '../controller/queries';
import decrypt from '../../../utilities/encrypt_decrypt/decryptText';
import encrypt from '../../../utilities/encrypt_decrypt/encryptText';
import selection_data from '../../../utilities/selection_data';
import sis_app_logger from '../../api/logger';
import useragent from 'useragent';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res
      .status(500)
      .json({ message: 'HTTP method not valid only POST Accepted' });
  }
  /* Checking if the request is coming from a secure connection or not. */
  const protocol =
    req.headers['x-forwarded-proto'] || req.connection.encrypted
      ? 'https'
      : 'http';

  // decrypte the query in the verification email button and tack from it emailtoken, email and password
  const encryptedQuery = req.query.query;
  const query = JSON.parse(decrypt(encryptedQuery));
  const { emailToken, email, password } = query;

  // const emailToken = req.query.token;
  // const email = req.query.email;
  // const password = req.query.password;

  if (!emailToken) {
    res.status(422).json({
      message: 'Pass an email Token',
    });
    return;
  }
  if (!email) {
    res.status(422).json({
      message: 'Pass an email',
    });
    return;
  }
  const userAgent = req.headers['user-agent'];
  const userAgentinfo = useragent.parse(userAgent);
  if (selection_data.isMongoDb) {
    await db.connect();
    const existingUser = await UserProfile.findOne({
      emailToken: emailToken,
    });
    const existingUserEmail = await UserProfile.findOne({
      email: email,
    });
    // console.log('existingUser=', existingUser);
    // console.log('existingUserEmail=', existingUserEmail);

    // Email Verification
    if (existingUser) {
      // console.log('OLD emailToken=', emailToken);
      existingUser.emailToken = 'null';
      existingUser.isVerified = true;
      await existingUser.save();
      // sis_app_logger.info(
      //   `${new Date()}:verifyemail:${existingUserEmail.email}:${
      //     req.headers['user-agent']
      //   }`
      // );

      sis_app_logger.info(
        `${new Date()}=1=verifyemail=${email}=${userAgentinfo.os.family}=${
          userAgentinfo.os.major
        }=${userAgentinfo.family}=${userAgentinfo.source}=${
          userAgentinfo.device.family
        }`
      );

      // Encrypt the query parameters before adding them to the URL
      // end-to-end encryption for query parameters

      const encryptedQuery = encodeURIComponent(
        encrypt(JSON.stringify({ email: `${email}`, password: `${password}` }))
      );
      res.writeHead(302, {
        Location: `${protocol}://${req.headers.host}/user/signin?query=${encryptedQuery}`,
        // Location: `${protocol}://${req.headers.host}/user/signin?email=${email}&password=${password}`,
      });
      res.end();
      await db.disconnect();
      return;
    } else {
      if (existingUserEmail) {
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ email: `${email}`, password: `${password}` })
          )
        );
        res.writeHead(302, {
          Location: `${protocol}://${req.headers.host}/user/signin?query=${encryptedQuery}`,
          //Location: `${protocol}://${req.headers.host}/user/signin?email=${email}&password=${password}`,
        });
        res.end();
        return;
      } else {
        res.status(400).json({
          message: 'Account Not Found, Please Register in new account!',
        });
      }
    }

    await db.disconnect();
    return;
  } else {
    // MySQL Code
    const connection = await connect();
    if (!connection.success) {
      const message = connection.message;
      sis_app_logger.error(
        `${new Date()}=From Verifyemail page,connection unsuccess=1=${email}=${message}=${
          userAgentinfo.os.family
        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          userAgentinfo.source
        }=${userAgentinfo.device.family}`
      );
      res.status(500).json({
        message: message,
      });
    } else {
      const existingUser = await findData(
        connection,
        'emailToken',
        'user_profile',
        emailToken
      );
      const existingUserEmail = await findData(
        connection,
        'email',
        'user_profile',
        email
      );
      // console.log('existingUser=', existingUser);
      // console.log('existingUserEmail=', existingUserEmail);

      // Email Verification
      if (existingUser.result === 1) {
        // console.log('OLD emailToken=', emailToken);
        const emailtokenUpdateresp = await UpdateToken(connection, emailToken);

        // console.log('emailtokenUpdateresp==',emailtokenUpdateresp);
        // console.log('emailtokenUpdateresp.affectedRows==',emailtokenUpdateresp.affectedRows);

        // Encrypt the query parameters before adding them to the URL
        // end-to-end encryption for query parameters
        if (emailtokenUpdateresp.affectedRows === 1) {
          const encryptedQuery = encodeURIComponent(
            encrypt(
              JSON.stringify({ email: `${email}`, password: `${password}` })
            )
          );
          res.writeHead(302, {
            Location: `${protocol}://${req.headers.host}/user/signin?query=${encryptedQuery}`,
          });
          res.end();
          sis_app_logger.info(
            `${new Date()}=1=verifyemail=${email}=${userAgentinfo.os.family}=${
              userAgentinfo.os.major
            }=${userAgentinfo.family}=${userAgentinfo.source}=${
              userAgentinfo.device.family
            }`
          );
        }
        await disconnect(connection);
        return;
      } else {
        if (existingUserEmail.result === 1) {
          const encryptedQuery = encodeURIComponent(
            encrypt(
              JSON.stringify({ email: `${email}`, password: `${password}` })
            )
          );
          res.writeHead(302, {
            Location: `${protocol}://${req.headers.host}/user/signin?query=${encryptedQuery}`,
            //Location: `${protocol}://${req.headers.host}/user/signin?email=${email}&password=${password}`,
          });
          res.end();
          sis_app_logger.info(
            `${new Date()}=1=email already verified =${email}=${
              userAgentinfo.os.family
            }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
              userAgentinfo.source
            }=${userAgentinfo.device.family}`
          );
          return;
        } else {
          const message = 'Account Not Found, Please Register in new account!';
          res.status(400).json({
            message: message,
          });
          sis_app_logger.error(
            `${new Date()}=From verify page,Account Not Found=1=${email}=${message}=${
              userAgentinfo.os.family
            }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
              userAgentinfo.source
            }=${userAgentinfo.device.family}`
          );
        }
      }

      await disconnect(connection);
      return;
    }
  }
}

export default handler;
