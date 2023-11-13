import { useSession } from "next-auth/react";
import Head from "next/head";
// import Link from 'next/link';
import { useRouter } from "next/router";
import NotifPage from "../../components/notifPage";

export default function notification() {
  const { data: session } = useSession();
  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };
  return (
    <>
      <Head>
        <title>SIS - notification</title>
      </Head>

      <>
        {session?.user.role === "1" ? (
          <div>
            <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
              Notification
            </p>
            <div>
              <NotifPage />
            </div>
          </div>
        ) : (
          redirect()
        )}
      </>
    </>
  );
}
notification.auth = true;
notification.adminOnly = true;
