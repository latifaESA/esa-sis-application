import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';
import AttendanceList from '../../components/Dashboard/AttendanceList'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function attendance() {

  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const router = useRouter()


  let pm
  let notPm 
  console.log(session?.user.role)
    if(session?.user.role == 2){
      pm = true
      notPm = false
    }else {
      pm = false
      notPm = true
    }
    if(notPm){ 
      setTimeout(() => { 
        router.push('/')
      }, 3000)
    }

  const [attendanceId, setAttendanceId] = useState('')
  const [studentid, setStudentid] = useState('')
  const [teacherid, setTeacherid] = useState('')
  const [majorid, setMajorid] = useState('')
  const [courseid, setCourseid] = useState('')
  const [presence, setPresence] = useState()


  const handleAttendance = async() => {
    console.log(attendanceId, studentid, teacherid, majorid, courseid,presence)
    let sendData = {
      attendance_id:attendanceId,
      student_id:studentid,
      teacher_id:teacherid,
      major_id:majorid,
      courseid: courseid,
      presence: presence
    }
    console.log(sendData)
    console.log(JSON.stringify(sendData))
    // id,firstname,lastname,major,promotion,status
    let {data} = await axios.post('http://localhost:3000/api/pmApi/filterSearch', sendData)

    console.log('this is data')
    console.log(data)
    setUsers(data)
  }

  return (
    <>
      <Head>
        <title>SIS Admin - Attendance</title>
      </Head>
     {pm && <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Attendance</p>
      <form >
        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
          <label className='w-[350px]'>
            Attendance ID:       
            <input
              className="ml-3 w-40" 
              type="number"
              name="attendance_id"
              placeholder='Attendance ID'
              // value={formData.ID}
              onChange={(e) => {setAttendanceId(e.target.value)}}
            ></input>
          </label>

          <label className='w-[350px]'>
            Student ID:
            <input
              className="ml-2 w-40 max-[850px]:ml-10"
              type="number"
              name="student_id"
              placeholder='Student ID'
              // value={formData.Fname}
              onChange={(e) => {setStudentid(e.target.value)}}
            ></input>
          </label>

          <label className='w-[350px]'>
            Teacher ID:
            <input
              className="ml-1 w-40 max-[850px]:ml-10"
              type="text"
              name="teacher_id"
              placeholder='Teacher ID'
              // value={formData.Lname}
              onChange={(e) => {setTeacherid(e.target.value)}}
            ></input>
          </label>
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
          <label className='w-[350px]'>
            Major ID:
            <input
              className="ml-[49px] w-40 max-[850px]:ml-[52px]"  
              type="number"
              name="major_id"
              placeholder='Major ID'
              // value={formData.ID}
              onChange={(e) => {setMajorid(e.target.value)}}
            ></input>
          </label>
          <label className='w-[350px]'>
            Date:
            <input
              className="ml-12  w-40 max-[850px]:ml-20"
              type="date"
              name="from"
              // value={formData.from}
              // onChange={handleChange}
            ></input>
          </label>

          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
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
     
          <label className='w-[350px]'>
            Course ID:
            <input
              className="ml-[45px] w-40" 
              type="number"
              name="course_id"
              placeholder='Course ID'
              // value={formData.ID}
              onChange={(e) => {setCourseid(e.target.value)}}
            ></input>
          </label>

          <label className='w-[350px]'>
            Presence:
            <select
              className="ml-5 w-40 max-[850px]:ml-[52px]"
              name="status"
              // value={formData.status}
              onChange={(e) => {setPresence(e.target.value)}}
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
              onClick={handleAttendance}
            >
              Search
            </button>
            <button
              className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold"
              type="button"
              // onClick={handleShowAll}
            >
              Show All
            </button>
          </div>
        </div>
        <AttendanceList users={users} setUsers={setUsers} />
      </form>
    </>}
    {
        notPm && <div className='text-center text-red-500'>
          user unauthenticated or in wrong section you will be redirected soon
          <Link href='/' legacyBehavior>
          <p className='underline cursor-pointer hover:text-blue-800'>
            Click Here To Return Back To Home Page
          </p>
        </Link>
        </div>
      }
    </>
  );
}
attendance.auth = true;
attendance.adminOnly = true;
