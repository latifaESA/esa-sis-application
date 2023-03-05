import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import AccountMain from '../../../components/Admin/Account/AccountMain';

export default function Account() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard - Account</title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Account</p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <AccountMain />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
Account.auth = true;
Account.adminOnly = true;
