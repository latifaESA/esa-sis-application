import Head from 'next/head';
import ProfileScreen from '../../../components/Dashboard/profile';

export default function Profile() {
  return (
    <>
      <Head>
        <title>SIS - Profile Page</title>
      </Head>

      <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>
        Edit Profile
      </p>

      <div className='grid lg:grid-cols-1 gap-5 mb-5'>
        <ProfileScreen />
      </div>
    </>
  );
}
Profile.auth = true;
Profile.adminOnly = true;
