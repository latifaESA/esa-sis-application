import Head from 'next/head';
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { appIsWaiting } from '../../redux/slices/appSlice';
import CourseList from '../../components/Dashboard/CourseList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import axios from 'axios';
import * as XLSX from 'xlsx';
import UploadCourses from './UploadCourses';
import { saveAs } from 'file-saver';

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
  const [openUpload , setOpenUpload] = useState(false)

  const headerCourse = [
    ['CourseID', 'CourseName', 'CourseCredit', 'CourseType', 'MajorName'],
  ];

  const redirect = () => {
    router.push('/AccessDenied');
  };

  const handleUpload = ()=>{
    setOpenUpload(true)
  }
  const getAllType = async () => {
    let table = 'course_type';
    let typeCourse = await axios.post('/api/pmApi/getAll', { table });
  
    setType(typeCourse.data.rows);
  };
  const handleCourses = async () => {
    // console.log(courseid, courseName, courseCredit, majorid)
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
  };
  useEffect(() => {
    handleShowAll();
    getAllType();
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
      const calculateColumnWidths = (data) => {
        const columnWidths = data[0].map((col, colIndex) => {
          const maxContentWidth = data.reduce((max, row) => {
            const cellContent = row[colIndex] !== undefined ? row[colIndex].toString() : '';
            const contentWidth = cellContent.length;
            return Math.max(max, contentWidth);
          }, col.length);
          
          return { wch: maxContentWidth };
        });
    
        return columnWidths;
      };
      const createExcelTemplateCourse = () => {
        const majors = session.user?.majorName
        const data = headerCourse.concat([
          ['', '', '', '', majors], // MajorName data
        ])
      
        const columnWidths = calculateColumnWidths(data);
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        worksheet['!cols'] = columnWidths;
      
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Course');
      
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const excelBlob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(excelBlob, 'course.xlsx');
      };
      
    
   

  return (
    <>
      <Head>
        <title>SIS Admin - Courses</title>
      </Head>
      
      {session?.user.role === '2' || session?.user.role === '3' ? (
        <>
             {openUpload ? <UploadCourses setOpenUpload={setOpenUpload} />:<></>}
    
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
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
              <label className="w-[350px] invisible max-[850px]:visible max-[850px]:hidden">
                Major Name:
                <input
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden  w-40 max-[850px]:ml-20"
                  type="number"
                  name="major_id"
                  placeholder="Major Name"
                  // value={formData.ID}
                  // onChange={(e) => {setMajorid(e.target.value)}}
                ></input>
              </label>
              <label className="w-[350px] invisible max-[850px]:visible max-[850px]:hidden">
                Date:
                <input
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden  w-40 max-[850px]:ml-20"
                  type="date"
                  name="from"
                  // value={formData.from}
                  // onChange={handleChange}
                ></input>
              </label>

              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                To:
                <input
                  className="ml-16 w-40 invisible max-[850px]:visible max-[850px]:hidden max-[850px]:ml-[60px]"
                  type="date"
                  name="to"
                  // value={formData.to}
                  // onChange={handleChange}
                ></input>
              </label>
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}

              <label className="">
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

              <label className="w-[350px] invisible max-[850px]:visible max-[850px]:hidden">
                Presence:
                <select
                  className="ml-5 w-40 max-[850px]:ml-[52px] invisible max-[850px]:visible max-[850px]:hidden"
                  name="status"
                  // value={formData.status}
                  // onChange={(e) => {setPresence(e.target.value)}}
                >
                  <option value={''}>Choose Value...</option>
                  <option value={true}>Present</option>
                  <option value={false}>Absent</option>
                </select>
              </label>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={handleCourses}
                >
                  Search
                </button>
                <button
                  className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold"
                  type="reset"
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
              {isExeMajor ? <>
                <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={createExcelTemplateCourse}
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
              </>:<></>}
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
