import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Report() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>SIS Program Manager - Report</title>
      </Head>

      <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Report</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Report Table</div>
      </>
    </>
  );
}
Report.auth = true;
Report.adminOnly = true;
