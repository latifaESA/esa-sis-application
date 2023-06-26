import Head from 'next/head';
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { appIsWaiting } from '../../redux/slices/appSlice';
import TeachersCourseList from '../../components/Dashboard/AttendanceList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
import axios from 'axios';
// import CustomSelectBox from './customSelectBox';
export default function teacherCourse() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const router = useRouter();
  const redirect = () => {
    router.push('/AccessDenied');
  };

  const [teacher_firstname, setTeacherFirstName] = useState('');
  const [teacher_lastname, setTeacherLastName] = useState('');
  const [course_id, setCourseid] = useState('');
  const [courseX_id, setCourseX_id] = useState('');
  const [test, setTest] = useState();
  // console.log(session);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          teacher_firstname: '',
          teacher_lastname: '',
          courseId: '',
          courseXId: '',
        };
        const result = await axios.post(
          '/api/pmApi/filterTeacherCourse',
          payload
        );
        setUsers(result.data.data);
        setTest(true);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  const handleShowAll = async () => {
    try {
      const payload = {
        teacher_firstname: '',
        teacher_lastname: '',
        courseId: '',
        courseXId: '',
      };
      const result = await axios.post('api/pmApi/filterTeacherCourse', payload);
      setUsers(result.data.data);
      setTest(true);
    } catch (error) {
      return error;
    }
  };

  const handleAttendance = async () => {
    try {
      const payload = {
        courseId: course_id,
        courseXId: courseX_id,
        teacher_firstname: teacher_firstname,
        teacher_lastname: teacher_lastname,
      };
      const result = await axios.post(
        '/api/pmApi/filterTeacherCourse',
        payload
      );
      setUsers(result.data.data);
    } catch (error) {
      return error;
    }
  };

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
        <title>SIS Admin - Attendance</title>
      </Head>
      {session?.user.role === '2' ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
            Attendance
          </p>
          <form>
            <div className="grid grid-cols-1 gap-3 min-[850px]:grid-cols-3 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <div>
                <label className="w-[350px]">
                  Teacher firstname:
                  <input
                    className="ml-5 w-40 max-[850px]:ml-3"
                    type="text"
                    name="teacher_id"
                    placeholder="Teacher LastName"
                    id={'teacherId'}
                    value={teacher_firstname}
                    onChange={(e) => {
                      setTeacherFirstName(e.target.value);
                    }}
                  ></input>
                </label>
              </div>

              <div>
                <label className="w-[350px]">
                  Teacher lastname:
                  <input
                    className="ml-5 w-40 max-[850px]:ml-3"
                    type="text"
                    name="teacher_id"
                    placeholder="Teacher FirstName"
                    id={'teacherId'}
                    value={teacher_lastname}
                    onChange={(e) => {
                      setTeacherLastName(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
              <div>
                <label className="w-[350px]">
                  course ID:
                  <input
                    className="ml-5 w-40 max-[850px]:ml-3"
                    type="text"
                    name="from"
                    id={'text'}
                    placeholder="Course ID"
                    value={course_id}
                    onChange={(e) => {
                      setCourseid(e.target.value),
                        setCourseX_id(e.target.value);
                    }}
                  ></input>
                </label>
              </div>

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
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
            </div>
            <TeachersCourseList users={users} setUsers={setUsers} />
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
teacherCourse.auth = true;
teacherCourse.adminOnly = true;
