import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import CreateAccount from '../../../components/Admin/Account/CreateAccount';

export default function CreateNewAccount() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard Account - Create Account </title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
            Create New Account
          </p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <CreateAccount />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
CreateNewAccount.auth = true;
CreateNewAccount.adminOnly = true;
