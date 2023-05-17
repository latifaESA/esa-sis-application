// import ListUsersDetail from '../../components/Admin/ListUsersDetail';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchCourse from '../../../components/Dashboard/Courses/SearchCourse';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
import { appIsWaiting } from '../../../redux/slices/appSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';
// import { Home } from '../../components/GOToHome';
import https from 'https';
import StudentBlue from '../../../components/Dashboard/DashboardComps/StudentBlueView/StudentBlue';
export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: session } = useSession();

  // console.log(session?.user.status)
 
  const [limited, setlimited] = useState()

    
    useEffect(() => {
      if(session?.user.status == 'limited'){
        setlimited(true)
    }
    }, []);

  console.log(limited)
  return (
    <>
      <Head>
        <title>SIS - Main Board</title>
      </Head>
      <div className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
        {/* if status is limited display studentBlue */}
        {
          // limited &&
          <StudentBlue />
          
          }

      </div>

      {/* <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded bg-white h-20 shadow-sm">Notifications</div>
        <div className="rounded bg-white h-20 shadow-sm">Messages</div>
      </div> */}
      {/* <div className='grid lg:grid-cols-1 gap-5 mb-5'>
        <SearchCourse />
      </div> */}
    </>
  );
}
Main.auth = true;
Main.adminOnly = true;
