import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import { SearchInfo } from '../../../components/Admin/Logs/Info/Info';

export default function InfoPage() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard Logs - Info</title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
            Logs Info
          </p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <SearchInfo />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
InfoPage.auth = true;
InfoPage.adminOnly = true;
