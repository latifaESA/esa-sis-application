import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import Link from 'next/link';


export default function Schedule() {
  const { data: session } = useSession();
  const router = useRouter()

  const redirect = () => { 
    router.push('/AccessDenied')
  }

  return (
    <>
      <Head>
        <title>SIS Admin - Schedule</title>
      </Head>

      {session?.user.role === '2' ? ( <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Schedule</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Schedule Table</div>
      </>): redirect()}
    </>
  );
}
Schedule.auth = true;
Schedule.adminOnly = true;
