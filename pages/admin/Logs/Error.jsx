import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import SearchError from '../../../components/Admin/Logs/Error/Error';

export default function Error() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard Logs - Errors</title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
            Logs Errors
          </p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <SearchError />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
Error.auth = true;
Error.adminOnly = true;
