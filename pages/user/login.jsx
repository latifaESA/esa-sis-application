// import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getError } from '../../utilities/error';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import esaBuilding from '../../public/images/ESA-building.png'
import esaLogo from '../../public/images/esa.png'
import {
  loginFailed,
  loginRequest,
  loginSuccess,
  logoutSuccess,
  isLogout,
} from '../../redux/slices/userSlice';
import encrypt from '../../utilities/encrypt_decrypt/encryptText';
import axios from 'axios';
// import selection_data from '../../utilities/selection_data';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import Image from 'next/image';


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



  useEffect(() => {
    // console.log(session);
    if (session?.user && !userState.user.isLogOut) {
      session?.user.role === '1'
        ? router.push(redirect || '/user/sis/main')
        : router.push(redirect || '/programManager/main');
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
      setErrorMessage("");
      dispatch(loginRequest());
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log(result);
      // temporary commented
      if (!result?.error) {
        const userSession = await getSession();
        console.log('userSession==>', userSession);
        if (userSession) {
          dispatch(
            loginSuccess({
              name: userSession.user.name,
              email: userSession.user.email,
              role: userSession.user.role,
            })
          );
          console.log(userSession)
          dispatch(isLogout(false));
        }
      } else {
        console.log(result.error)
        dispatch(loginFailed(result.error));
        setErrorMessage(result.error);
      }
    } catch (err) {
console.log(err)
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
      <div className='bg-[#F7F7F7] mt-11  h-screen'>


      <div className='flex justify-center   text-black'>
        <div className='imageRes lg:visible invisible'>
            <Image src={esaBuilding} alt='Esa-Building' width={457} height={680} />
        </div>
        <div className='bg-white pr-11 sm:pl-11'>
            <div className='log flex pr-11 '>
                <Image src={esaLogo} width={81} className='esaLogo' alt='Logo' height={151} />
                <div className='leading-7 welcometoSis mt-4 ml-5'>
                    <p className='welcomeTo mt-11'>WELCOME TO</p>
                <span className='SIS'>SIS</span>
                </div>
                
            </div>
                <div className='text-center mt-11 login text-[#3D709A] text-[39px] bold'>
                    Login
                </div>
                <div>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div>
                       

                  {errors.email && (
                    <div data-testid='errorEmail' className='text-red-500 error text-center w-full ml-2'>
                      {errors.email.message}
                    </div>
                  )}
                  {!errors.email && errors.password && (
                    <div data-testid='errorPassword' className='text-red-500 error w-full text-center'>
                      {errors.password.message}
                    </div>
                  )}
                  {errors && (
                <div data-testid='error' className='text-red-500 error text-center w-full mt-4 mb-4'>
                  {errorMessage}
                </div>
              )}
                             <div className='formDiv mt-9'>
                            <label className='text-[#707070] text-[18px]' htmlFor="username">Username</label><br />
                            <input className='bg-white inputT ml-2' type="text" data-testid='username'
                             {...register('email', {
                                required: 'Please Enter Email',
                                // pattern: {
                                //   value: /\S+@\S+\.\S+/,
                                //   message: 'Please Enter Valid Email',
                                // },
                              })}
                            />
                        </div>
                        <div className='formDiv mt-3'>
                            <label className='text-[#707070] text-[18px]' htmlFor="password">Password</label><br />
                            <input className='bg-white inputT focus:outline-none  ml-2' type="password" data-testid='password'
                             {...register('password', {
                                required: 'Please enter password',
                                minLength: {
                                  value: 7,
                                  message: 'password is more than 6 chars',
                                },
                              })}
                            />
                        </div>
                        <Link href='/user/password/forgetpassword' legacyBehavior>
                        <p className='text-[10px] tracking-normal ml-11 text-[#707070] cursor-pointer mt-1 text-center '>
                            Forgot your Password?
                        </p>
                          </Link>
                        </div>
                       <div className='text-center ml-11 mt-11'>
                        <button className='text-white btn bg-[#3D709A] rounded-3xl p-3' data-testid='btn'>
                            Log in
                        </button>
                       </div>
                    </form>
                </div>
            <div>
                
            </div>
        </div>
      </div>


      </div>
  
     
    </>
  );
}

LoginScreen.getLayout = function(page){ 
    return (<>
    {page}
    </>)
}
