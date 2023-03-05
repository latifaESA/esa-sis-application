import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../components/Admin/accessDenied/AccessDenied';
import { SearchArchive } from '../../components/Admin/Archive/SearchArchive';

export default function Archive() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - Archive</title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Archive</p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <SearchArchive />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
Archive.auth = true;
Archive.adminOnly = true;
