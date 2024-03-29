import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { appIsWaiting } from "../../redux/slices/appSlice";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import StudentRequests from "../../components/StudentRequests";
// import MoodleSvg from "../../components/moodleSvg";
import SurveyContent from "../../components/SurveyContent";
export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: session } = useSession();

  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };

  return (
    <>
      <Head>
        <title>SIS - Surveys</title>
      </Head>

      {session?.user.role === "1" ? (
        <div className="max-w-screen p-4 ">
          {/* <h1 className="text-3xl font-semibold text-center mb-4">Request Transcript</h1> */}
          <p className=" text-3xl pt-5 mb-10 font-bold text-primary">Surveys</p>
          <SurveyContent />
        </div>
      ) : (
        redirect()
      )}
    </>
  );
}
Main.auth = true;
Main.adminOnly = true;
