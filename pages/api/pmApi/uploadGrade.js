import formidable from "formidable";
import fs from "fs";
import path from "path";

import { getServerSession } from "next-auth/next";
const { connect, disconnect } = require("../../../utilities/db");
// const { getMajor, CreateCourse } = require("../../controller/queries");

import xlsx from "xlsx";
// import { env } from 'process';
import { authOptions } from "../auth/[...nextauth]";



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

    const readFile = (file, saveLocally, place) => {
      const options = {};
      if (saveLocally) {
        options.uploadDir = place;

        // eslint-disable-next-line no-unused-vars
        options.filename = (name, ext, path1, form) => {

          if (
            path1.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            let sourceDir = fs.readdirSync(place);

            sourceDir.forEach((file) => {
              const filePath = path.join(place, file);
              const stats = fs.statSync(filePath);
              if (stats.isFile()) {
                // fs.unlinkSync(filePath);
                // // console.log('Deleted file:', filePath);
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
      localDiskPath + "/sis-application-data/sis-documents-programManager/grade";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    await readFile(req, true, directory);

    let grade_file = await fs.readdirSync(directory);

  
    if (!grade_file) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "File path not provided.",
      });
    }

    let grade_files = await fs.readdirSync(directory);

    const sortedFiles = grade_files.slice().sort((fileA, fileB) => {
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
 

    for (const row of data) {
      try {
        // const major = await getMajor(connection, row.MajorName);
        // if (!major || major.rows.length === 0) {
        //   console.error(`Major not found for row: `, row);
        //   continue; // Skip this row if the major is not found
        // }

        // const majorid = major.rows[0].major_id;
       
        if(row.studentID === undefined || row.StudentFirstName === undefined 
          || row.StudentLastName === undefined || row.studentID === '' || row.Grade === undefined || row.StudentFirstName === '' 
          || row.StudentLastName === '' || row.Grade === ''){
            return res.status(400).json({
              success:false ,
              code : 400,
              message:`No data was uploaded due to missing required information.`
            })
          }
   
        // const response = await CreateCourse(connection, {
        //   student_id: row.CourseID,
        //   course_name: row.CourseName,
        //   course_credit: row.CourseCredit,
        //   course_type: row.CourseType,
        //   major_id: majorid,
        // });
        // if (response) {
        //   countSaved++; // Increment the count of saved records
        // } else {
        //   console.error(`Failed to save row: `, row);
        // }
      } catch (error) {
        console.error(`Error while processing row: `, row, "\nError: ", error);
      }
    }

    // Close the database connection after all operations
    await disconnect(connection);

    return res.status(201).json({
      success: true,
      code: 201,
      message: `Course Uploaded Successfully!`,
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
