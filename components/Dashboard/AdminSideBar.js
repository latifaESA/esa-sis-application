import { forwardRef } from 'react';
import Link from 'next/link';
import {
  PencilIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
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
      <div ref={ref} className='fixed w-48 h-full overflow-auto bg-white z-10'>
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
          {/* Dashboard Section */}
          <Link href='/dashboard/dashboard'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/dashboard/dashboard'
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

          {/* Statistics Section */}

          <Link href='/dashboard/Classes'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/dashboard/Classes'
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
              }`}
              disabled={true}
            >
              <div className='mr-2'>
                <TableCellsIcon className='h-5 w-5' />
              </div>
              <div>
                <p>Classes</p>
              </div>
            </div>
          </Link>

          {/* Grades Section */}

          <Link href='/dashboard/Grades'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/dashboard/Grades'
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              <div className='mr-2'>
                <ClipboardDocumentListIcon className='h-5 w-5' />
              </div>
              <div>
                <p>Grades</p>
              </div>
            </div>
          </Link>

          <Link href='/dashboard/Schedule'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/dashboard/Schedule'
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              <div className='mr-2'>
                <CalendarDaysIcon className='h-5 w-5' />
              </div>
              <div>
                <p>Schedule</p>
              </div>
            </div>
          </Link>

          {/* Payment Section */}

          <Link href='/dashboard/Payments'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/dashboard/Payments'
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              <div className='mr-2'>
                <CreditCardIcon className='h-5 w-5' />
              </div>
              <div>
                <p>Payments</p>
              </div>
            </div>
          </Link>

          {/* Edit Profile */}

          <Link href='/dashboard/profile'>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == '/admin/profile'
                  ? 'bg-orange-100 text-orange-500'
                  : 'text-gray-400 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              <div className='mr-2'>
                <PencilIcon className='h-5 w-5' />
              </div>
              <div>
                <p> Edit Profile</p>
              </div>
            </div>
          </Link>

          {/* Settings Section */}

          <Link href='/dashboard/Settings/Settings'>
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
        </div>
      </div>
    </>
  );
});

AdminSideBar.displayName = 'AdminSideBar';

export default AdminSideBar;
