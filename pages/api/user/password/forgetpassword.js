/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\password\forgetpassword.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
// import UserProfile from '../../../../models/user/ProfileModel';
// import db from '../../../../utilities/connectToDb';
// import selection_data from '../../../../utilities/selection_data';
import {
  findDataForResetPassword,
  newEmailToken,
  Userinfo,
  // UpdateData,
  // UpdateActivityTime,
} from "../../controller/queries";
import { connect, disconnect } from "../../../../utilities/db";
// import crypto from 'crypto';
import sis_app_logger from "../../../api/logger";
import useragent from "useragent";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ message: "HTTP method not valid only POST Accepted" });
  }
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }
  const userAgent = req.headers["user-agent"];
  const userAgentinfo = useragent.parse(userAgent);

  const connection = await connect();
  if (!connection.success) {
    const message = connection.message;
    sis_app_logger.error(
      `${new Date()}=From forgetpassword page,connection unsuccess=1=${email}=${message}=${
        userAgentinfo.os.family
      }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
        userAgentinfo.source
      }=${userAgentinfo.device.family}`
    );
    res.status(500).json({
      message: message,
    });
  } else {
    const validateUserEmail = await findDataForResetPassword(
      connection,
      "users",
      "user_contact",
      "userid",
      "email",
      email
    );
    const validatePmEmail = await findDataForResetPassword(
      connection,
      "users",
      "program_manager",
      "pm_id",
      "pm_email",
      email
    );
    const validateAdmin = await findDataForResetPassword(
      connection,
      "users",
      "admin",
      "adminid",
      "adminemail",
      email
    );
    const validatePmAssistanteEmail = await findDataForResetPassword(
      connection,
      "users",
      "program_manager_assistance",
      "pm_ass_id",
      "pm_ass_email",
      email
    );
    // // console.log(validateUserEmail)
    // const validateUserEmail = await UserProfile.findOne({ email });
    // // console.log(validateUserEmail.rows[0].userid)
    if (validateUserEmail.rows[0] != null) {
      // Set the emailToken
      await newEmailToken(connection, validateUserEmail.rows[0].userid);
      //validateUserEmail.emailToken = crypto.randomBytes(64).toString('hex');
      //await validateUserEmail.save();

      // res.status(200).json('Email Verified Successfully.');
    } else if (validatePmEmail.rows[0] != null) {
      await newEmailToken(connection, validatePmEmail.rows[0].userid);
    } else if (validatePmAssistanteEmail.rows[0] != null) {
      await newEmailToken(connection, validatePmAssistanteEmail.rows[0].userid);
    } else if (validateAdmin.rows[0] != null) {
      await newEmailToken(connection, validateAdmin.rows[0].userid);
    } else {
      res.status(404).json({
        message: "Account Doesn't Exist.",
      });
      return;
    }

    // Disconnect From DB and send message and user authentication to front end
    const userinfo = await Userinfo(
      connection,
      "user_contact",
      "userid",
      "email",
      email
    );
    const userPminfo = await Userinfo(
      connection,
      "program_manager",
      "pm_id",
      "pm_email",
      email
    );
    const userPmAssinfo = await Userinfo(
      connection,
      "program_manager_assistance",
      "pm_ass_id",
      "pm_ass_email",
      email
    );
    const admininfo = await Userinfo(
      connection,
      "admin",
      "adminid",
      "adminemail",
      email
    );
    // // console.log("userinf ====", userinfo);
    if (userinfo.rows[0]) {
      res.status(201).send({
        message: "Ready To send Reset Password Email",
        email: email,
        emailToken: userinfo.rows[0].token,
        ID: userinfo.rows[0].userid,
      });
    } else if (userPminfo.rows[0]) {
      res.status(201).send({
        message: "Ready To send Reset Password Email",
        email: email,
        emailToken: userPminfo.rows[0].token,
        ID: userPminfo.rows[0].userid,
      });
    } else if (userPmAssinfo.rows[0]) {
      res.status(201).send({
        message: "Ready To send Reset Password Email",
        email: email,
        emailToken: userPmAssinfo.rows[0].token,
        ID: userPmAssinfo.rows[0].userid,
      });
    } else if (admininfo.rows[0]) {
      res.status(201).send({
        message: "Ready To send Reset Password Email",
        email: email,
        emailToken: admininfo.rows[0].token,
        ID: admininfo.rows[0].userid,
      });
    }

    //email from req body
    // // console.log("userinfo");
    // // console.log(userinfo.rows[0].token);
    // await UpdateData(connection, 'user_profile', userinfo.user_id, [
    //   'isreset',
    //   true,
    // ]);
    /** Updates Activity Time */
    //Update Activity time

    // await UpdateActivityTime(userinfo.rows[0].userid, connection);
    // // console.log('timeAct')
    // // console.log(UpdateActivityTime)
    await disconnect(connection);
    // // console.log(UpdateData)
    // // console.log(email);
    // // console.log(userinfo.emailToken);
    // // console.log(userinfo.user_id);
    // // console.log(userinfo.firstname);
    // // console.log(userinfo.lastname);
    // res.status(201).send({
    //   message: "Ready To send Reset Password Email",
    //   email: email,
    //   emailToken: userinfo.rows[0].token,
    //   ID: userinfo.rows[0].userid,
    // fname: userinfo.firstname,
    // lname: userinfo.lastname,
    //emailToken: validateUserEmail.emailToken,
    //ID: validateUserEmail.ID,
    //fname: validateUserEmail.fname,
    //lname: validateUserEmail.lname,
    // });
  }
}

export default handler;
