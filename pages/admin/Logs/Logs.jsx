import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import Main from '../../../components/Admin/Logs/Main';

export default function Logs() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - Logs</title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Logs</p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <Main />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
Logs.auth = true;
Logs.adminOnly = true;
