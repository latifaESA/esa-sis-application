import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { connect, disconnect } from "../../../../utilities/db";
import { getMajor, CreateCourse } from "../../controller/queries";
import xlsx from "xlsx";
import multer from "multer";
import CourseExist from "../../pmApi/exist/getCourses";
import csv from "csv-parser";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = "C:/sis-application-data/sis-documents-Admin/course";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log(file.originalname)
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(400).send({ message: `${req.method} not supported` });
    }
    // const session = await getServerSession(req, res);
    // if (!session) {
    //   return res.status(401).send({ message: "Signin Required To Save Data" });
    // }

    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          code: 500,
          message: "An error occurred while uploading the file.",
          error: err.message,
        });
      }

      const { file } = req;

      const readFile = (filePath) => {
        return new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
              resolve({ fields: results });
            })
            .on("error", (error) => {
              reject(error);
            });
        });
      };


      const { fields } = await readFile(file.path);

      const connection = await connect();
      let countSaved = 0; // Add a variable to track the number of records saved
  
      for (const row of fields) {
        console.log('row', row.CourseID)
        try {
          const major = await getMajor(connection, row.MajorName);
          if (!major || major.rows.length === 0) {
            console.error(`Major not found for row: `, row);
            continue; // Skip this row if the major is not found
          }
  
          const majorid = major.rows[0].major_id;
         
          if(row.CourseID === undefined || row.CourseName === undefined || row.MajorName === undefined 
            || row.CourseCredit === undefined || row.CourseType === undefined || row.CourseID === '' || row.MajorName=== ''|| row.CourseName === '' 
            || row.CourseCredit === '' || row.CourseType === ''){
              return res.status(400).json({
                success:false ,
                code : 400,
                message:`No data was uploaded due to missing required information.`
              })
            }
            const exist = await CourseExist(connection , row.CourseID , majorid)
       
            if(exist){
              return res.status(400).json({
                success:false ,
                code : 400,
                message:`Courses Already Exist! ${countSaved === 0 ? 'No Courses Saved' : `${countSaved} Courses Saved`} `
              })
            }
          const response = await CreateCourse(connection, {
            course_id: row.CourseID,
            course_name: row.CourseName,
            course_credit: row.CourseCredit,
            course_type: row.CourseType,
            major_id: majorid,
          });
          if (response) {
            countSaved++; // Increment the count of saved records
          } else {
            console.error(`Failed to save row: `, row);
          }
        } catch (error) {
          console.error(`Error while processing row: `, row, "\nError: ", error);
        }
      }
  
      // Close the database connection after all operations
      await disconnect(connection);

      return res.status(201).json({
        success: true,
        code: 201,
        message: `Course Uploaded Successfully!${countSaved} Course Saved`,
      });
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
