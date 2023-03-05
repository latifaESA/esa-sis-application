/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\password\resetpassword.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
import UserProfile from '../../../../models/user/ProfileModel';
import db from '../../../../utilities/connectToDb';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import selection_data from '../../../../utilities/selection_data';
import {
  newpassword,
  UpdateToken,
  findData,
  Userrole,
} from '../../controller/queries';
import { connect, disconnect } from '../../../../utilities/db';
import sis_app_logger from '../../../api/logger';
import useragent from 'useragent';
import encrypt from '../../../../utilities/encrypt_decrypt/encryptText';
import decrypt from '../../../../utilities/encrypt_decrypt/decryptText';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

/**
 * It generates a random password of the length specified by the user.
 * @param length - The length of the password to be generated.
 * @returns A string of random characters.
 */
function generatPassword(length) {
  const paternlist =
    '0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz():;<=>![]^{|}~';
  // const paternlist =
  //   '0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz#$%&()*+,-./:;<=>!?@[]^_`{|}~';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => paternlist[x % paternlist.length])
    .join('');
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res
      .status(500)
      .json({ message: 'HTTP method not valid only GET Accepted' });
  }
  /* Checking if the request is coming from a secure connection or not. */
  const protocol =
    req.headers['x-forwarded-proto'] || req.connection.encrypted
      ? 'https'
      : 'http';
  // eslint-disable-next-line no-unused-vars
  const session = await getServerSession(req, res, authOptions);

  const encryptedBody = req.query.query;
  const query = JSON.parse(decrypt(encryptedBody));
  const emailToken = query.token;
  const email = query.email;
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
    const existingUserToken = await UserProfile.findOne({
      emailToken: emailToken,
    });
    const existingUserEmail = await UserProfile.findOne({
      email: email,
    });
    // FIXME: Verify the emailToken validation (time validation)
    // Email Verification
    if (existingUserToken !== null) {
      const newPassword = generatPassword(8);
      // console.log('newPassword=', newPassword);
      if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
      existingUserToken.password = bcryptjs.hashSync(newPassword);
      await existingUserToken.save();
      const encryptedQuery = encodeURIComponent(
        encrypt(
          JSON.stringify({ email: `${email}`, password: `${newPassword}` })
        )
      );
      res.writeHead(302, {
        Location: `${protocol}://${req.headers.host}/user/password/presetsignin?query=${encryptedQuery}`,
        // Location: `${protocol}://${req.headers.host}/user/password/presetsignin?email=${email}&password=${newPassword}`,
      });
      res.end();
      await db.disconnect();
      // sis_app_logger.info(
      //   `${new Date()}:password-reseted:${existingUserEmail.email}:${
      //     req.headers['user-agent']
      //   }`
      // );

      sis_app_logger.info(
        `${new Date()}=${existingUserEmail.role}=password reseted=${
          existingUserEmail.email
        }=${userAgentinfo.os.family}=${userAgentinfo.os.major}=${
          userAgentinfo.family
        }=${userAgentinfo.source}=${userAgentinfo.device.family}`
      );
      return;
    } else {
      if (existingUserEmail && existingUserToken === null) {
        // res.status(200).json({
        //   message: `${proto}://${req.headers.host}`,
        // });
        res.writeHead(302, {
          Location: `${protocol}://${req.headers.host}/user/login`,
          // TODO: change the location to the next link Signin after go to home or to filling application
          // Location: `${proto}://${req.headers.host}/api/user/signin?email=${email}&password=${password}`,
        });
        res.end();
        return;
      }
      if (!existingUserEmail) {
        // res.status(400).json({
        //   message: 'Account Not Found, Please Register in new account!',
        // });
        res.writeHead(302, {
          Location: `${protocol}://${
            req.headers.host
          }/user/message/message?message=${'Account Not Found, Please Register in new account!'}&email=${email}`,
        });
        res.end();
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
        `${new Date()}=From resetpassword page,connection unsuccess=1=${email}=${message}=${
          userAgentinfo.os.family
        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          userAgentinfo.source
        }=${userAgentinfo.device.family}`
      );
      res.status(500).json({
        message: message,
      });
    } else {
      const existingUserEmail = await findData(
        connection,
        'email',
        'user_profile',
        email
      );
      const existingUserToken = await findData(
        connection,
        'emailToken',
        'user_profile',
        emailToken
      );

      // const user= await Userinfo(connection,email);
      //const updateToken=await UpdateToken(connection,emailToken);

      // FIXME: Verify the emailToken validation (time validation)
      // Email Verification
      // if (existingUserToken !== null) {
      if (existingUserEmail.result === 1 && existingUserToken.result === 1) {
        const role = await Userrole(connection, email);
        const newPassword = generatPassword(8);
        // console.log('newPassword=', newPassword);
        //if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
        // existingUserToken.password = bcryptjs.hashSync(newPassword);
        // await existingUserToken.save();
        // if (existingUserToken.isVerified)
        await UpdateToken(connection, emailToken);

        await newpassword(connection, email, newPassword);
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ email: `${email}`, password: `${newPassword}` })
          )
        );
        res.writeHead(302, {
          Location: `${protocol}://${req.headers.host}/user/password/presetsignin?query=${encryptedQuery}`,
          // Location: `${protocol}://${req.headers.host}/user/password/presetsignin?email=${email}&password=${newPassword}`,
        });
        res.end();
        await disconnect(connection);
        sis_app_logger.info(
          `${new Date()}=${role.role}=password reseted=${email}=${
            userAgentinfo.os.family
          }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
            userAgentinfo.source
          }=${userAgentinfo.device.family}`
        );
        return;
      } else {
        if (existingUserEmail.result === 1 && existingUserToken.result === 0) {
          const role = await Userrole(connection, email);
          res.writeHead(302, {
            Location: `${protocol}://${req.headers.host}/user/login`,
            // TODO: change the location to the next link Signin after go to home or to filling application
            // Location: `${proto}://${req.headers.host}/api/user/signin?email=${email}&password=${password}`,
          });
          res.end();
          sis_app_logger.info(
            `${new Date()}=${role.role}=password already reseted=${email}=${
              userAgentinfo.os.family
            }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
              userAgentinfo.source
            }=${userAgentinfo.device.family}`
          );
          return;
        }
        if (!existingUserEmail.result) {
          res.writeHead(302, {
            Location: `${protocol}://${
              req.headers.host
            }/user/message/message?message=${'Account Not Found, Please Register in new account!'}&email=${email}`,
          });
          res.end();
          // sis_app_logger.info(
          //   `${new Date()}=---=no account for reset password=${email}=${
          //     userAgentinfo.os.family
          //   }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          //     userAgentinfo.source
          //   }=${userAgentinfo.device.family}`
          // );
          sis_app_logger.error(
            `${new Date()}=From resetpassword page,Account Not Found=1=${email}=no account for reset password=${
              userAgentinfo.os.family
            }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
              userAgentinfo.source
            }=${userAgentinfo.device.family}`
          );
        }
      }
      //await db.disconnect();
      await disconnect(connection);

      return;
    }
  }
}

export default handler;
