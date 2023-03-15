// import ListUsersDetail from '../../components/Admin/ListUsersDetail';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SearchCourse from '../../../components/Dashboard/Courses/SearchCourse';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
import { appIsWaiting } from '../../../redux/slices/appSlice';
// import { Home } from '../../components/GOToHome';

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>SIS - Main Board</title>
      </Head>
      <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>SIS Main</p>

      {/* <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded bg-white h-20 shadow-sm">Notifications</div>
        <div className="rounded bg-white h-20 shadow-sm">Messages</div>
      </div> */}
      <div className='grid lg:grid-cols-1 gap-5 mb-5'>
        <SearchCourse />
      </div>
    </>
  );
}
Main.auth = true;
Main.adminOnly = true;
