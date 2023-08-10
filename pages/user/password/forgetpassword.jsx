/*
Created By: Mohammad jaber
Page: Reset Password Page
Created at: 12/10/2022
*/
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordResetSchema } from "../../../Schemas";
import Head from "next/head";
import { useRouter } from "next/router";
import { getError } from "../../../utilities/error";
import axios from "axios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import EmailForResetPassword from "../../../utilities/emailing/emailForResetPassword";
// import selection_data from '../../../utilities/selection_data';
import { useSelector } from "react-redux";
const ForgetPassword = () => {
  // Edited By:KANSO ADI 11/12/2022
  // Very important to prevent the routing if loged inn and the user pass the url of this page
  /* Checking if the user is logged in or not. If the user is logged in, it will redirect him to the
  home page. */
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();
  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );

  const router = useRouter();
  const { redirect } = router.query;
  // // console.log('session?.user=>', session?.user);
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);
  /* A hook that is used to validate the form. */
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    resolver: yupResolver(passwordResetSchema),
  });

  // Edited By:KANSO ADI 11/12/2022
  const submitHandler = async ({ email }) => {
    try {
      const res = await axios.post("/api/user/password/forgetpassword", {
        email,
      });
      // console.log("=======res.data======");
      // // console.log(errorMessage)
      // console.log(res.data);
      const emailToken = res.data.emailToken;
      // const lname = res.data.lname;
      // const fname = res.data.fname;
      const ID = res.data.ID;
      // // console.log(emailToken)

      // console.log("before email");
      // console.log(router);
      await EmailForResetPassword({
        emailToken,
        ID,
        email,
        router,
      });
      // console.log("after email");
      // console.log("asd===asd===asd");
      // console.log(emailToken);
      // console.log(ID);
      // console.log(email);
    } catch (err) {
      // console.log(err);
      setErrorMessage(getError(err));
    }
  };

  return (
    <>
      {typeof session?.user === "undefined" ? (
        <>
          <Head>
            <title> Reset Account</title>
          </Head>
          <div className="flex-col text-center">
            <Image
              className="inline h-auto w-auto"
              src={appState.appVar.esa_logo}
              alt="logo"
              width={100}
              height={150}
            />
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="mt-2 mb-5 mx-auto max-w-screen-md flex-col bg-blue-800  rounded-lg p-8 text-center text-white"
          >
            <h1 className="mb-4 text-3xl font-bold">
              Forget Your Account Password?
            </h1>
            <h1 className="mb-4 text-xl">Please Enter Your Email Address.</h1>
            {errors && (
              <div className="text-red-500 text-xl font-bold w-full text-center mt-4 mb-4">
                {errorMessage}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className={
                  errors.email
                    ? "w-1/2 text-center text-xl text-black mb-3 mt-2 border-8 border-red-400"
                    : "w-1/2 text-center text-xl text-black mb-3 mt-2"
                }
                id="email"
                {...register("email", {
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 w-full font-bold">
                {errors.email.message}
              </span>
            )}
            <div className="mb-4 bt-4 mt-2">
              <button className="bg-blue-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700">
                Reset My Password
              </button>
            </div>
          </form>
        </>
      ) : (
        <> {/* FIXME: Jaber need circular progress */} </>
      )}
    </>
  );
};

export default ForgetPassword;
