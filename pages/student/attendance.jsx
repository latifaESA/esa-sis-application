import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Link from 'next/link';
export default function Attendance() {
  // const appState = useSelector(
  //   (state) => state.persistedReducer.app_state.appState
  // );

  const { data: session } = useSession();
  const router = useRouter()

  const redirect = () => { 
    router.push('/AccessDenied')
  }

  // console.log('appState.isWaiting==', appState.isWaiting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Head>
        <title>SIS - Attendance</title>
      </Head>

     {session?.user.role === '1' ? ( 
     <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
        Attendance
     </p>) : redirect()}

    
    </>
  );
}
Attendance.auth = true;
Attendance.adminOnly = true;
