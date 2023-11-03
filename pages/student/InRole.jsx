import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { appIsWaiting } from "../../redux/slices/appSlice";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Role from "../../components/Role";

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
  }, []);
  const { data: session } = useSession();


  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };

  return (
    <>

      <Head>
        <title>SIS - Role</title>
      </Head>
      
        {session?.user.role === "1" ? (
          <div className="max-w-screen-md p-4">
            <h1 className="text-3xl font-semibold mb-4">Certificates</h1>
            <div>
              <Role />
            </div>
          
          </div>
        ) : (
          redirect()
        )}
   
    </>
  );
}
Main.auth = true;
Main.adminOnly = true;
