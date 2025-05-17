import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Calendar from '../../components/Dashboard/Schedule/calendar';

export default function CalendarById() {
  const { data: session } = useSession();
  const router = useRouter();

  const redirect = () => {
    router.push('/AccessDenied');
  };

  return (
    <>
      <Head>
        <title>SIS - Schedule</title>
      </Head>

      {session?.user?.role === '1' ? (
        <div className="max-w-screen-md p-4">
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold text-primary">
            Schedule
          </p>
          <div>
            <Calendar />
          </div>
        </div>
      ) : (
        redirect()
      )}
    </>
  );
}

CalendarById.auth = true;
CalendarById.adminOnly = true;
