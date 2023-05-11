import { Fragment, React, useState } from 'react';
import {
  Bars3CenterLeftIcon,
  // PencilIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Menu, Transition, Popover } from '@headlessui/react';
import Badge from '@mui/material/Badge';
import Image from 'next/image';
// import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// import { useState } from 'react';
import { isLogout } from '../../redux/slices/userSlice';
import selection_data from '../../utilities/selection_data';
import axios from 'axios';
import encrypt from '../../utilities/encrypt_decrypt/encryptText';
import { NotificatonMessages } from './WarningMessage';
// import NavigationRef from '../../utilities/NavbarRef/navigationRef';

export default function AdminTopBar({ showNav, setShowNav }) {
  // eslint-disable-next-line no-unused-vars
  const { data: session } = useSession();
  const dispatch = useDispatch();
  // const router = useRouter();

  const logoutClickHandler = async () => {
    dispatch(isLogout(true));
    const emailWas = session?.user.email;
    const role = session?.user.role;

    await signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}${selection_data.where_going_after_logout}`,
    });
    // dispatch(logoutSuccess());
    const encryptedEmail = encrypt(
      JSON.stringify({
        email: emailWas,
        role,
        info: 'signout navbar',
      })
    );
    await axios.put('/api/logger/sendInfoToLogger', {
      data: encryptedEmail,
    });
    // if (router.locale === 'fr') {
    //   await router.replace('/', undefined, { locale: 'en-US' });
    // } else await router.replace('/');

    // const encryptedBody = encrypt(
    //   JSON.stringify({ email: session?.user.email,role: session?.user.role, info: 'signout' })
    // );
    // await axios.put('/api/logger/sendInfoToLogger', {
    //   data: encryptedBody,
    // });
    // await signOut();

    // dispatch(logoutSuccess());
  };

  const userState = useSelector(
    (state) => state.persistedReducer.user_state.userState
  );

  const warnings = [
    {
      id: 0,
      role: 1,
      action: 'Sending Verificaton Email',
      message:
        'Email Could not be sent, a user is trying to register and verify his email but got error while verifiying!',
      isSolved: 1,
      date: '01/03/2023',
    },

    {
      id: 1,
      role: 1,
      action: 'Submitting',
      message:
        'network failed a user is trying to submit his application and got this error',
      isSolved: 1,
      date: '01/03/2023',
    },
  ];

  const [openNotificatonMessages, setOpenNotificatonMessages] = useState(false);
  const [warningNotification, setWarningNotification] = useState(warnings);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleSolveNotificatonMessages = () => {
    setWarningNotification((prevWarning) =>
      prevWarning.map((warning) => {
        if (warning.id === 0) {
          return { ...warning, isSolved: 1 };
        } else {
          warning;
        }
        return warning;
      })
    );
  };

  const handleOpenNotificatonMessages = (notification) => {
    setSelectedNotification(notification);
    setOpenNotificatonMessages(true);
  };

  const handleCloseNotificatonMessages = () => {
    setOpenNotificatonMessages(false);
  };

  const handleSolvedClicked = () => {
    handleSolveNotificatonMessages(selectedNotification);
    setOpenNotificatonMessages(false);
  };

  const unSolvedWarnings = warnings.filter((warning) => warning.isSolved === 0);

  return (
    <>
      <div
        className={`fixed w-full h-16 flex justify-between items-center transition-all z-10 bg-white shadow-sm duration-[400ms] ${
          showNav ? 'pl-56' : ''
        }`}
      >
        <div className='pl-2 md:pl-5'>
          <Bars3CenterLeftIcon
            className='h-8 w-8 text-gray-700 cursor-pointer'
            onClick={() => setShowNav(!showNav)}
          />
        </div>
        <div className='flex items-center pr-4 md:pr-16'>
          <Popover className='relative'>
            <Popover.Button className='outline-none mr-5 md:mr-8 cursor-pointer text-gray-700'>
              <Badge badgeContent={unSolvedWarnings.length} color='warning'>
                <BellIcon className='h-6 w-6' />
              </Badge>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform scale-95'
              enterTo='transform scale-100'
              leave='transition ease-in duration=75'
              leaveFrom='transform scale-100'
              leaveTo='transform scale-95'
            >
              <Popover.Panel className='absolute -right-16 sm:right-4 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen'>
                <div className='relative p-3'>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-gray-700 font-medium'>Notifications</p>
                    {/* <a
                          className='text-sm text-orange-500 cursor-pointer'
                        >
                          Mark all as read
                        </a> */}
                  </div>
                  {warningNotification.map(
                    (warning) =>
                      warning.isSolved === 0 && (
                        <div
                          key={warning.id}
                          className='mt-4 grid gap-4 grid-cols-1 overflow-hidden'
                        >
                          <div className='flex'>
                            <div className='rounded-full shrink-0 bg-red-500 h-8 w-8 flex items-center justify-center'>
                              <CheckIcon className='h-4 w-4 text-white' />
                            </div>
                            <div className='ml-4'>
                              <p
                                onClick={handleOpenNotificatonMessages}
                                className='font-medium text-gray-700 cursor-pointer'
                              >
                                {warning.action}
                              </p>
                              <p className='text-sm text-gray-500 truncate'>
                                {warning.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='inline-flex w-full justify-center items-center'>
                <picture>
                  <Image
                    className='w-[40px] h-[40px] rounded-full'
                    alt='avatar'
                    width={70}
                    data-testid='img'
                    height={70}
                    src={
                      userState.user.profileUrl &&
                      userState.user.profileUrl !== ' '
                        ? userState.user.profileUrl
                        : selection_data.user_Avatar
                    }
                  ></Image>
                </picture>
                <span className='hidden md:block font-medium text-gray-700 ml-2'>
                  {userState.user.name}
                </span>
                <ChevronDownIcon className='ml-2 h-4 w-4 text-gray-700' />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform scale-95'
              enterTo='transform scale-100'
              leave='transition ease-in duration=75'
              leaveFrom='transform scale-100'
              leaveTo='transform scale-95'
            >
              <Menu.Items className='absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-sm'>
                <div className='p-1'>
                  {/* <Menu.Item>
                  <Link
                    href="/admin/profile"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Menu.Item> */}
                  <Menu.Item>
                    <a
                      href='#'
                      className='flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center'
                      onClick={logoutClickHandler}
                    >
                      <ArrowLeftOnRectangleIcon className='h-4 w-4 mr-2' />
                      Logout
                    </a>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {openNotificatonMessages && (
        <NotificatonMessages
          handleOpenNotificatonMessages={handleOpenNotificatonMessages}
          handleCloseNotificatonMessages={handleCloseNotificatonMessages}
          handleSolvedClicked={handleSolvedClicked}
          selectedNotification={warningNotification}
        />
      )}
    </>
  );
}
