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
          <label>
            ID:
            <input
              className="ml-16 w-40"
              type="number"
              name="ID"
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
              // value={formData.Lname}
              // onChange={handleChange}
            ></input>
          </label>
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
          <label>
            Major:
            <select
              className="ml-10 w-40 max-[850px]:ml-9"
              name="major"
              // value={formData.major}
              // onChange={handleChange}
            >
              {/* {majorlist.map((major, index) => (
                <option className="text-black" key={index}>
                  {major.program}
                </option>
              ))} */}
            </select>
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
     
          <label>
            Promotion:
            <select
              className="ml-2 w-40 max-[850px]:ml-1"
              name="promotion"
              // value={formData.promotion}
              // onChange={handleChange}
            >
              {/* {promotionList.map((promotion, index) => (
                <option className="text-black" key={index}>
                  {promotion}
                </option>
              ))} */}
            </select>
          </label>

          <label>
            Status:
            <select
              className="ml-10 w-40 max-[850px]:ml-9"
              name="status"
              // value={formData.status}
              // onChange={handleChange}
            >
              {/* {statuelist.map((status, index) => (
                <option className="text-black" key={index}>
                  {status.status_name}
                </option>
              ))} */}
            </select>
          </label>
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button w-60 hover:text-white hover:font-bold"
              type="submit"
            >
              Search
            </button>
            <button
              className="primary-button  w-60 hover:text-white hover:font-bold"
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
