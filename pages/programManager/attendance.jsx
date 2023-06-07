import Head from 'next/head';
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { appIsWaiting } from '../../redux/slices/appSlice';
import AttendanceList from '../../components/Dashboard/AttendanceList'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import axios from 'axios';
import CustomSelectBox from "./customSelectBox";
export default function attendance() {

  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const router = useRouter()
  const redirect = () => { 
    router.push('/AccessDenied')
  }

  const [attendance_id, setAttendanceId] = useState('')
  const [student_id, setStudentid] = useState('')
  const [teacher_id, setTeacherid] = useState('')
  const [major_id, setMajorid] = useState('');
  const [major, setMajor] = useState([]);
  const [allMajor , setAllMajor]=useState([])
  const [course_id, setCourseid] = useState('')
  const [present, setPresent] = useState('') 
  const [teacher_firstname , setTeacherFirstName]=useState('')
  const [teacher_lastname , setTeacherLastName]=useState('')
  const [attendance_date, setattendanceDate] = useState('')
  const [major_name, setMajorName] = useState('')
  const [allmajor , setallMajor]=useState([])
  const [majorValue,setMajorValue]=useState([])
  const [test, setTest] = useState()
 console.log(session)

  useEffect(()=>{
    const getMajor = async () => { 
      let table = 'major';
      let {data} = await axios.post('http://localhost:3000/api/pmApi/getAll', {table})

      console.log('major')
      console.log(data.rows)
      setAllMajor(data.rows)

      const datesArray = [];
      data.rows.forEach((attendance) => {
        datesArray.push(attendance.major_name);
      });

      setMajor(datesArray);
      console.log(major,'before')
    }
    getMajor()
    const fetchData = async()=>{
       try {
        const payload ={
          attendanceId :"",
          studentId:"",
          teacherId:"" ,
            majorId:session.user.majorid ,
          courseId:"" , 
          attendanceDate:"" , 
          present:"",
          teacher_firstname:'',
          teacher_lastname:'',
          major_name:''
          

        } 
        const result = await axios.post("http://localhost:3000/api/pmApi/filterAttendance" , payload)
        console.log("data",result.data.data)
        setUsers(result.data.data)
       } catch (error) {
         return error
       }
    };
    fetchData();
   
  },[])
  console.log(session.user.majorid)

const handleShowAll = async() => {
  try {
    const payload ={
      attendanceId :"",
      studentId:"",
      teacherId:"" ,
      majorId:session.user.majorid ,
      courseId:"" , 
      attendanceDate:"" , 
      present:"",
      teacher_teacherfirstname:'',
      teacher_teacherlastname:'',
      major_name:"",

    } 
    const result = await axios.post("http://localhost:3000/api/pmApi/filterAttendance" , payload)
    setUsers(result.data.data)
    setAttendanceId('')
    setCourseid('')
    setTeacherid('')
    setStudentid('')
    setattendanceDate('')
    setPresent('')
    setTeacherFirstName('')
    setTeacherLastName('')
    setMajorName('')
    setMajorValue('')
    setTest(true)
   } catch (error) {
     return error
   }

  }
 

  const handleAttendance = async() => {
    try {
      const payload ={
        attendanceId :attendance_id,
        studentId:student_id,
        teacherId:teacher_id ,
        majorId: session.user.majorid ,
        courseId:course_id, 
        attendanceDate: attendance_date, 
        present:present,
        teacher_firstname:teacher_firstname,
        teacher_lastname:teacher_lastname,
       
      } 
      const result = await axios.post("http://localhost:3000/api/pmApi/filterAttendance" , payload)
      setUsers(result.data.data)
     } catch (error) {
       return error
     }
  }

  const handleMajor = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    if(test){ 
      selectedValue == ''
    }
    if(selectedValue.trim() !== ''){
    let majorID = allMajor.filter(major => major.major_name === selectedValue);
    console.log(majorID[0].major_id)
    setMajorValue(majorID[0].major_id)
    
  }else{
    setMajorValue("")
    
  }
  if(test == true){ 
    selectedValue === ' '
  }
  };

  return (
    <>
      <Head>
        <title>SIS Admin - Attendance</title>
      </Head>
     {session?.user.role === '2' ? ( <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Attendance</p>
      <form >
        <div className="grid gap-4 grid-cols-2  min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">

        <label className='w-[350px]'>
            Date:
            <input
              className="ml-[49px] w-40 max-[850px]:ml-[52px]"
              type="date"
              name="from"
              id={'date'}
              value={attendance_date}
              onChange={(e)=>{setattendanceDate(e.target.value)}}
            ></input>
          </label>

          <label className='w-[350px]'>
            Course ID:
            <input
              className="ml-[45px] w-40" 
              type="text"
              name="course_id"
              placeholder='Course ID'
              id={'courseId'}
              value={course_id}
              onChange={(e)=>{setCourseid(e.target.value)}}
            ></input>
          </label>


          <label className='w-[350px]'>
            Teacher firstname:
            <input
              className="ml-1 w-40 max-[850px]:ml-10"
              type="text"
              name="teacher_id"
              placeholder='Teacher LastName'
              id={'teacherId'}
              value={teacher_firstname}
              onChange={(e)=>{setTeacherFirstName(e.target.value)}}
            ></input>
          </label>
          <label className='w-[350px]'>
            Teacher lastname:
            <input
              className="ml-1 w-40 max-[850px]:ml-10"
              type="text"
              name="teacher_id"
              placeholder='Teacher FirstName'
              id={'teacherId'}
              value={teacher_lastname}
              onChange={(e)=>{setTeacherLastName(e.target.value)}}
            ></input>
          </label>
          
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
          {/* <label className='w-[350px]'> */}
            {/* Major: */}
            {/* <input
              className="ml-[49px] w-40 max-[850px]:ml-[52px]"  
              type="number"
              name="major_id"
              placeholder='Major ID'
              id={'majorId'}
              value={major_id}
              onChange={(e)=>{setMajorid(e.target.value)}}
            ></input> */}
              {/* { 
              <CustomSelectBox 
                options={major}
                placeholder="Select Major"
                onSelect={handleMajor}
                styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
                />
              } */}
          {/* </label> */}
         

          {/* <label className='invisible max-[850px]:visible max-[850px]:hidden'>
            To:
            <input
              className="ml-16 w-40 invisible max-[850px]:visible max-[850px]:hidden max-[850px]:ml-[60px]"
              type="date"
              name="to"
              value={attendance_date}
              onChange={(e)=>{setattendanceDate(e.target.value)}}
            ></input>
          </label> */}
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}
     
          <div className="flex flex-col justify-end min-[850px]:flex-row gap-4">
            <button
              className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
              type="button"
              onClick={handleAttendance}
            >
              Search
            </button>
            <button
              className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold"
              type="button"
              onClick={handleShowAll}
            >
              Show All
            </button>
          </div>
        </div>
        <AttendanceList users={users} setUsers={setUsers} />
      </form>
    </>) : redirect()}
    </>
  );
}
attendance.auth = true;
attendance.adminOnly = true;
