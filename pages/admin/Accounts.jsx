import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Accounts() {
  const { data: session } = useSession();

  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };

  return (
    <>
      <Head>
        <title>SIS Admin - Accounts</title>
      </Head>

      {session?.user.role === "0" ? (
        <>
          <h2 className="text-gray-700 text-3xl pt-5  font-bold">Accounts</h2>
          <div className="flex gap-10 ml-[30%] max-[850px]:flex-col max-[850px]:mt-32 max-[850px]:ml-0  h-[30vh] place-items-center">
            <Link href="/admin/createAccount">
              <div className="  ">
                <button className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold">
                  Create a new Account
                </button>
              </div>
            </Link>
            <Link href="/admin/create">
              <div className=" ">
                <button className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold">
                  View and Edit Accounts
                </button>
              </div>
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