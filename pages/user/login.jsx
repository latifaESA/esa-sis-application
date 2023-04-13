// import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getError } from '../../utilities/error';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import Register from '../user/register';
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
// import { appIsWaiting } from '../../redux/slices/appSlice';
import encrypt from '../../utilities/encrypt_decrypt/encryptText';
import axios from 'axios';
import selection_data from '../../utilities/selection_data';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import Image from 'next/image';
// import DownloadIcon from '@mui/icons-material/Download';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import { Transition } from '@headlessui/react';
// import decrypt from '../../utilities/encrypt_decrypt/decryptText';
// import { appSetting } from '../../redux/slices/appSlice';
// import { useUserStore } from '../../context/userContext';

export default function LoginScreen() {
  const [errorMessage, setErrorMessage] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  const [showPassword, setShowPassword] = useState(false);

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
        ? router.push(redirect || '/user/sis/main')
        : router.push(redirect || '/admin/main');
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
        <title>ESA SIS - Login</title>
      </Head>
      <div className=' bg-gray gray-scale-4 bg-cover w-full h-full bg-center top-0'>
        <div className='space-x-0 flex justify-center border-solid  p-8 fixed top-0 left-0 w-full h-full'>
        <div className='md:w-1/2 md:bg-loginbg max-w-md p-8 pt-4 pb-4 bg-gray-300 shadow-2xl opacity-90'>
          </div>
          <div className='w-1/2 max-w-md p-8 pt-4 pb-4 bg-white shadow-2xl  opacity-90'>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className='rounded-lg p-2 font-bold'
            >
              <div className='flex mb-8 w-full mr-8'>
                <Image
                  alt='logo'
                  src='/images/esa.png'
                  width={81}
                  height={151}
                  className='rounded-lg'
                />
              </div>
              {errors && (
                <div className='text-red-500 text-xl font-bold w-full mt-4 mb-4'>
                  {errorMessage}
                </div>
              )}
              
              <div className="flex absolute w-164 h-66 tracking-wider text-gray-700 opacity-100 top-16 right-17 ml-28 mt-10 ">
              <div className="flex flex-col ">
                <span className="font-normal text-2xl ">WELCOME TO </span>
                <span className="font-bold text-3xl mt-2 ">SIS</span>
              </div>
            </div>
            
            


             <div className="flex sm:justify-center  absolute top-485 left-1134 w-89 h-39 text-left font-medium text-3xl leading-10 tracking-normal text-blue-700 opacity-100 ml-32">
                 Login
             </div>

              <div className="relative top-28 left-1034 w-74 h-18 text-left font-normal leading-30 tracking-wider text-gray-700 opacity-100">
              Username
              </div>


              <div className='flex-col justify-center items-center  '>
                <div className='relative mb-8  top-16 mt-6 '>
                  {/* <div className='absolute inset-y-0 left-0 flex items-center pl-2 '> */}
                    {/* <Person2Icon
                      fontSize='large'
                      style={{ color: 'darkblue' }}
                    /> */}
                  {/* </div> */}
                 
                  <input
                    type='email'
                    placeholder='USER NAME'
                    {...register('email', {
                      required: 'Please Enter Email',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Please Enter Valid Email',
                      },
                    })}
                    className={`w-full px-3 py-2 appearance-none border border-gray-400 bg-white  mt-8 mb-2`}
                    id='lemail'
                    style={{ borderRadius: '9999px' }}
                  />
                   
                  {errors.email && (
                    <div className='text-red-500 w-full ml-2'>
                      {errors.email.message}
                    </div>
                    
                  )}
                  
                </div>

             
            
               
                <div className="relative top-28 mb-11  left-1034 w-74 h-18 text-left font-normal leading-30 tracking-wider text-gray-700 opacity-100">
              Password
              </div>

                <div className='relative mb-8  top-4'>
                  
                  {/* <div className='absolute inset-y-0 left-0 flex items-center pl-2'> */}
                    {/* <LockIcon fontSize='large' style={{ color: 'darkblue' }} /> */}
                  {/* </div> */}
                  <input
                    type={showPassword === false ? 'password' : 'text'}
                    className={`w-full px-3 py-2 appearance-none border border-gray-400 bg-white pb-8 mt-16 -mb-20`}
                    style={{ borderRadius: '9999px' }}
                    id='lpassword'
                    placeholder='PASSWORD'
                    {...register('password', {
                      required: 'Please enter password',
                      minLength: {
                        value: 7,
                        message: 'password is more than 6 chars',
                      },
                    })}
                  />
                  {/* <div className='absolute top-4 right-5 cursor-pointer'>
                    {showPassword === false ? (
                      <VisibilityOffIcon
                        fontSize='small'
                        onClick={showPasswordHandler}
                      />
                    ) : (
                      <VisibilityIcon
                        fontSize='small'
                        onClick={showPasswordHandler}
                      />
                    )}
                  </div> */}

                  {errors.password && (
                    <div className='text-red-500 w-full ml-2'>
                      {errors.password.message}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex relative mb-4 text-right sm:justify-end'>
                <Link href='/user/password/forgetpassword' legacyBehavior>
                  <label className='absolute top-718 left-32 ml-4 mt-4 w-90 h-10 text-left font-light text-xs leading-4 tracking-normal text-gray-700 opacity-100'>
                    Forget Password?
                  </label>
                </Link>
              </div>
              
              <div className=' relative flex justify-center items-center h-48 '>
                <button className='w-20 bg-blue-600 p-3 text-[18px] text-white hover:bg-gray-700 hover:font-bold rounded-full  mb-12 bottom-24">'>
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
