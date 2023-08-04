import formidable from "formidable";
import fs from "fs";
import path from "path";

import { getServerSession } from "next-auth/next";
const { connect, disconnect } = require("../../../../utilities/db");
const {
  getMajor,
  uploadAddress,
  uploadEducation,
  uploadEmerg,
  uploadContact,
  // uploadInfo,
  uploadStudent,
  ActiveUser,
  userDocument,
} = require("../../controller/queries");

import xlsx from "xlsx";
// import { env } from 'process';
import { authOptions } from "../../auth/[...nextauth]";
import SendEmail from "./emailFormat";
import hash from "./hash";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(400).send({ message: `${req.method} not supported` });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).send({ message: "Signin Required To Save Data" });
    }

    // const { user } = session;

    // const { formData, attendance } = req.body;

    const readFile = (file, saveLocally, place) => {
      const options = {};
      if (saveLocally) {
        options.uploadDir = place;

        // eslint-disable-next-line no-unused-vars
        options.filename = (name, ext, path1, form) => {
          // console.log("user",form)

          if (
            path1.mimetype === "application/pdf" ||
            path1.mimetype === "application/x-pdf" ||
            path1.mimetype === "image/png" ||
            path1.mimetype === "image/jpeg" ||
            path1.mimetype === "image/jpg" ||
            path1.mimetype ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            let sourceDir = fs.readdirSync(place);

            sourceDir.forEach((file) => {
              const filePath = path.join(place, file);
              const stats = fs.statSync(filePath);
              if (stats.isFile()) {
                // fs.unlinkSync(filePath);
                // console.log('Deleted file:', filePath);
              }
            });

            const currentTimestamp = Date.now();
            const filename = `${currentTimestamp}_${path1.originalFilename}`;

            return (
              // 'attendance-' + Date.now().toString() + '_' + path1.originalFilename
              filename
            );
          } else {
            return res
              .status(200)
              .send({ status: 401, message: "file was not accepted" });
          }
        };
      }

      // options.maxFileSize = 4000 * 1024 * 1024;
      const form = formidable(options);

      return new Promise((resolve, reject) => {
        form.parse(file, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
    };

    const localDiskPath = path.parse(require("os").homedir()).root;

    const directory =
      localDiskPath + "/sis-application-data/sis-documents-Admin/student";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const { fields } = await readFile(req, true, directory);

    let student_file = await fs.readdirSync(directory);

    // Access the file path from the 'files' object
    // const buffer = attendance_file.slice(-1)
    // console.log(directory)
    if (!student_file) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "File path not provided.",
      });
    }

    let student_files = await fs.readdirSync(directory);

    const sortedFiles = student_files.slice().sort((fileA, fileB) => {
      const getIntFromFilename = (filename) => {
        const match = filename.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
      };

      const intA = getIntFromFilename(fileA);
      const intB = getIntFromFilename(fileB);

      return intA - intB;
    });

    // Get the latest file from the 'course_files' list
    const latestFile = sortedFiles[sortedFiles.length - 1];

    // Construct the full path of the latest file
    const latestFilePath = path.join(directory, latestFile);

    // Read the buffer from the latest file
    const buffer = fs.readFileSync(latestFilePath);

    // Read the file data and create the workbook
    const workbook = xlsx.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);
    // ... (previous code)

    const connection = await connect();

    let countSaved = 0; // Add a variable to track the number of records saved

    for (const row of data) {
      try {
        const password = fields.passwordRe;
        const userpasswordref = await hash(password);

        const major = await getMajor(connection, row.MajorName);
        if (!major || major.rows.length === 0) {
          console.error(`Major not found for row: `, row);
          continue; // Skip this row if the major is not found
        }

        const majorid = major.rows[0].major_id;
        await ActiveUser(connection, {
          userid: row.StudentID,
          userpassword: userpasswordref,
          token: "",
          isVerified: "",
          update_time: "",
        });
        await userDocument(connection, {
          userid: row.StudentID,
          profileurl: "",
        });

        await uploadAddress(connection, {
          userid: row.StudentID,
          address_country: row.Country,
          address_region: row.Region,
          address_city: row.City,
          address_street: row.Street,
          address_building: row.Building,
          address_floor: row.Floor,
          address_postal: row.Postal,
        });
        await uploadContact(connection, {
          userid: row.StudentID,
          email: row.Email,
          email_two: row.SecondEmail,
          mobile_number: row.MobileNumber,
          landline_number: row.LandLineNumber,
        });
        await uploadEducation(connection, {
          userid: row.StudentID,
          degree_level: row.Degree,
          series: row.Series,
          obtain_date: row.DateObtain,
          education_country: row.EducationCountry,
          establishment: row.Establishment,
          other_establishment: row.otherEstablishment,
        });
        await uploadEmerg(connection, {
          userid: row.StudentID,
          prefix: row.EmergencePrefix,
          emerg_firstname: row.EmergenceFirstName,
          emerg_middlename: row.EmergenceMiddleName,
          emerg_lastname: row.EmergenceLastName,
          emerg_phonenumber: row.EmergencePhoneNumber,
          emerg_relationship: row.EmergenceRelationShip,
          emerg_medicalhealth: row.EmergenceMedicalHealth,
          emerg_diseasetype: row.EmergenceDisease,
        });
        // const info =await uploadInfo(
        //     connection,
        //     {
        //         userid: row.StudentID,
        //         title: row.Title,
        //         firstname:row.StudentFirstName,
        //         fathername:row.FatherName,
        //         lastname:row.StudentLastName,
        //         maidename:row.maidename,
        //         mothername:row.MotherName,
        //         gender:row.Gender,
        //         dateofbirth:row.DateOfBirth,
        //         countryofbirth:row.CountryOfBirth,
        //         placeofbirth:row.PlaceOfBirth,
        //         registernumber:row.RegisterNumber,
        //         martialstatus:row.MartialStatus,
        //         firstnationality:row.FirstNationality,
        //         secondnationality:row.SecondNationality
        //     }
        // )
        const response = await uploadStudent(connection, {
          student_id: row.StudentID,
          status: "active",
          promotion: row.Promotion,
          academic_year: row.AcademicYear,
          student_firstname: row.StudentFirstName,
          student_lastname: row.StudentLastName,
          major_id: majorid,
        });

        await SendEmail(
          row.StudentFirstName,
          row.Email,
          password,
          row.StudentID
        );

        if (response) {
          countSaved++; // Increment the count of saved records
        } else {
          console.error(`Failed to save row: `, row);
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          code: 500,
          message: message.error,
        });
      }
    }

    // Close the database connection after all operations
    await disconnect(connection);

    return res.status(201).json({
      success: true,
      code: 201,
      message: `Student Uploaded Successfully! ${countSaved} Student saved.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: "An error occurred while processing the request.",
      error: error.message,
    });
  }
}

export default handler;
