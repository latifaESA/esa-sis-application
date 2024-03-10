import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
const { connect, disconnect } = require("../../../../utilities/db");
const { getMajor, CreateCourse } = require("../../controller/queries");
import xlsx from "xlsx";
import { authOptions } from "../../auth/[...nextauth]";
import CourseExist from "../../pmApi/exist/getCourses";

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

    const localDiskPath = path.parse(require("os").homedir()).root;
    const directory = localDiskPath + "/sis-application-data/sis-documents-Admin/course";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = directory;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          code: 500,
          message: "An error occurred while parsing the file.",
          error: err.message,
        });
      }

      const file = files.files;
      const filePath = file.path;

      const buffer = fs.readFileSync(filePath);
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
      let countSaved = 0;

      for (const row of data) {
        try {
          const major = await getMajor(connection, row.MajorName);
          if (!major || major.rows.length === 0) {
            console.error(`Major not found for row: `, row);
            continue;
          }

          const majorid = major.rows[0].major_id;

          if (!row.CourseID || !row.CourseName || !row.MajorName || !row.CourseCredit || !row.CourseType) {
            return res.status(400).json({
              success: false,
              code: 400,
              message: "No data was uploaded due to missing required information.",
            });
          }

          const exist = await CourseExist(connection, row.CourseID, majorid);
          if (exist) {
            return res.status(400).json({
              success: false,
              code: 400,
              message: `Courses Already Exist! ${countSaved === 0 ? 'No Courses Saved' : `${countSaved} Courses Saved`}`,
            });
          }

          const response = await CreateCourse(connection, {
            course_id: row.CourseID,
            course_name: row.CourseName,
            course_credit: row.CourseCredit,
            course_type: row.CourseType,
            major_id: majorid,
          });

          if (response) {
            countSaved++;
          } else {
            console.error(`Failed to save row: `, row);
          }
        } catch (error) {
          console.error(`Error while processing row: `, row, "\nError: ", error);
        }
      }

      await disconnect(connection);

      return res.status(201).json({
        success: true,
        code: 201,
        message: `Course Uploaded Successfully! ${countSaved} Courses saved.`,
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
