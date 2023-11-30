import { useSession } from 'next-auth/react';
import Head from 'next/head';
import StudentsList from '../../components/Dashboard/StudentsList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import axios from 'axios';
// import { x64 } from 'crypto-js';

import CustomSelectBox from './customSelectBox';
import UploadStudent from './UploadStudent';
// import Link from 'next/link';

export default function Students() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const router = useRouter();
  // const [major, setMajor] = useState([]);
  const [allMajor, setallMajor] = useState([]);
  const [status, setStatus] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [test, setTest] = useState(false);

  const [idValue, setIdValue] = useState('');
  const [firstnameValue, setFirstnameValue] = useState('');
  const [lastnameValue, setLastnameValue] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [promotionValue, setPromotionValue] = useState('');
  const [promotionsName , setPromotionName] = useState('')
  const [openUpload , setOpenUpload] = useState(false)

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
  
  const headerStudent = [
    [
      'StudentFirstName(required)', 'StudentLastName(required)', 'Gender(required)', 'DateOfBirth(required,e.g:(mm/dd/yyyy))',

      'AcademicYear(required)', 'Promotion(required,e.g:promo(promoNumber))', 'MajorName', 'Email(required)','MobileNumber(required)', 'Title','SecondEmail', 'LandLineNumber',

      'FatherName', 'MotherName', 'maidename', 'CountryOfBirth', 'PlaceOfBirth', 'RegisterNumber', 'MartialStatus',

      'FirstNationality', 'SecondNationality', 'Country', 'Region', 'City', 'Street', 'Building', 'Floor', 'Postal',

      'Degree', 'Series', 'DateObtain', 'EducationCountry', 'Establishment', 'otherEstablishment',

      'EmergencePrefix', 'EmergenceFirstName', 'EmergenceMiddleName', 'EmergenceLastName', 'EmergencePhoneNumber',

      'EmergenceRelationShip', 'EmergenceMedicalHealth', 'EmergenceDisease'

    ],

];

  // const headerTeacher = [['FirstName' , 'LastName' , 'Email']];
  // const headerAluminStudent = [['StudentID' , 'Status' , 'GraduatedYear']];
  const redirect = () => {
    router.push("/AccessDenied");
  };


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


  // const createExcelTemplateCourse = () => {
  //   const majors = session.user?.majorid
  //   const data = headerCourse.concat([
  //     ['', '', '', '', majors], // MajorName data
  //   ])
  
  //   const columnWidths = calculateColumnWidths(data);
  //   const worksheet = XLSX.utils.aoa_to_sheet(data);
  //   worksheet['!cols'] = columnWidths;
  
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Course');
  
  //   const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  //   const excelBlob = new Blob([excelBuffer], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   });
  //   saveAs(excelBlob, 'course.xlsx');
  // };
  const handlePromotions = async()=>{
    try {
      const dates = new Date().getFullYear()
      
      const data = await axios.post('/api/pmApi/getPromotionMajorDate' , {
       major_id : session.user?.majorid,
       date : dates
      })
   
      setPromotionName(data.data.data[0].promotion_name)
    } catch (error) {
      return error
    }
  }
  
  const createExcelTemplateStudent = () => {
    const majors = session.user?.majorName
    const data2 = headerStudent.concat([
        ['', '', '', '', '', promotionsName, majors, '', '', '', '', '', '', '', '', '', '', '', '', '',

            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',

            '', '', ''], // MajorName data
    ])

    const columnWidths = calculateColumnWidths(data2);
    const worksheet = XLSX.utils.aoa_to_sheet(data2);
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student');

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'student.xlsx');
  };



  useEffect(() => {
    handlePromotions()
    const getStatus = async () => {
      let table = 'status';
      let { data } = await axios.post('/api/pmApi/getAll', { table });

      // setUsers(data)
      // setDates(data.rows)
      // data.rows.forEach(student =>
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.status_name);
      });

      setStatus(datesArray);
    };
    getStatus();

    const getPromotion = async () => {
      let table = 'promotions';
      let Where = 'major_id';
      let id = session.user.majorid;
      let { data } = await axios.post('/api/pmApi/getAllCourses', {
        table,
        Where,
        id,
      });
      console.log('data', data.data.data);

      // setUsers(data)

      // setDates(data.rows)
      // data.rows.forEach(student =>
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.data.forEach((promotion) => {
        datesArray.push(promotion.promotion_name);
      });

      setPromotion(datesArray);
    };
    getPromotion();
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleUpload = ()=>{
    setOpenUpload(true)
  }

  useEffect(() => {
    renderValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderValues = async () => {
    let sendData = {
      id: '',
      firstname: '',
      lastname: '',
      major: session.user.majorid,
      promotion: '',
      status: '',
    };

    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post('/api/pmApi/filterSearch', sendData);
    console.log(sendData);
    setUsers(data.rows);
  };

  const handleShowAll = async () => {
    let sendData = {
      id: '',
      firstname: '',
      lastname: '',
      major: session.user.majorid,
      promotion: '',
      status: '',
    };

    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post('/api/pmApi/filterSearch', sendData);
    console.log(sendData);
    setUsers(data.rows);
    setMajorValue('');
    setTest(true);
    setIdValue('');
    setallMajor([]);
    setFirstnameValue('');
    setLastnameValue('');
    setStatusValue('');
    setPromotionValue('');
  };

  const handleMajor = (selectedValue) => {
    // Do something with the selected value
    console.log('Selected Value:', selectedValue);
    if (test) {
      selectedValue == '';
    }
    if (selectedValue.trim() !== '') {
      let majorID = allMajor.filter(
        (major) => major.major_name === selectedValue
      );
      console.log(majorID[0].major_id);
      setMajorValue(majorID[0].major_id);
    } else {
      setMajorValue('');
    }
  };
  const handleStatus = (selectedValue) => {
    // Do something with the selected value
    console.log('Selected Value:', selectedValue);
    setStatusValue(selectedValue);
  };
  const handlePromotion = (selectedValue) => {
    // Do something with the selected value
    console.log('Selected Value:', selectedValue);
    setPromotionValue(selectedValue);
  };

  const handleStudents = async (e) => {
    e.preventDefault();
    let sendData = {
      id: idValue,
      firstname: firstnameValue,
      lastname: lastnameValue,
      major: session.user.majorid,
      promotion: promotionValue,
      status: statusValue,
    };
    console.log(sendData);
    console.log(JSON.stringify(sendData));
    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post('/api/pmApi/filterSearch', sendData);

    console.log(data.rows);
    setUsers(data.rows);
  };

  

  //>>>>>>> main
  return (
    <>
  
   {openUpload ? <>
   <UploadStudent setOpenUpload={setOpenUpload}/>
    
    </>:<></>}
      <Head>
        <title>SIS Admin - Students</title>
      </Head>
      {session?.user.role === '2' || session?.user.role === '3' ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
            List Of Students
          </p>
          <form>
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label>
                ID:
                <input
                  className="ml-16 w-40"
                  type="number"
                  name="ID"
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder="Select ID"
                  // value={formData.ID}
                  // onChange={handleChange}
                ></input>
              </label>

              <label>
                First Name:
                <input
                  className="ml-2 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Fname"
                  onChange={(e) => setFirstnameValue(e.target.value)}
                  placeholder="Select Name"
                  // value={formData.Fname}
                  // onChange={handleChange}
                ></input>
              </label>

              <label>
                Last Name:
                <input
                  className="ml-1 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Lname"
                  onChange={(e) => setLastnameValue(e.target.value)}
                  placeholder="Select surname"
                  // value={formData.Lname}
                  // onChange={handleChange}
                ></input>
              </label>
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                Major:
                {/* Start select box */}
                <CustomSelectBox
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
                  // options={major}
                  placeholder="Select Major"
                  onSelect={handleMajor}
                  styled={
                    'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10'
                  }
                />
              </label>

              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                From:
                <input
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
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

              <label className="w-[350px]">
                Promotion:
                {
                  <CustomSelectBox
                    options={promotion}
                    placeholder="Select Promotion"
                    onSelect={handlePromotion}
                    styled={
                      'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]'
                    }
                  />
                }
              </label>

              <label>
                Status:
                {
                  <CustomSelectBox
                    options={status}
                    placeholder="Select Status"
                    onSelect={handleStatus}
                    styled={
                      'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10'
                    }
                  />
                }
              </label>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="submit"
                  onClick={handleStudents}
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
                  onClick={createExcelTemplateStudent}
                >
                  Student Template
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
            <StudentsList users={users} setUsers={setUsers} />
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
