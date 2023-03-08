import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Account() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - Account</title>
      </Head>

      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Schedule</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Schedule Table</div>
      </>
    </>
  );
}
Account.auth = true;
Account.adminOnly = true;
