import formidable from "formidable";
import fs from "fs";
import path from "path";

import { getServerSession } from "next-auth/next";
const { connect, disconnect } = require("../../../../utilities/db");
const { uploadTeacher } = require("../../controller/queries");

import xlsx from "xlsx";

import { authOptions } from "../../auth/[...nextauth]";
import teacherExist from "./ExistTeacher";

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
          // // console.log("user",form)

          if (
            // path1.mimetype === 'application/pdf' ||
            // path1.mimetype === 'application/x-pdf' ||
            // path1.mimetype === 'image/png' ||
            // path1.mimetype === 'image/jpeg' ||
            // path1.mimetype === 'image/jpg' ||
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
      localDiskPath + "/sis-application-data/sis-documents-Admin/teacher";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
 
    const { fields } = await readFile(req, true, directory);
    let course_file = await fs.readdirSync(directory);



    // Access the file path from the 'files' object
    // const buffer = attendance_file.slice(-1)
    // // console.log(directory)
    if (!course_file) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "File path not provided.",
      });
    }

    let course_files = await fs.readdirSync(directory);

    const sortedFiles = course_files.slice().sort((fileA, fileB) => {
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

    // Check if the data array is empty
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Excel file is empty. No data to upload.",
      });
    }


    const connection = await connect();
    let countSaved = 0; // Add a variable to track the number of records saved
    for (const row of data) {
      try {
        // const teacherId = fields[0].teacher_id
          const teacherArray = Object.values(fields);

        const uploadPromises = teacherArray.map(async (teacher) => {
          const exist = await teacherExist(connection ,
            teacher.email
            )
          
            if(exist){
              return res.status(200).json({
                success:true,
                code:200,
                message:`Teachers Already Exist! ${countSaved === 0 ? 'No Teachers Saved' : `${countSaved} Teachers Saved`}`
              })
            }
          if (
            teacher.firstName === undefined ||
            teacher.lastName === undefined ||
            teacher.email === undefined ||
            teacher.firstName === '' ||
            teacher.lastName === '' ||
            teacher.email === ''
          ) {
            return res.status(400).json({
              success: false,
              code: 400,
              message: `No data was uploaded due to missing required information.`
            })
          }

          const response = await uploadTeacher(connection, {
            teacher_id: teacher.teacher_id,
            teacher_firstname: teacher.firstName,
            teacher_mail: teacher.email,
            teacher_lastname: teacher.lastName,
          });


          countSaved++; // Increment the count of saved records
          return response;
        });

        // Wait for all promises to resolve
        const responses = await Promise.all(uploadPromises);

        if (responses) {
          return res.status(201).json({
            success: true,
            code: 201,
            message: `Teachers Uploaded Successfully! ${countSaved} Teachers saved.`,
          });
        } else {
          return res.status(401).json({
            success: false,
            code: 401,
            message: `Failed to save row: ${row} `,
          });
        }
      } catch (error) {
         return error
      }
    }

    // Close the database connection after all operations
    await disconnect(connection);


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
