import Head from 'next/head';
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { appIsWaiting } from '../../redux/slices/appSlice';
import CourseList from '../../components/Dashboard/CourseList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import axios from 'axios';
// import * as XLSX from 'xlsx';
import UploadCourses from './UploadCourses';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import ExcelJS from 'exceljs';

export default function Courses() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  // const [majorid, setMajorid] = useState('')
  const [courseid, setCourseid] = useState('');
  const [courseName, setcourseName] = useState('');
  const [courseCredit, setcourseCredit] = useState('');
  const [courseType, setcourseType] = useState('');
  const router = useRouter();
  const [type, setType] = useState([]);
  const [openUpload, setOpenUpload] = useState(false)
  const [DataCourseType, setDataCourseType] = useState([]);
  console.log(DataCourseType)



  const redirect = () => {
    router.push('/AccessDenied');
  };
  const headerCourse = [['CourseID', 'CourseName', 'CourseCredit', 'CourseType', 'MajorName']]

  const handleUpload = () => {
    setOpenUpload(true)
  }
  const getAllType = async () => {
    let table = 'course_type';
    let typeCourse = await axios.post('/api/pmApi/getAll', { table });

    setType(typeCourse.data.rows);
  };
  const handleCourses = async () => {
    // console.log(courseid, courseName, courseCredit, majorid)
    try {

      let sendData = {
        course_id: courseid.trim(),
        course_name: courseName,
        course_credit: courseCredit,
        major_id: session.user.majorid,
        course_type: courseType,
      };
      // console.log(sendData)
      // console.log(JSON.stringify(sendData))
      // id,firstname,lastname,major,promotion,status
      let { data } = await axios.post('/api/pmApi/filterCourse', sendData);


      setUsers(data.data);
    } catch (error) {
      setUsers([])
      return error
    }

  };
  useEffect(() => {
    handleShowAll();
    getAllType();
    const fetchCourseType= async () => {
      try {
        const table = 'course_type';
        const data = await axios.post('/api/pmApi/getAll', { table });
        setDataCourseType(data.data.rows);
      } catch (error) {
        return error;
      }
    };
    fetchCourseType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowAll = async () => {
    let sendData = {
      course_id: '',
      course_name: '',
      course_credit: '',
      major_id: session.user.majorid,
      course_type: '',
    };

    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post('/api/pmApi/filterCourse', sendData);

    setUsers(data.data);
    // setMajorid('')
    setCourseid('');
    setcourseName('');
    setcourseCredit('');
    setcourseType('');
  };

  // Function to extract the first word before a hyphen "-"
  const getFirstWordBeforeHyphen = (text) => {
    if (text) {
      const words = text.split("-");
      if (words.length > 0) {
        return words[0];
      }
    }
    return "";
  };
  const firstMajorWord = getFirstWordBeforeHyphen(session?.user.majorName);

  const isExeMajor = firstMajorWord === "EXED";
  // const calculateColumnWidths = (data) => {
  //   const columnWidths = data[0].map((col, colIndex) => {
  //     const maxContentWidth = data.reduce((max, row) => {
  //       const cellContent = row[colIndex] !== undefined ? row[colIndex].toString() : '';
  //       const contentWidth = cellContent.length;
  //       return Math.max(max, contentWidth);
  //     }, col.length);

  //     return { wch: maxContentWidth };
  //   });

  //   return columnWidths;
  // };
//   const createExcelTemplateCourse = async () => {
//     if (!Array.isArray(DataCourseType) || DataCourseType.length === 0) {
//         console.error("DataCourseType is empty or not an array");
//         return;
//     }

//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Course');

//     // Add header row
//    sheet.addRow(['CourseID', 'CourseName', 'CourseCredit', 'CourseType', 'MajorName']);

//     // Define the list of valid CourseType options
//     const courseTypeOptions = DataCourseType.map(course => course.course_type);

//     // Add data row with selected major
//    sheet.addRow(['', '', '', '', session.user?.majorName]);

//     // Set default column widths
//     sheet.columns.forEach((column, index) => {
//         if (index === 4) {
//             column.width = 38; // Set a larger width for the last column
//         } else {
//             column.width = 15; // Set default width for other columns
//         }
//     });

//     // Apply data validation to all cells in the "CourseType" column
//     const courseTypeColumn = sheet.getColumn('D');
//     courseTypeColumn.eachCell((cell, rowNumber) => {
//         if (rowNumber > 1) { // Skip header row
//             cell.dataValidation = {
//                 type: 'list',
//                 formulae: [`"${courseTypeOptions.join(',')}"`], // Apply the dropdown list to each cell in the "CourseType" column
//             };
//         }
//     });

//     // Generate Excel file
//     const buffer = await workbook.xlsx.writeBuffer();
//     const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(excelBlob, 'course.xlsx');
// };

const calculateColumnWidths = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
      return []; // Return an empty array if data is not valid
  }

  const columnWidths = data[0].map((col, colIndex) => {
      // Set a default width for each column
      let maxContentWidth = 20; // Default width

      // Iterate through each row to find the maximum content width in the column
      data.forEach((row) => {
          if (Array.isArray(row) && colIndex < row.length) {
              const cellContent = row[colIndex] !== undefined ? row[colIndex].toString() : '';
              const words = cellContent.split(''); // Split the content into words
              const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), ''); // Find the longest word
              const contentWidth = longestWord.length * 7; // Adjust the multiplier as needed
              maxContentWidth = Math.max(maxContentWidth, contentWidth);
          }
      });

      return { wch: maxContentWidth };
  });

  return columnWidths;
};


