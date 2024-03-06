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
  uploadInfo,
  uploadStudent,
  ActiveUser,
  userDocument,
  uploadStudentFinancial,

} = require("../../controller/queries");

import xlsx from "xlsx";
// import { env } from 'process';
import { authOptions } from "../../auth/[...nextauth]";
import SendEmail from "./emailFormat";
import hash from "./hash";
import StudentExist from "./studentExist";
import PromotionExist from "./promotionExist";
import PromotionMajorExist from "./isPromotionToMajor";
import DataSettings from "../../controller/getDataSettings";


export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  try {
    // const message = '';
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
            // path1.mimetype === "application/pdf" ||
            // path1.mimetype === "application/x-pdf" ||
            // path1.mimetype === "image/png" ||
            // path1.mimetype === "image/jpeg" ||
            // path1.mimetype === "image/jpg" ||
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

    // Initialize a set to store unique emails
    const emailSet = new Set();


    for (const fieldKey in fields) {
      let countSaved = 0; // Add a variable to track the number of records saved
      const connection = await connect();

      // Access the field value using the key from the fields object
      const field = fields[fieldKey];
      // Check for duplicate email
      if (emailSet.has(field.Email)) {
        return res.status(200).json({
          success: true,
          code: 200,
          message: `Duplicate email found: ${field.Email}`,
        });
      }

      // Add the email to the set
      emailSet.add(field.Email);
      // Check if the necessary fields exist in the field object

      const major = await getMajor(connection, field.MajorName);

      const majorid = major.rows[0].major_id;
      const exist = await StudentExist(connection, field.Email, majorid);
     

      if (exist) {
        return res.status(200).json({
          success: true,
          code: 200,
          message: `Student Already Exist! ${countSaved === 0 ? 'No Students Saved' : `${countSaved} Students Saved`
            }`,
        });
      }

      const promotion_name = field.Promotion.replace(/\s+/g, '').toUpperCase();
      const promotion_exist = await PromotionExist(connection, promotion_name);

      if (!promotion_exist) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: `Promotion ${promotion_name} not Found`,
        });
      }

      const major_exist = await PromotionMajorExist(connection, promotion_name, majorid);

      if (!major_exist) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: `Promotion ${promotion_name} not in major ${field.MajorName}`,
        });
      }


    }

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
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Excel file is empty. No data to upload.",
      });
    }


    const connection = await connect();

    let countSaved = 0; // Add a variable to track the number of records saved



    let idx = 0;



    for (const row of data) {

      try {

        const major = await getMajor(connection, row.MajorName);
        if (!major || major.rows.length === 0) {
          console.error(`Major not found for row: `, row);
          continue; // Skip this row if the major is not found
        }


        const majorid = major.rows[0].major_id;


        let field = fields[idx];

        idx++;
        // console.log('field.Email\n' , field.Email , 'field.Promotion\n',
        // field.Promotion, 
        // 'field.MobileNumber\n',field.MobileNumber , 'field.Gender\n' , field.Gender , 
        // 'field.StudentFirstName\n',field.StudentFirstName,
        // 'field.StudentLastName\n',field.StudentLastName,
        // 'field.AcademicYear\n',field.AcademicYear,
        // 'field.DateOfBirth\n' , field.DateOfBirth
        // )
        if (field.Email === undefined || field.Promotion === undefined || field.MobileNumber === undefined || field.Gender === undefined
          || field.StudentFirstName === undefined || field.AcademicYear === undefined || field.DateOfBirth === undefined || field.StudentLastName === undefined || field.Email === '' || field.MobileNumber === ''
          || field.StudentFirstName === '' || field.Promotion === '' || field.AcademicYear === '' || field.Gender === '' || field.StudentLastName === '' || field.DateOfBirth === '') {
          return res.status(400).json({
            success: false,
            code: 400,
            message: `No data was uploaded due to missing required information.`
          })
        }

        const settings = await DataSettings(connection, 'settings')

        const esa_logo = settings[0].esa_logo



        const StudentArray = Object.values({ field });

        const uploadPromises = StudentArray.map(async (student) => {
          const userpasswordref = await hash(student.userpassword);



          await ActiveUser(connection, {
            userid: student.student_id,
            userpassword: userpasswordref,
            token: "",
            isVerified: "",
            update_time: "",
          });

          await userDocument(connection, {
            userid: student.student_id,
            profileurl: '',
          });

          await uploadAddress(connection, {
            userid: student.student_id,
            address_country: student.Country,
            address_region: student.Region,
            address_city: student.City,
            address_street: student.Street,
            address_building: student.Building,
            address_floor: student.Floor,
            address_postal: student.Postal,
          });
          await uploadContact(connection, {
            userid: student.student_id,
            email: student.Email,
            email_two: student.SecondEmail,
            mobile_number: student.MobileNumber,
            landline_number: student.LandLineNumber,
          });
          await uploadEducation(connection, {
            userid: student.student_id,
            degree_level: student.Degree,
            series: student.Series,
            obtain_date: student.DateObtain,
            education_country: student.EducationCountry,
            establishment: student.Establishment,
            other_establishment: student.otherEstablishment,
          });
          await uploadEmerg(connection, {
            userid: student.student_id,
            prefix: student.EmergencePrefix,
            emerg_firstname: student.EmergenceFirstName,
            emerg_middlename: student.EmergenceMiddleName,
            emerg_lastname: student.EmergenceLastName,
            emerg_phonenumber: student.EmergencePhoneNumber,
            emerg_relationship: student.EmergenceRelationShip,
            emerg_medicalhealth: student.EmergenceMedicalHealth,
            emerg_diseasetype: student.EmergenceDisease,
          });
          await uploadInfo(
            connection,
            {
              userid: student.student_id,
              title: student.Title,
              firstname: student.StudentFirstName,
              fathername: student.FatherName,
              lastname: student.StudentLastName,
              maidename: student.maidename,
              mothername: student.MotherName,
              gender: student.Gender,
              dateofbirth: new Date((student.DateOfBirth - 25569) * 86400 * 1000), // Convert Excel date to JavaScript date,
              countryofbirth: student.CountryOfBirth,
              placeofbirth: student.PlaceOfBirth,
              registernumber: student.RegisterNumber,
              martialstatus: student.MartialStatus,
              firstnationality: student.FirstNationality,
              secondnationality: student.SecondNationality
            }
          )

          const response = await uploadStudent(connection, {
            student_id: student.student_id,
            status: "active",
            promotion: student.Promotion.replace(/\s+/g, '').toUpperCase(),
            academic_year: student.AcademicYear,
            student_firstname: student.StudentFirstName,
            student_lastname: student.StudentLastName,
            major_id: majorid,
          })
          if(response){
            await uploadStudentFinancial(connection, {
              student_id: student.student_id,
              pims_id: student.PimsId
            })
  
          }
          await SendEmail(
            student.StudentFirstName,
            student.Email,
            student.userpassword,
            student.student_id,
            esa_logo
          );

          return response

        })


        const responses = await Promise.all(uploadPromises);

        if (responses) {
          countSaved++; // Increment the count of saved records
        } else {
          console.error(`Failed to save row: `, row);
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          code: 500,
          message: error.message,
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
    console.log(error.message)
    return res.status(500).json({
      success: false,
      code: 500,
      message: "An error occurred while processing the request.",
      error: error.message,
    });
  }
}

export default handler;
