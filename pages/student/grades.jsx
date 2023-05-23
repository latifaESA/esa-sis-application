import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function Grades() {

  
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
        <title>SIS - Grades</title>
      </Head>
      <>
        { std &&<p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Grades</p>}

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
    </>
  );
}
Grades.auth = true;
Grades.adminOnly = true;
