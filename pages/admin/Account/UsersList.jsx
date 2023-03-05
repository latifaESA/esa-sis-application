import { useSession } from 'next-auth/react';
import Head from 'next/head';
import AccessDenied from '../../../components/Admin/accessDenied/AccessDenied';
import UserListTable from '../../../components/Admin/Account/UserListTable';

export default function UsersList() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard Account - Users List </title>
      </Head>
      {session?.user.role === '0' ? (
        <>
          <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
            Users List
          </p>

          <div className='grid lg:grid-cols-1 gap-5 mb-5'>
            <UserListTable />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
UsersList.auth = true;
UsersList.adminOnly = true;
