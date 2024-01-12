/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\password\resetpassword.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
// import UserProfile from '../../../../models/user/ProfileModel';
// import db from '../../../../utilities/connectToDb';
import crypto from "crypto";
// import bcryptjs from 'bcryptjs';
// import selection_data from '../../../../utilities/selection_data';
import {
  newpassword,
  UpdateToken,
  findDataForResetPassword,
  // Userrole,
} from "../../controller/queries";
import { connect, disconnect } from "../../../../utilities/db";
import sis_app_logger from "../../../api/logger";
import useragent from "useragent";
import encrypt from "../../../../utilities/encrypt_decrypt/encryptText";
import decrypt from "../../../../utilities/encrypt_decrypt/decryptText";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

/**
 * It generates a random password of the length specified by the user.
 * @param length - The length of the password to be generated.
 * @returns A string of random characters.
 */
function generatPassword(length) {
  const paternlist =
    "0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz():;<=>![]^{|}~";
  // const paternlist =
  //   '0123456789ABCDEFGHIJKLMNOPQSTUVWXYZabcdefghijklmnpqrstuvwxyz#$%&()*+,-./:;<=>!?@[]^_`{|}~';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => paternlist[x % paternlist.length])
    .join("");
}

async function handler(req, res) {
  // console.log("head of handler");
  if (req.method !== "GET") {
    return res
      .status(500)
      .json({ message: "HTTP method not valid only GET Accepted" });
  }
  /* Checking if the request is coming from a secure connection or not. */

  // change one to https in protocol

  const protocol =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "http"
      : "http";
  // eslint-disable-next-line no-unused-vars
  const session = await getServerSession(req, res, authOptions);
  // console.log("after session");
  const encryptedBody = req.query.query;
  const query = JSON.parse(decrypt(encryptedBody));
  const emailToken = query.token;
  const email = query.email;
  const id = query.id;
  // const password = req.query.password;
  // console.log("quesries");
  // console.log(emailToken);
  // console.log(email);
  // console.log("quesries");
  if (!emailToken) {
    res.status(422).json({
      message: "Pass an email Token",
    });
    return;
  }
  if (!email) {
    res.status(422).json({
      message: "Pass an email",
    });
    return;
  }
  const userAgent = req.headers["user-agent"];
  const userAgentinfo = useragent.parse(userAgent);

  // MySQL Code
  const connection = await connect();
  if (!connection._connected) {
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
    console.log("ana bel else");
    console.log(id);
    const existingUserEmail = await findDataForResetPassword(
      connection,
      "users",
      "user_contact",
      "userid",
      "userid",
      "userid",
      id
    );
    // console.log("this is existing email user smthng");
    // console.log(existingUserEmail.rows[0]);
    const existingUserToken = await findDataForResetPassword(
      connection,
      "users",
      "user_contact",
      "userid",
      "userid",
      "token",
      emailToken
    );
    // // console.log("this is existing token user smthng");
    // console.log(existingUserToken.rows[0]);

    // for Program Manager
    const existingPMEmail = await findDataForResetPassword(
      connection,
      "users",
      "program_manager",
      "pm_id",
      "userid",
      "userid",
      id
    );

    const existingPMToken = await findDataForResetPassword(
      connection,
      "users",
      "program_manager",
      "pm_id",
      "userid",
      "token",
      emailToken
    );
    // // console.log("this is existing pm token user smthng");

    // program manager assistance
    const existingPMAssistanceEmail = await findDataForResetPassword(
      connection,
      "users",
      "program_manager_assistance",
      "pm_ass_id",
      "userid",
      "userid",
      id
    );
    const existingPMAssistanceToken = await findDataForResetPassword(
      connection,
      "users",
      "program_manager_assistance",
      "pm_ass_id",
      "userid",
      "token",
      emailToken
    );
    // admin
    const existingAdminEmail = await findDataForResetPassword(
      connection,
      "users",
      "admin",
      "adminid",
      "userid",
      "userid",
      id
    );
    // console.log("this is existing admin user smthng");
    // console.log(existingAdminEmail.rows[0]);
    const existinAdminToken = await findDataForResetPassword(
      connection,
      "users",
      "admin",
      "adminid",
      "userid",
      "token",
      emailToken
    );
    // console.log("this is existing admin user smthng");
    // console.log(existinAdminToken.rows[0]);

    // const user= await Userinfo(connection,email);
    //const updateToken=await UpdateToken(connection,emailToken);

    // FIXME: Verify the emailToken validation (time validation)
    // Email Verification
    // if (existingUserToken !== null) {
    console.log("=====u=u=u=u=u=u=u=u=u=u=u=u=u=u=u====");
    console.log(
      (existingUserEmail.rows[0] != null &&
        existingUserEmail.rows[0].userid != null) &
        (existingUserToken.rows[0] != null)
    );
    console.log("====p=p=p=p=p=p=p=p=p=p=p=p=p=p=p=p=p=");
    console.log(
      (existingPMEmail.rows[0] != null &&
        existingPMEmail.rows[0].pm_id != null) & existingPMToken.rows[0]
    );
    console.log("====a=a=a=a=a=a=a=a=aa=a=a=a=a=a==");
    console.log(
      (existingAdminEmail.rows[0] != null &&
        existingAdminEmail.rows[0].adminid != null) &
        (existinAdminToken.rows[0] != null)
    );
    console.log(existingAdminEmail.rows[0] != null);
    console.log(existingAdminEmail.rows[0].adminid != null);
    console.log(existinAdminToken.rows[0] != null);
    if (
      existingUserEmail.rows[0] != null &&
      existingUserEmail.rows[0].userid != null &&
      existingUserToken.rows[0] != null
    ) {
      console.log("this is adminid inside the user section");
      console.log(existingAdminEmail.rows[0].adminid);
      if (
        existingUserEmail.rows[0].email != null &&
        existingUserToken.rows[0].token != null
      ) {
        const role = existingUserToken.rows[0].role;
        const newPassword = generatPassword(8);
        const userid = existingUserEmail.rows[0].userid;
        // // console.log('newPassword=', newPassword);
        //if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
        // existingUserToken.password = bcryptjs.hashSync(newPassword);
        // await existingUserToken.save();
        // if (existingUserToken.isVerified)
        await UpdateToken(connection, emailToken);

        await newpassword(
          connection,
          existingUserToken.rows[0].userid,
          newPassword
        );
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ userid: `${userid}`, password: `${newPassword}` })
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
        if (
          existingUserEmail.rows[0].email != null &&
          existingUserToken.rows[0].token != null
        ) {
          const role = existingUserToken.rows[0].role;
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
        if (existingUserEmail.rows[0].email == null) {
          res.writeHead(302, {
            Location: `${protocol}://${
              req.headers.host
            }/user/message/message?message=${"Account Not Found, Please Register in new account!"}&email=${email}`,
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
    } else if (
      (existingPMEmail.rows[0] != null &&
        existingPMEmail.rows[0].pm_id != null) &
      (existingPMToken.rows[0] != null)
    ) {
      console.log("this is adminid inside the pm section");
      console.log(existingAdminEmail.rows[0].adminid);
      // program manager
      if (
        existingPMEmail.rows[0].pm_email != null &&
        existingPMToken.rows[0].token != null
      ) {
        const role = existingPMToken.rows[0].role;
        const newPassword = generatPassword(8);
        const userid = existingPMEmail.rows[0].userid;
        // // console.log('newPassword=', newPassword);
        //if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
        // existingUserToken.password = bcryptjs.hashSync(newPassword);
        // await existingUserToken.save();
        // if (existingUserToken.isVerified)
        await UpdateToken(connection, emailToken);

        await newpassword(
          connection,
          existingPMToken.rows[0].userid,
          newPassword
        );
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ userid: `${userid}`, password: `${newPassword}` })
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
        if (
          existingPMEmail.rows[0].pm_email != null &&
          existingPMToken.rows[0].token != null
        ) {
          const role = existingPMToken.rows[0].role;
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
        if (existingPMEmail.rows[0].pm_email == null) {
          res.writeHead(302, {
            Location: `${protocol}://${
              req.headers.host
            }/user/message/message?message=${"Account Not Found, Please Register in new account!"}&email=${email}`,
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
    } else if (
      (existingPMAssistanceEmail.rows[0] != null &&
        existingPMAssistanceEmail.rows[0].pm_ass_id != null) &
      (existingPMAssistanceToken.rows[0] != null)
    ) {
      console.log("this is adminid inside the pm ass section");
      console.log(existingAdminEmail.rows[0].adminid);
      // program manager assistance
      if (
        existingPMAssistanceEmail.rows[0].pm_ass_email != null &&
        existingPMAssistanceToken.rows[0].token != null
      ) {
        const role = existingPMAssistanceToken.rows[0].role;
        const newPassword = generatPassword(8);
        const userid = existingPMAssistanceEmail.rows[0].userid;
        // // console.log('newPassword=', newPassword);
        //if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
        // existingUserToken.password = bcryptjs.hashSync(newPassword);
        // await existingUserToken.save();
        // if (existingUserToken.isVerified)
        await UpdateToken(connection, emailToken);

        await newpassword(
          connection,
          existingPMAssistanceToken.rows[0].userid,
          newPassword
        );
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ userid: `${userid}`, password: `${newPassword}` })
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
        if (
          existingPMAssistanceEmail.rows[0].pm_ass_email != null &&
          existingPMAssistanceToken.rows[0].token != null
        ) {
          const role = existingPMAssistanceToken.rows[0].role;
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
        if (existingPMAssistanceEmail.rows[0].pm_ass_email == null) {
          res.writeHead(302, {
            Location: `${protocol}://${
              req.headers.host
            }/user/message/message?message=${"Account Not Found, Please Register in new account!"}&email=${email}`,
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
    } else if (
      (existingAdminEmail.rows[0] != null &&
        existingAdminEmail.rows[0].adminid != null) &
      (existinAdminToken.rows[0] != null)
    ) {
      console.log("this is adminid");
      console.log(existingAdminEmail.rows[0].adminid);
      // admin
      // existingAdminEmail
      // existinAdminToken
      console.log(
        existingAdminEmail.rows[0].adminemail != null &&
          existinAdminToken.rows[0].token != null
      );
      if (
        existingAdminEmail.rows[0].adminemail != null &&
        existinAdminToken.rows[0].token != null
      ) {
        const role = existinAdminToken.rows[0].role;
        const newPassword = generatPassword(8);
        const userid = existingAdminEmail.rows[0].userid;
        // // console.log('newPassword=', newPassword);
        //if (existingUserToken.isVerified) existingUserToken.emailToken = 'null';
        // existingUserToken.password = bcryptjs.hashSync(newPassword);
        // await existingUserToken.save();
        // if (existingUserToken.isVerified)
        await UpdateToken(connection, emailToken);

        await newpassword(
          connection,
          existinAdminToken.rows[0].userid,
          newPassword
        );
        const encryptedQuery = encodeURIComponent(
          encrypt(
            JSON.stringify({ userid: `${userid}`, password: `${newPassword}` })
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
        if (
          existingAdminEmail.rows[0].adminemail != null &&
          existinAdminToken.rows[0].token != null
        ) {
          const role = existinAdminToken.rows[0].role;
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
        if (existingAdminEmail.rows[0].adminemail == null) {
          res.writeHead(302, {
            Location: `${protocol}://${
              req.headers.host
            }/user/message/message?message=${"Account Not Found, Please Register in new account!"}&email=${email}`,
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
    }

    //await db.disconnect();
    await disconnect(connection);

    return;
  }
}

export default handler;
