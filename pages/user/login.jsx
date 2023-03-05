// import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getError } from '../../utilities/error';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Register from '../user/register';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  loginFailed,
  loginRequest,
  loginSuccess,
  logoutSuccess,
  isLogout,
} from '../../redux/slices/userSlice';
import { appIsWaiting } from '../../redux/slices/appSlice';
import encrypt from '../../utilities/encrypt_decrypt/encryptText';
import axios from 'axios';
import selection_data from '../../utilities/selection_data';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Transition } from '@headlessui/react';
// import decrypt from '../../utilities/encrypt_decrypt/decryptText';
// import { appSetting } from '../../redux/slices/appSlice';
// import { useUserStore } from '../../context/userContext';

export default function LoginScreen() {
  const [errorMessage, setErrorMessage] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [showReg, setShowReg] = useState(false);

  const showRegHandler = () => {
    setShowReg(!showReg);
  };

  const dispatch = useDispatch();

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const userState = useSelector(
    (state) => state.persistedReducer.user_state.userState
  );

  // useEffect(() => {
  //   setErrorMessage('');
  //   dispatch(appIsWaiting(false));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/controller/settingdata', {
  //         timeout: selection_data.axios_timeout,
  //       });

  //       if (response.status === 200) {
  //         const incomingData = JSON.parse(decrypt(response.data.data));
  //         dispatch(
  //           appSetting({
  //             auto_Save_Timing:
  //               incomingData.setting[0].auto_Save_Timing * 60 * 1000,
  //             disapearing_Message_Time:
  //               incomingData.setting[0].message_disapear_timing * 1000,
  //             max_characters_count:
  //               incomingData.setting[0].max_characters_count,
  //             education_Year_of_Acquisition_Limit:
  //               incomingData.setting[0].Year_of_Acquisition_Limit,
  //             personalinfo_dob_min:
  //               incomingData.setting[0].personalinfo_dob_min.split('T')[0],
  //             personalinfo_dob_max:
  //               incomingData.setting[0].personalinfo_dob_max.split('T')[0],
  //             upload_file_single_size:
  //               incomingData.setting[0].upload_file_single_size * 1024 * 1024,
  //             upload_file_total_size:
  //               incomingData.setting[0].upload_file_total_size * 1024 * 1024,
  //             logger_expiry_day:
  //               incomingData.setting[0].logger_expiry_day + 'd',
  //             logger_max_file_size:
  //               incomingData.setting[0].logger_max_file_size + 'm',
  //             upload_file_directory_name:
  //               incomingData.setting[0].upload_file_directory_name,
  //             carouselList: incomingData.setting[0].carouselList,
  //             esa_logo: incomingData.setting[0].esa_logo,
  //             login_bg: incomingData.setting[0].login_bg,
  //             MBA_recommendation_letter:
  //               incomingData.setting[0].MBA_recommendation_letter,
  //             EMBA_recommendation_letter:
  //               incomingData.setting[0].EMBA_recommendation_letter,
  //           })
  //         );
  //       } else {
  //         // localStorage.clear();
  //         sessionStorage.clear();
  //         const encryptedBody = encrypt(
  //           JSON.stringify({
  //             email: '---',
  //             role: '---',
  //             info: 'From login page,appVar cant be readed from DB',
  //             error: `${response.status}`,
  //           })
  //         );
  //         await axios.put('/api/logger/sendErrorToLogger', {
  //           data: encryptedBody,
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       // localStorage.clear();
  //       sessionStorage.clear();
  //       const encryptedBody = encrypt(
  //         JSON.stringify({
  //           email: '---',
  //           role: '---',
  //           info: 'From login page,appVar cant be fetched from DB; sessionStorage was cleared',
  //           error: `${error}`,
  //         })
  //       );
  //       await axios.put('/api/logger/sendErrorToLogger', {
  //         data: encryptedBody,
  //       });
  //     }
  //   };
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // console.log(session);
    if (session?.user && !userState.user.isLogOut) {
      session?.user.role === '1'
        ? router.push(redirect || selection_data.where_going_after_signin)
        : router.push(redirect || '/admin/dashboard');
    }
    // console.log('userState.user.isLogOut==', userState.user.isLogOut);
    if (!session?.user && !userState.user.isLogOut) {
      dispatch(logoutSuccess());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, session, redirect, userState.user.isLogOut]);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      setErrorMessage('');
      dispatch(loginRequest());
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result?.error) {
        const userSession = await getSession();
        // console.log('userSession==>', userSession);
        if (userSession) {
          dispatch(
            loginSuccess({
              name: userSession.user.name,
              _id: userSession.user._id,
              major: userSession.user.major,
              status: userSession.user.status,
              appisSaved:
                typeof userSession.user.appisSaved !== 'undefined'
                  ? userSession.user.appisSaved
                  : false,
              application_Language: userSession.user.application_Language,
              profileUrl: userSession.user.profileUrl,
            })
          );
          dispatch(isLogout(false));
        }
      } else {
        dispatch(loginFailed(result.error));
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage(getError(err));
      const encryptedBody = encrypt(
        JSON.stringify({
          email: email,
          role: '---',
          info: 'From login page, unable to reach signIn',
          error: `${getError(err)}`,
        })
      );
      await axios.put('/api/logger/sendErrorToLogger', {
        data: encryptedBody,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login / Register</title>
      </Head>

      <div className="border-solid rounded-xl  mt-5 bg-loginbg bg-no-repeat bg-cover bg-center text-white p-5">
        {showReg === false && (
          <Transition
            as="div"
            appear={true}
            show={true}
            enter="transition-all duration-500"
            enterFrom="transform translate-y-full"
            enterTo="transform translate-x-0"
            leave="transition-all duration-300"
            leaveFrom="transform translate-x-0"
            leaveTo="transform translate-x-full"
          >
            <div className="mx-auto max-w-screen-md p-5 ">
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="border-2 rounded-lg p-8 font-bold "
              >
                <h1 className="mb-4 text-3xl  text-center">
                  Input your Email and Password
                </h1>
                {errors && (
                  <div className="text-red-500 text-xl font-bold w-full text-center mt-4 mb-4">
                    {errorMessage}
                  </div>
                )}
                <div className="mb-4   ">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Please Enter Email',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Please Enter Valid Email',
                      },
                    })}
                    className="w-full bg-transparent"
                    id="lemail"
                  />
                  {errors.email && (
                    <div className="text-red-500 w-full ml-2">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="mb-4 relative">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword === false ? 'password' : 'text'}
                    {...register('password', {
                      required: 'Please enter password',
                      minLength: {
                        value: 7,
                        message: 'password is more than 6 chars',
                      },
                    })}
                    className="w-full bg-transparent"
                    id="lpassword"
                    // autoFocus
                  />
                  <div className="absolute top-8 right-5 cursor-pointer">
                    {showPassword === false ? (
                      <VisibilityOffIcon
                        fontSize="small"
                        onClick={showPasswordHandler}
                      />
                    ) : (
                      <VisibilityIcon
                        fontSize="small"
                        onClick={showPasswordHandler}
                      />
                    )}
                  </div>

                  {errors.password && (
                    <div className="text-red-500 w-full ml-2">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Link href="/user/password/forgetpassword" legacyBehavior>
                    <label className="underline hover:text-red-500 hover:font-bold cursor-pointer">
                      Forget Password?
                    </label>
                  </Link>
                  <button className="primary-button  float-right hover:text-white hover:font-bold ">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        )}

        <div className="flex justify-center">
          {showReg === false ? (
            <div
              onClick={showRegHandler}
              className={`text-xl font-bold italic cursor-pointer hover:text-red-500`}
            >
              Don`t Have an Account? Signup Here!
              <DownloadIcon />
            </div>
          ) : (
            <div
              onClick={showRegHandler}
              className={`text-xl font-bold italic cursor-pointer hover:text-red-500`}
            >
              Already have an Account? Log in Here!
              <FileUploadIcon />
            </div>
          )}
        </div>
        {showReg === true && (
          <Transition
            as="div"
            appear={true}
            show={true}
            enter="transition-all duration-700"
            enterFrom="transform -translate-y-full"
            enterTo="transform -translate-y-0"
            leave="transition-all duration-300"
            leaveFrom="transform translate-y-0"
            leaveTo="transform translate-x-full"
          >
            {/* <Register /> */}
          </Transition>
        )}
      </div>
    </>
  );
}
