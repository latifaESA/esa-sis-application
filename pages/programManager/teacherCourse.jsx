import Head from "next/head";
// import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
// import { appIsWaiting } from '../../redux/slices/appSlice';

import TeachersCourseList from "../../components/Dashboard/TeachersCourseList";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import Link from 'next/link';
import axios from "axios";

// import CustomSelectBox from "./customSelectBox";
export default function TeacherCourse() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const router = useRouter();
  const redirect = () => {
    router.push("/AccessDenied");
  };
  const [teacher_id, setTeacherId] = useState("");
  const [teacher_firstname, setTeacherFirstName] = useState("");
  const [teacher_lastname, setTeacherLastName] = useState("");
  const [course_id, setCourseid] = useState("");
  const [course_name, setCourseName] = useState("");

  // console.log(session)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          teacherId: "",
          courseId: "",
          teacher_firstname: "",
          teacher_lastname: "",
          course_name: "",
          major_id: session.user.majorid,
        };
        const result = await axios.post(
          "/api/pmApi/filterTeacherCourse",
          payload
        );
        // // console.log(result.data.data)
        setUsers(result.data.data);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  const handleShowAll = async () => {
    try {
      const payload = {
        teacherId: "",
        courseId: "",
        teacher_firstname: "",
        teacher_lastname: "",
        course_name: "",
        major_id: session.user.majorid,
      };
      const result = await axios.post(
        "/api/pmApi/filterTeacherCourse",
        payload
      );
      setUsers(result.data.data);
      setTeacherId("");
      setCourseName("");
      setCourseid("");
      setTeacherFirstName("");
      setTeacherLastName("");
    } catch (error) {
      return error;
    }
  };

  const handleSearch = async () => {
    try {
      const payload = {
        teacherId: teacher_id,
        courseId: course_id,
        teacher_firstname: teacher_firstname,
        teacher_lastname: teacher_lastname,
        course_name: course_name,
        major_id: session.user.majorid,
      };
      const result = await axios.post(
        "/api/pmApi/filterTeacherCourse",
        payload
      );
      setUsers(result.data.data);
    } catch (error) {
      return error;
    }
  };

  // const handleMajor = (selectedValue) => {
  //   // Do something with the selected value
  //   // console.log("Selected Value:", selectedValue);
  //   if(test){
  //     selectedValue == ''
  //   }
  //   if(selectedValue.trim() !== ''){
  //   let majorID = allMajor.filter(major => major.major_name === selectedValue);
  //   // console.log(majorID[0].major_id)
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
        <title>SIS Admin - assigned</title>
      </Head>
      {session?.user.role === "2" || session?.user.role === "3"? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Assign</p>
          <form>
            {/* <div className="grid grid-cols-1 gap-3 min-[850px]:grid-cols-3 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">

                        <div>
                            <label className='w-[350px]'>
                                Teacher firstname:
                                <input
                                    className="ml-5 w-40 max-[850px]:ml-3"
                                    type="text"
                                    name="teacher_id"
                                    placeholder='Teacher LastName'
                                    id={'teacherId'}
                                    value={teacher_firstname}
                                    onChange={(e) => { setTeacherFirstName(e.target.value) }}
                                ></input>
                            </label>

                        </div>

                        <div>
                            <label className='w-[350px]'>
                                Teacher lastname:
                                <input
                                    className="ml-5 w-40 max-[850px]:ml-4"
                                    type="text"
                                    name="teacher_id"
                                    placeholder='Teacher FirstName'
                                    id={'teacherId'}
                                    value={teacher_lastname}
                                    onChange={(e) => { setTeacherLastName(e.target.value) }}
                                ></input>
                            </label>

                        </div>
                        <div>
                            <label className='w-[350px]'>
                                course ID:
                                <input
                                    className="ml-7 w-40 max-[850px]:ml-4"
                                    type="text"
                                    name="from"
                                    id={'text'}
                                    placeholder='Course ID'
                                    value={course_id}
                                    onChange={(e) => { setCourseid(e.target.value)}}
                                ></input>
                            </label>
                        </div>

                        <div className="flex flex-col  min-[850px]:flex-row gap-4">
                            <button
                                className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                                type="button"
                                onClick={handleSearch}
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
                    </div> */}
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label className="w-[350px]">
                Teacher firstname:
                <input
                  className="ml-5 w-40 max-[850px]:ml-3"
                  type="text"
                  name="teacher_id"
                  placeholder="Teacher FirstName"
                  id={"teacherId"}
                  value={teacher_firstname}
                  onChange={(e) => {
                    setTeacherFirstName(e.target.value);
                  }}
                ></input>
              </label>

              <label className="w-[350px]">
                Teacher lastname:
                <input
                  className="ml-5 w-40 max-[850px]:ml-3"
                  type="text"
                  name="teacher_id"
                  placeholder="Teacher LastName"
                  id={"teacherId"}
                  value={teacher_lastname}
                  onChange={(e) => {
                    setTeacherLastName(e.target.value);
                  }}
                ></input>
              </label>
              <label className="w-[350px]">
                Course ID:
                <input
                  className="ml-5 w-40 max-[850px]:ml-8 "
                  type="text"
                  name="courseId"
                  placeholder="Course ID"
                  id={"courseId"}
                  value={course_id}
                  onChange={(e) => {
                    setCourseid(e.target.value);
                  }}
                ></input>
              </label>

              {/* <label className='w-[350px]'>
                            course ID:
                            <input
                                 className="ml-5 w-40 max-[850px]:ml-4 "
                                type="text"
                                name="from"
                                id={'text'}
                                placeholder='Course ID'
                                value={course_id}
                                onChange={(e) => { setCourseid(e.target.value) }}
                            ></input>

                        </label> */}
              <label className="w-[350px] invisible max-[850px]:visible max-[850px]:hidden">
                Teacher firstname:
                <input
                  className="ml-5 w-40 max-[850px]:visible max-[850px]:hidden"
                  type="text"
                  name="teacher_id"
                  placeholder="Teacher FirstName"
                  id={"teacherId"}
                  value={teacher_firstname}
                  onChange={(e) => {
                    setTeacherFirstName(e.target.value);
                  }}
                ></input>
              </label>

              <label className="w-[350px] invisible max-[850px]:visible max-[850px]:hidden">
                Teacher lastname:
                <input
                  className="ml-5 w-40 max-[850px]:visible max-[850px]:hidden"
                  type="text"
                  name="teacher_id"
                  placeholder="Teacher LastName"
                  id={"teacherId"}
                  value={teacher_lastname}
                  onChange={(e) => {
                    setTeacherLastName(e.target.value);
                  }}
                ></input>
              </label>

              <div className="flex flex-col justify-end min-[850px]:flex-row gap-4">
                <button
                  className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                  type="button"
                  onClick={handleSearch}
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

            <TeachersCourseList users={users} setUsers={setUsers} />
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
TeacherCourse.auth = true;
TeacherCourse.adminOnly = true;
