import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Archive() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - Grades</title>
      </Head>
      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Grades</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Grades table</div>
      </>
    </>
  );
}
Archive.auth = true;
Archive.adminOnly = true;
