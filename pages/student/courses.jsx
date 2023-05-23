import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

  const { data: session } = useSession();
  const router = useRouter()

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
    if(notStd){ 
      setTimeout(() => { 
        router.push('/')
      }, 3000)
    }

  return (
    <>
      <Head>
        <title>SIS - Courses</title>
      </Head>

      { std && <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Courses</p>}

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
    </>
  );
}
Courses.auth = true;
Courses.adminOnly = true;
