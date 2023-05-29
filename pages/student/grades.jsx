import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function Grades() {

  
  const { data: session } = useSession();
  const router = useRouter()
  const redirect = () => { 
    router.push('/AccessDenied')
  }
    
  return (
    <>
      <Head>
        <title>SIS - Grades</title>
      </Head>
      <>
      {session?.user.role === '1' ? ( <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Grades</p>) : redirect()}
      </>
    </>
  );
}
Grades.auth = true;
Grades.adminOnly = true;
