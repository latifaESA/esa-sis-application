import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';

export default function Courses() {
  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );
  // console.log('appState.isWaiting==', appState.isWaiting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>SIS Admin - Attendance</title>
      </Head>
      <>
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
              // onChange={handleChange}
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
              // onChange={handleChange}
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
              // onChange={handleChange}
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
              // onChange={handleChange}
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
              // onChange={handleChange}
            ></input>
          </label>

          <label className='w-[350px]'>
            Presence:
            <select
              className="ml-5 w-40 max-[850px]:ml-[52px]"
              name="status"
              // value={formData.status}
              // onChange={handleChange}
            >
              <option value={null}>Choose Value...</option>
              <option value={true}>Present</option>
              <option value={false}>Absent</option>
            </select>
          </label>
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
              type="submit"
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
        {/* <StudentsList users={users} setUsers={setUsers} /> */}
      </form>
    </>
    </>
  );
}
Courses.auth = true;
Courses.adminOnly = true;
