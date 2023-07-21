import Head from 'next/head';
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { appIsWaiting } from '../../redux/slices/appSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import axios from 'axios';
import ElectiveCourseList from '../../components/Dashboard/ElectiveCourseList';

export default function ElectiveCourse() {

  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const router = useRouter()
  const redirect = () => {
    router.push('/AccessDenied')
  }


  const [course_id, setCourseid] = useState('')
  const [student_firstname , setStudent_firstname] = useState('')
  const [student_lastname  , setStudent_lastname] = useState('')
  const [course_name  , setCourse_name] = useState('')
  const [test, setTest] = useState()
  console.log(session)

  useEffect(() => {

    const fetchData = async () => {
      try {
        const payload = {
            course_id , 
            student_firstname,
            student_lastname ,
            course_name
        }
        const result = await axios.post("/api/pmApi/filterElectiveStudent", payload)

        setUsers(result.data.data)
      } catch (error) {
        return error
      }
    };
    fetchData();

  }, [])
 
  const handleShowAll = async () => {
    try {
      const payload = {
            course_id : "" , 
            student_firstname : "",
            student_lastname:"" ,
            course_name:""

      }
      const result = await axios.post("/api/pmApi/filterElectiveStudent", payload)
      setCourseid('')
      setStudent_firstname('')
      setStudent_lastname('')
      setCourse_name('')
      setUsers(result.data.data)
      setTest(true)
    } catch (error) {
      return error
    }


  }


  const handleElective = async () => {
    try {

      const payload = {
        course_id : course_id, 
        student_firstname: student_firstname,
        student_lastname : student_lastname,
        course_name : course_name


      }
      const result = await axios.post('/api/pmApi/filterElectiveStudent', payload)
      setUsers(result.data.data)
    } catch (error) {
      return error
    }
  }

  // const handleMajor = (selectedValue) => {
  //   // Do something with the selected value
  //   console.log("Selected Value:", selectedValue);
  //   if(test){ 
  //     selectedValue == ''
  //   }
  //   if(selectedValue.trim() !== ''){
  //   let majorID = allMajor.filter(major => major.major_name === selectedValue);
  //   console.log(majorID[0].major_id)
  //   setMajorValue(majorID[0].major_id)

  // }else{
  //   setMajorValue("")

  // }
  // if(test == true){ 
  //   selectedValue === ' '
  // }
  // };

  return (
    <>
      <Head>
        <title>SIS Admin - Assign Elective</title>
      </Head>
      {session?.user.role === '2' && session?.user.majorid === '13' || session?.user.majorid === '15' ? (<>
        <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Elective</p>
        <form >
          <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
          <label>
            First Name:
            <input
              className="ml-2 mt-3 w-40 max-[850px]:ml-1 max-[850px]:mt-0"
              type="text"
              name="firstname"
              placeholder='First Name'
              id={'teacherId'}
              value={student_firstname}
              onChange={(e) => { setStudent_firstname(e.target.value) }}
            ></input>
          </label>

          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
            First Name:
            <input
              className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
              type="text"
              name="Fname"
              placeholder="Teacher's First Name"
              // value={formData.Fname}
              onChange={(e) => { 
                // setFname(e.target.value)
              }}
            ></input>
          </label>

          <label>
            Last Name:
            <input
              className="ml-2 mt-3 w-40 max-[850px]:ml-1 max-[850px]:mt-0"
              type="text"
              name="firstname"
              placeholder='Last Name'
              id={'teacherId'}
              value={student_lastname}
              onChange={(e) => {setStudent_lastname(e.target.value) }}
            ></input>
          </label>
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
         <label className='invisible max-[850px]:visible max-[850px]:hidden'>
            First Name:
            <input
              className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
              type="text"
              name="firstname"
              placeholder='First Name'
              id={'teacherId'}
              value={student_firstname}
              onChange={(e) => { setStudent_firstname(e.target.value) }}

            ></input>
          </label>
          


          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
            From:
            <input
              className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
              type="date"
              name="from"
              // value={formData.from}
              // onChange={handleChange}
            ></input>
          </label>

          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
           Last Name:
            <input
              className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
              type="text"
              name="lastname"
              placeholder="Last Name"
              id={'teacherId'}
              value={student_lastname}
              onChange={(e) => {setStudent_lastname(e.target.value) }}
            ></input>
          </label>
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}
     
        <label className=' max-[850px]'>
            Course ID:
            <input
              className="ml-3 w-40 max-[850px]:ml-2"
              type="text"
              name="course-id"
              placeholder='Enter Course ID'
              value={course_id}
              onChange={(e) => { 
                setCourseid(e.target.value)
              }}
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
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
              type="button"
              onClick={handleElective}
            >
              Search
            </button>
            <button
              className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
              type="button"
              onClick={handleShowAll}
            >
              Show All
            </button>
          </div>
        </div>
          <ElectiveCourseList users={users} setUsers={setUsers} />
        </form>
      </>) : redirect()}
    </>
  );
}
ElectiveCourse.auth = true;
ElectiveCourse.adminOnly = true;
