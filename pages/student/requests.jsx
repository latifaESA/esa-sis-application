import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { useEffect } from "react";
// import axios from "axios";

export default function Accounts() {
  const { data: session } = useSession();

  const router = useRouter();

  const redirect = () => {
    router.push('/AccessDenied');
  };

  return (
    <>
      <Head>
        <title>SIS Admin - Requests</title>
      </Head>

      {session?.user.role === '1' ? (
        <>
          <h2 className="text-gray-700 text-3xl p-6 font-bold">Requests</h2>
          <div className="flex flex-wrap justify-center mt-5">
            <Link href="/student/request" className="m-2">
              <button className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold">
                Transcript
              </button>
            </Link>
            <Link href="#" className="m-2">
              <button className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold">
                Visa
              </button>
            </Link>
          </div>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Accounts.auth = true;
Accounts.adminOnly = true;
