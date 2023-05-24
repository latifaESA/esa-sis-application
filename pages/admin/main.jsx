// import ListUsersDetail from '../../components/Admin/ListUsersDetail';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
import { appIsWaiting } from '../../redux/slices/appSlice';
// import { Home } from '../../components/GOToHome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: session } = useSession();
  const router = useRouter()

  let admin
  let notAdmin 
  console.log(session?.user.role)
    if(session?.user.role == '0'){
      admin = true
      notAdmin = false
    }else {
      admin = false
      notAdmin = true
    }
    if(notAdmin){ 
      setTimeout(() => { 
        router.push('/')
      }, 3000)
    }
  
  return (
    <>
      <Head>
        <title>SIS Admin - Main Board</title>
      </Head>
      {admin && <>
      <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Admin SIS</p>

      {/* <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded bg-white h-20 shadow-sm">Notifications</div>
        <div className="rounded bg-white h-20 shadow-sm">Messages</div>
      </div> */}
      <div className='grid lg:grid-cols-1 gap-5 mb-5'>
        {/* <ListUsersDetail /> */}
        Admin Main View
      </div>
      {/* <div className="grid lg:grid-cols-1 gap-5 mb-5">
        <div className="grid col-1 bg-white h-96 shadow-sm">Candidate List</div>
      </div> */}
      {/* <div className='grid lg:grid-cols-1 bg-white p-5 shadow-sm'>
        <LowerButtons />
      </div> */}
      </>}
      {
        notAdmin && <div className='text-center text-red-500'>
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
Main.auth = true;
Main.adminOnly = true;
