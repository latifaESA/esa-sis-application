// import ListUsersDetail from '../../components/Admin/ListUsersDetail';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchCourse from '../../components/Dashboard/Courses/SearchCourse';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
import { appIsWaiting } from '../../redux/slices/appSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import { Home } from '../../components/GOToHome';
import https from 'https';
import StudentBlue from '../../components/Dashboard/DashboardComps/StudentBlueView/StudentBlue';
import Link from 'next/link';
export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: session } = useSession();

  // console.log(session?.user.status)
 
  const [limited, setlimited] = useState()

  let std
  let notStd 
  console.log(session?.user.role)
    if(session?.user.role == 1){
       std = true
       notStd = false
    }else {
      std = false
      notStd = true
    }

    const router = useRouter()

    if(notStd){ 
      setTimeout(() => { 
        router.push('/')
      }, 3000)
    }
    
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
     {std && <div className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
        {/* if status is limited display studentBlue */}
        {
          // limited &&
          <StudentBlue />
          
          }

      </div>}
      {
        notStd && <div className='text-center text-red-500'>
          user unauthenticated or in wrong section you will be redirected soon
          <Link href='/' legacyBehavior>
          <p className='underline cursor-pointer hover:text-blue-800'>
            Click Here To Return Back To Home Page
          </p>
        </Link>
        </div>
      }

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
