import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { appIsWaiting } from "../../redux/slices/appSlice";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import StudentRequests from "../../components/StudentRequests";

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
  }, []);
  const { data: session } = useSession();

  console.log(session?.user);
  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };

  return (
    <>
      <Head>
        <title>SIS - Request</title>
      </Head>
      {session?.user.role === "1" ? (
        <div className="mt-10">
          <h1 className="font-bold text-center text-3xl">Request Transcript</h1>
          <StudentRequests />
        </div>
      ) : (
        redirect()
      )}
    </>
  );
}
Main.auth = true;
Main.adminOnly = true;
