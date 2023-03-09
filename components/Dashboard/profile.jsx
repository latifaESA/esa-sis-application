import React, { useEffect, useReducer } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { getError } from '../../utilities/error';
import axios from 'axios';
import Head from 'next/head';
import { useState } from 'react';
import uploadDocumentToCloud from '../../utilities/uploadToCloud/uploadDocumentToCloud';
import uploadDocReducer from '../../components/UploadDocuments/reducers/uploadDocReducer';
import DropZone from '../../components/UploadDocuments/DropZone';
import { ProfileModal } from '../../components/StudentInfoApplication/ModalDocument';
import { useDispatch, useSelector } from 'react-redux';
import {
  profileUrlChanged,
  userNameChanged,
} from '../../redux/slices/userSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const { data: session } = useSession();
  const [profileUrl, setProfileUrl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [updateProfileButtonDisable, setupdateProfileButtonDisable] =
    useState(false);
  const openProfileModal = () => setShowProfileModal(true);
  const closeModal = () => {
    setShowProfileModal(false);
  };
  const email = session.user.email;
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const userState = useSelector(
    (state) => state.persistedReducer.user_state.userState
  );

  //Profile
  const [uploadPhotoData, uploadPhotoDispatch] = useReducer(uploadDocReducer, {
    inDropZone: false,
    fileList: [],
    totalSize: 0,
  });
  useEffect(() => {
    setValue('fname', session.user.name.trim().split(/\s+/)[0]);
    setValue('lname', session.user.name.trim().split(/\s+/)[1]);
    setValue('password', null);
    setValue('confirmPassword', null);
    if (userState.user.appisSaved === false) {
      if (userState.user.profileUrl && userState.user.profileUrl !== ' ')
        setProfileUrl(userState.user.profileUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Profile
  useEffect(() => {
    if (uploadPhotoData.fileList.length !== 0) {
      setupdateProfileButtonDisable(true);
      const uploadProfiletUrl = async () => {
        const secure_url = await uploadDocumentToCloud(
          uploadPhotoData,
          session,
          true
        );
        if (secure_url) setProfileUrl(secure_url);
        if (typeof secure_url !== 'undefined') {
          dispatch(profileUrlChanged(secure_url));
        }
        setupdateProfileButtonDisable(false);
      };
      uploadProfiletUrl();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadPhotoData]);

  const submitHandler = async ({ fname, lname, password }) => {
    setMessage('');
    //  console.log('password==>',password)
    try {
      const response = await axios.put('/api/user/updateProfile', {
        fname,
        lname,
        password,
        profileUrl: userState.user.profileUrl,
      });
      // console.log('response.message=', response.data.message);
      if (response.data.message === 'User Profile Updated') {
        dispatch(userNameChanged(fname + ' ' + lname));
      }
      setMessage('Profile Updated Successfully');
      if (password) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        // router.push(redirect || '/');

        if (result.error) {
          setMessage(result.error);
        }
      }
    } catch (err) {
      setMessage(getError(err));
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Profile</title>
      </Head>
      <form className='mx-auto md:w-1/2' onSubmit={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-center uppercase font-bold text-2xl'>
          Update Your Profile
        </h1>
        {errors && (
          <div className='text-red-500 text-xl font-bold w-full text-center mt-4 mb-4'>
            {message}
          </div>
        )}

        {/* UPLOAD PHOTO Section */}
        <h1 className='my-6 text-l shadow-sm font-bold'>
          Upload Profile Photo
          {/* <span className="text-red-500 mx-1 font-bold">*</span> */}
        </h1>
        {/* Pass state data and dispatch to the DropZone component */}
        <DropZone
          data={uploadPhotoData}
          dispatch={uploadPhotoDispatch}
          type={'photo'}
        />

        {profileUrl && profileUrl !== ' ' && (
          <div className='flex justify-center items-center'>
            {!showProfileModal && (
              <a className='cursor-pointer' onClick={openProfileModal}>
                Preview Profile Photo
              </a>
            )}
            {showProfileModal && (
              <ProfileModal closeModal={closeModal} profileUrl={profileUrl} />
            )}
          </div>
        )}

        <div className='mb-4'>
          <label className='font-bold' htmlFor='fname'>
            First Name
          </label>
          <input
            type='text'
            className='w-full'
            id='fname'
            // disabled="true"
            autoFocus
            {...register('fname', {
              required: 'Please enter first name',
            })}
          />
          {errors.fname && (
            <div className='text-red-500'>{errors.fname.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label className='font-bold' htmlFor='lname'>
            Last Name
          </label>
          <input
            type='text'
            className='w-full'
            id='lname'
            // disabled="true"
            // autoFocus
            {...register('lname', {
              required: 'Please enter last name',
            })}
          />
          {errors.lname && (
            <div className='text-red-500'>{errors.lname.message}</div>
          )}
        </div>

        {/* <div className="mb-4">
          <label className="font-bold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            className="w-full"
            id="email"
            disabled="true"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div> */}

        <div className='mb-4'>
          <label className='font-bold' htmlFor='password'>
            Password
          </label>
          {/* <input
            className="w-full"
            type="password"
            id="password"
            {...register('password', {
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
          /> */}
          <input
            type='password'
            autoComplete='off'
            {...register('password', {
              // required: 'Please Enter Password',
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/,
                message:
                  'Password should be greater than 7, containing at 1 number and one special (non-alphanumeric) character',
              },
            })}
            className='w-full'
            id='password'
          ></input>
          {errors.password && (
            <div className='text-red-500 '>{errors.password.message}</div>
          )}
        </div>

        <div className='mb-4'>
          <label className='font-bold' htmlFor='confirmPassword'>
            Confirm Password
          </label>
          <input
            className='w-full'
            type='password'
            autoComplete='off'
            id='confirmPassword'
            {...register('confirmPassword', {
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 7,
                message: 'Confirm Password is Less than 7 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className='text-red-500 '>
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className='text-red-500 '>Password do not match</div>
            )}
        </div>
        <div className='mb-4 flex justify-center'>
          <button
            className='primary-button uppercase text-white font-bold'
            disabled={updateProfileButtonDisable}
          >
            Update Profile
          </button>
        </div>
      </form>
    </>
  );
}

ProfileScreen.auth = true;
ProfileScreen.adminOnly = true;
