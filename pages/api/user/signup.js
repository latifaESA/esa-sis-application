/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\signup.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
/* Importing the required modules. */
import bcryptjs from 'bcryptjs';
import UserInfo from '../../../models/user/InfoModel';
import UserProfile from '../../../models/user/ProfileModel';
import db from '../../../utilities/connectToDb';
import { connect, disconnect } from '../../../utilities/db';
import crypto from 'crypto';
import {
  findData,
  NewUser,
  Userinfo,
  findmajor_id,
} from '../controller/queries';
import xss from 'xss-filters';
import selection_data from '../../../utilities/selection_data';
import decrypt from '../../../utilities/encrypt_decrypt/decryptText';
import encrypt from '../../../utilities/encrypt_decrypt/encryptText';
// import logger from '../../logger';
import sis_app_logger from '../../api/logger';
import useragent from 'useragent';

/**
 * It creates a new user profile and a new user info.
 * </code>
 * @param req - The request object.
 * @param res - The response object.
 * @returns The user profile and user info are being returned.
 */
async function handler(req, res) {
  //  Validate Request Method
  if (req.method !== 'POST') {
    return res
      .status(500)
      .json({ message: 'HTTP method not valid only POST Accepted' });
  }

  const encryptedBody = req.body.data;
  const reqBody = JSON.parse(decrypt(encryptedBody));

  // sanitizing request body data
  const ID = xss.inHTMLData(reqBody.ID);
  const lname = xss.inHTMLData(reqBody.lname);
  const fname = xss.inHTMLData(reqBody.fname);
  const email = xss.inHTMLData(reqBody.email);
  const major = xss.inHTMLData(reqBody.major);
  const password = xss.inHTMLData(reqBody.password);
  const mobileNumber = xss.inHTMLData(reqBody.mobileNumber);

  /* A regular expression that checks if the password contains at least one letter, one number, and one
  special character. */
  const regularExpression =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;

  // Validate request parameters
  if (
    !ID ||
    !fname ||
    !lname ||
    !email ||
    !email.includes('@') ||
    !major ||
    !password ||
    // password.trim().length < 7 ||
    // FIXME:Validate password pattern
    !regularExpression.test(password) ||
    !mobileNumber
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }
  const userAgent = req.headers['user-agent'];
  const userAgentinfo = useragent.parse(userAgent);
  // console.log('signupData=', signupData);
  // console.log('selection_data.isMongoDb=', selection_data.isMongoDb);

  // Save data to Database
  if (selection_data.isMongoDb) {
    await db.connect();

    /* Checking if the user email and phone number already exist in the database. */
    const existingUserEmail = await UserProfile.findOne({ email: email });
    const existingUserPhone = await UserProfile.findOne({
      mobileNumber: mobileNumber,
    });
    /* Checking if the user email and phone number already exist in the database. */
    if (existingUserEmail && existingUserPhone) {
      res.status(422).json({
        message:
          'Account already exists(By Email & Mobile Number), Go to login section',
      });

      await db.disconnect();
      return;
    }
    // Canceled As Per Owner request For registration, we need to check both mobile and email address if both exist
    else if (existingUserEmail) {
      /* Checking if the user email already exists in the database. */
      res.status(422).json({
        message: 'Account already exists (By Email), Go to login section',
      });
      await db.disconnect();
      return;
    }

    /* Creating a new user profile. */
    const newUser = new UserProfile({
      ID,
      fname,
      lname,
      email,
      major,
      password: bcryptjs.hashSync(password.trim()),
      mobileNumber,
      role: '1',
      status: 'incomplete',
      isVerified: false,
      // FIXME: set to true to test save and continue
      appisSaved: false,
      application_Language:
        major === 'BBA (Bachelor in Business Administration)' ? 'fr' : 'en-US',
      /* Generating a random string of 64 characters. */
      emailToken: crypto.randomBytes(64).toString('hex'),
    });

    /* Saving the new user profile in the database. */
    const user = await newUser.save();
    // console.log('USER=', user);
    // Create and initialize UserInfo
    //TODO: add more infos
    const newInfo = new UserInfo({
      user_id: user._id,
      personalinfo: {},
      address: {},
      contactinfo: {},
      emergencycontact: {},
      education: {},
      languages: {},
      motivationletter: {},
      experience: {},
      questions: {},
      source: [],
      otherSource: {},
      test: [],
    });

    // personal info
    newInfo.personalinfo.title = ' ';
    newInfo.personalinfo.fathername = ' ';
    newInfo.personalinfo.maidenname = ' ';
    newInfo.personalinfo.mothernname = ' ';
    newInfo.personalinfo.gender = ' ';
    newInfo.personalinfo.dob = null;
    newInfo.personalinfo.countryofbirth = 'Lebanon';
    newInfo.personalinfo.maritalstatus = ' ';
    newInfo.personalinfo.nationality.firstnationality = 'Lebanon';
    newInfo.personalinfo.nationality.secondnationality = ' ';
    newInfo.personalinfo.placeofbirth = ' ';
    newInfo.personalinfo.registrationnumber = ' ';

    // address info
    newInfo.address.city = ' ';
    newInfo.address.country = 'Lebanon';
    newInfo.address.building = ' ';
    newInfo.address.street = ' ';
    newInfo.address.floor = ' ';

    // contact info
    newInfo.contactinfo.email.firstemail = ' ';
    newInfo.contactinfo.email.secondemail = ' ';
    newInfo.contactinfo.phonenumber.mobileNumber = ' ';
    newInfo.contactinfo.phonenumber.landlineNumber = ' ';

    // emergency contact info
    newInfo.emergencycontact.prefix = ' ';
    newInfo.emergencycontact.firstname = ' ';
    newInfo.emergencycontact.middlename = ' ';
    newInfo.emergencycontact.lastname = ' ';
    newInfo.emergencycontact.relationship = ' ';
    newInfo.emergencycontact.phonenumber = ' ';
    newInfo.emergencycontact.medicalhealth = ' ';
    newInfo.emergencycontact.diseasetype = ' ';

    // education info
    newInfo.education.degreelevel = ' ';
    newInfo.education.fieldOfStudy = ' ';
    newInfo.education.baccalaureateoption = ' ';
    newInfo.education.yearofacquisition = ' ';
    newInfo.education.institution = ' ';
    newInfo.education.other_institution = ' ';
    newInfo.education.other_fieldOfStudy = ' ';
    newInfo.education.country = ' ';
    newInfo.education.degreeTitle = ' ';
    newInfo.education.schoolgrades.second.math;
    newInfo.education.schoolgrades.second.hist;
    newInfo.education.schoolgrades.second.geo;
    newInfo.education.schoolgrades.second.economie;
    newInfo.education.schoolgrades.second.mean;
    newInfo.education.schoolgrades.second.range;

    newInfo.education.schoolgrades.premiere.math;
    newInfo.education.schoolgrades.premiere.hist;
    newInfo.education.schoolgrades.premiere.geo;
    newInfo.education.schoolgrades.premiere.economie;
    newInfo.education.schoolgrades.premiere.mean;
    newInfo.education.schoolgrades.premiere.range;

    newInfo.education.schoolgrades.terminale.math;
    newInfo.education.schoolgrades.terminale.hist;
    newInfo.education.schoolgrades.terminale.geo;
    newInfo.education.schoolgrades.terminale.economie;
    newInfo.education.schoolgrades.terminale.mean;
    newInfo.education.schoolgrades.terminale.range;

    newInfo.education.sat;

    // Languages

    newInfo.languages.french.proficiency = ' ';
    newInfo.languages.english.proficiency = ' ';
    newInfo.languages.arabic.proficiency = ' ';
    newInfo.languages.other.language = ' ';
    newInfo.languages.other.proficiency = ' ';

    // motivation Letter
    newInfo.motivationletter = ' ';

    // experience
    newInfo.experience.company;
    newInfo.experience.otherCompany;
    newInfo.experience.jobTitle;
    newInfo.experience.startDate;
    newInfo.experience.directorsName;
    newInfo.experience.hrDirectorsName;
    newInfo.experience.webSite;
    newInfo.experience.city;
    newInfo.experience.building;
    newInfo.experience.floor;
    newInfo.experience.street;
    newInfo.experience.region;
    newInfo.experience.country;
    newInfo.experience.phone;
    newInfo.experience.postal;
    newInfo.experience.numberOfEmployees;
    newInfo.experience.numberOfEmployeesManaged;
    newInfo.experience.turnover;
    newInfo.experience.annualIncome;
    newInfo.experience.monthlySalary;
    newInfo.experience.workOnSaturday;
    newInfo.experience.position;
    newInfo.experience.functionalArea;
    newInfo.experience.businessActivity;
    newInfo.experience.years.totalYears;
    newInfo.experience.years.totalMonths;
    newInfo.experience.experienceType;
    newInfo.experience.rolesAndTasks;

    // questions:
    newInfo.questions.currentJob;
    newInfo.questions.otherActivities;
    newInfo.questions.acheivement;
    newInfo.questions.reason;
    newInfo.questions.careerObjectives;
    newInfo.questions.interests;
    newInfo.questions.selfDescription;

    // Source
    newInfo.source = ' ';
    newInfo.otherSource = ' ';

    // Payment
    newInfo.payment;
    newInfo.otherPayment;

    await newInfo.save();
    // sis_app_logger.info(
    //   `${new Date()}:signup:${email}:${req.headers['user-agent']}`
    // );
    sis_app_logger.info(
      `${new Date()}=1=signup=${email}=${userAgentinfo.os.family}=${
        userAgentinfo.os.major
      }=${userAgentinfo.family}=${userAgentinfo.source}=${
        userAgentinfo.device.family
      }`
    );

    // Disconnect From DB
    await db.disconnect();

    const payload = {
      message: 'User Profile Created and User Info Initialized!',
      emailToken: user.emailToken,
    };
    const response = encrypt(JSON.stringify(payload));

    // send message and user authentication to front end
    res.status(201).json({ data: response });
  } else {
    // MySQL Code
    const connection = await connect();
    if (!connection.success) {
      const message = connection.message;
      sis_app_logger.error(
        `${new Date()}=From signup page,connection unsuccess=1=${email}=${message}=${
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
      ); //email from req body
      const existingUserPhone = await findData(
        connection,
        'mobile_number',
        'user_contact_info',
        mobileNumber
      ); //mobilenumber from req body
      global.language = 0; //global variable for setting BBA AS french and others as English
      const major_id = await findmajor_id(connection, major); //email from req body

      // console.log(major_id.major_id);
      let language;
      if (major_id.major_id === 10) {
        language = 'fr';
      } else {
        language = 'en-US';
      }
      /* Checking if the user email and phone number already exist in the database. */
      if (existingUserEmail.result || existingUserPhone.result) {
        let message;
        if (existingUserEmail.result)
          message = 'Account already exists (by Email), Go to login section';
        if (existingUserPhone.result)
          message =
            'Account already exists (by Mobile Number), Go to login section';
        if (existingUserEmail.result && existingUserPhone.result)
          message = 'Account already exists, Go to login section';
        res.status(422).json({
          message: message,
        });
        await disconnect(connection);
        return;
      }

      // Adding new User
      await NewUser(
        connection,
        ID,
        email,
        password,
        major_id.major_id,
        fname,
        lname,
        mobileNumber,
        language
      );
      const userinfo = await Userinfo(connection, email);
      // console.log('USER=', userinfo);
      //const program = await findmajor_name(connection, ID);
      // console.log(program.program);
      await disconnect(connection);
      // sis_app_logger.info(
      //   `${new Date()}:signup:${email}:${req.headers['user-agent']}`
      // );
      sis_app_logger.info(
        `${new Date()}=1=signup=${email}=${userAgentinfo.os.family}=${
          userAgentinfo.os.major
        }=${userAgentinfo.family}=${userAgentinfo.source}=${
          userAgentinfo.device.family
        }`
      );
      const payload = {
        message: 'User Profile Created and User Info Initialized!',
        emailToken: userinfo.emailToken,
      };
      const response = encrypt(JSON.stringify(payload));

      // send message and user authentication to front end
      res.status(201).json({ data: response });
    }
  }
}
export default handler;
