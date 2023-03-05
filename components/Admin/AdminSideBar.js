import { forwardRef } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  // CreditCardIcon,
  PencilIcon,
  UserIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
// import selection_data from '../../utilities/selection_data';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line no-unused-vars
const AdminSideBar = forwardRef(({ showNav }, ref) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { status, data: session } = useSession();
  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );

  return (
    <>
      {session?.user.role !== '1' && (
        <div ref={ref} className='fixed w-56 h-full bg-white z-10'>
          <div className='flex justify-center mt-2 mb-2'>
            <Link href='/' className='text-lg font-bold mt-1'>
              <picture>
                <img
                  className='w-32 h-auto'
                  src={appState.appVar.esa_logo}
                  alt='ESA logo'
                />
              </picture>
            </Link>
          </div>

          <div className='flex flex-col'>
            {session.user.role === '1' && (
              <Link href='/'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <HomeIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Home</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Dashboard Section */}
            {(session.user.role === '0' || session.user.role === '2'|| session.user.role === '3') && (
              <Link href='/admin/dashboard'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/dashboard'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <ComputerDesktopIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Main Board</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Statistics Section */}
            {(session.user.role === '0' || session.user.role === '2'|| session.user.role === '3') && (
              <Link href='/admin/Statistics'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/Statistics'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                  disabled={true}
                >
                  <div className='mr-2'>
                    <ChartBarIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Statistics</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Warrnings Section */}
            {session.user.role === '0' && (
              <Link href='/admin/Logs/Logs'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/Logs/Logs' ||
                    router.pathname == '/admin/Logs/Info' ||
                    router.pathname == '/admin/Logs/Error'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <ExclamationTriangleIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Logs</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Archive Section */}
            {session.user.role === '0' && (
              <Link href='/admin/Archive'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/Archive'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <ArchiveBoxIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Archive</p>
                  </div>
                </div>
              </Link>
            )}

            {/* New User Section */}
            {session.user.role === '0' && (
              <Link href='/admin/Account/Account'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/Account/Account' ||
                    router.pathname == '/admin/Account/CreateAccount' ||
                    router.pathname == '/admin/Account/UsersList'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <UserIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Account</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Edit Profile */}
            {(session.user.role === '0' || session.user.role === '2'|| session.user.role === '3') && (
              <Link href='/admin/profile'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/profile'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <PencilIcon className='h-5 w-5' />

                    {/* <CreditCardIcon className="h-5 w-5" /> */}
                  </div>
                  <div>
                    <p> Edit Profile</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Settings Section */}

            {session.user.role === '0' && (
              <Link href='/admin/Settings/Settings'>
                <div
                  className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                    router.pathname == '/admin/Settings/Settings' ||
                    router.pathname == '/admin/Settings/General' ||
                    router.pathname == '/admin/Settings/DropDownList'
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  }`}
                >
                  <div className='mr-2'>
                    <Cog8ToothIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <p>Settings</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
});

AdminSideBar.displayName = 'AdminSideBar';

export default AdminSideBar;
