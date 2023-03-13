import { useSession } from 'next-auth/react';
import Head from 'next/head';
import CourseSchedule from '../../../components/Dashboard/Schedule/CourseSchedule';

export default function Schedule() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>SIS - Schedule</title>
      </Head>

      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
          Schedule Table
        </p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>
          <CourseSchedule />
        </div>
      </>
    </>
  );
}
Schedule.auth = true;
Schedule.adminOnly = true;