const createCSVTemplateCourse = () => {
  const majors = session.user?.majorName
  const data2 = headerCourse.concat([
    ['', '', '', '', majors],
  ]);

  const columnWidths = calculateColumnWidths(data2);
  console.log('columnWidths' , columnWidths)
  const worksheet = XLSX.utils.aoa_to_sheet(data2);
  worksheet['!cols'] = columnWidths;

  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  console.log('csvContent' , csvContent.length)
  
  const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  saveAs(csvBlob, 'Course.csv');
};




  return (
    <>
      <Head>
        <title>SIS Admin - Courses</title>
      </Head>

      {session?.user.role === '2' || session?.user.role === '3' ? (
        <>
          {openUpload ? <UploadCourses setOpenUpload={setOpenUpload} handleShowAll={handleShowAll}/> : <></>}

          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Courses</p>
          <form>
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label className="w-[350px]">
                Course ID:
                <input
                  className="ml-10 w-40 max-[850px]:ml-8"
                  type="text"
                  name="attendance_id"
                  placeholder="Course ID"
                  // value={formData.ID}
                  onChange={(e) => {
                    setCourseid(e.target.value);
                  }}
                ></input>
              </label>

              <label className="w-[350px]">
                Course Name:
                <input
                  className="ml-3 w-40 max-[850px]:ml-1"
                  type="text"
                  name="course_name"
                  placeholder="Course Name"
                  // value={formData.Fname}
                  onChange={(e) => {
                    setcourseName(e.target.value);
                  }}
                ></input>
              </label>

              <label className="w-[350px]">
                Course Credit:
                <input
                  className="ml-3 w-40 max-[850px]:ml-1"
                  type="number"
                  name="course_credit"
                  placeholder="Course Credit"
                  // value={formData.Lname}
                  onChange={(e) => {
                    setcourseCredit(e.target.value);
                  }}
                ></input>
              </label>

              <label className="ml-10">
                Type:
                <select
                  className="ml-10 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                  value={courseType}
                  onChange={(e) => setcourseType(e.target.value)}
                >
                  <option value="">Choose Type..</option>
                  {type &&
                    type.map((type) => (
                      <>
                        <option key={type.course_type} value={type.course_type}>
                          {type.course_type}
                        </option>
                      </>
                    ))}
                </select>
              </label>
              

              <div className="flex flex-col min-[850px]:flex-row gap-4 min-[850px]:col-start-2 min-[1100px]:col-start-3 h-10 max-[850px]:mb-16 mt-3">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={handleCourses}
                >
                  Search
                </button>
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
              {isExeMajor ? <>
                <div className="flex flex-col min-[850px]:flex-row gap-4 min-[850px]:col-start-2 min-[1100px]:col-start-3 h-10 max-[850px]:mb-16">
                  <button
                    className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                    type="button"
                    onClick={createCSVTemplateCourse}
                  >
                    Course Template
                  </button>
                  <button
                    className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold"
                    type="button"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </> : <></>}
            </div>
            <CourseList users={users} setUsers={setUsers} />
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Courses.auth = true;
Courses.adminOnly = true;
