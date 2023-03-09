import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Grades() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>SIS - Grades</title>
      </Head>
      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Grades</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Grades table</div>
      </>
    </>
  );
}
Grades.auth = true;
Grades.adminOnly = true;
