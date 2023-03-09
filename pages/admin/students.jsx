import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Students() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>SIS Admin - Students</title>
      </Head>
      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Students</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Students table</div>
      </>
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
