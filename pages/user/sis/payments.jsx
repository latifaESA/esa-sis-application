import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Payments() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>SIS - Payments</title>
      </Head>

      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Payments</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Payments Table</div>
      </>
    </>
  );
}
Payments.auth = true;
Payments.adminOnly = true;
