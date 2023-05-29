import { useSession } from 'next-auth/react';
import Head from 'next/head';
import CourseSchedule from '../../components/Dashboard/Schedule/CourseSchedule';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Schedule() {
  const { data: session } = useSession();
  const router = useRouter()

  const redirect = () => { 
    router.push('/AccessDenied')
  }
  
  return (
    <>
      <Head>
        <title>SIS - Schedule</title>
      </Head>

      { session?.user.role === '1' ? ( <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Schedule</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>
          <CourseSchedule />
        </div>
      </>) : redirect()}
    </>
  );
}
Schedule.auth = true;
Schedule.adminOnly = true;
