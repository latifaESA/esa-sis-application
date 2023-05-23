import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Report() {
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
        <title>SIS Admin - Report</title>
      </Head>

     {admin &&  <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Report</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Report Table</div>
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
Report.auth = true;
Report.adminOnly = true;
