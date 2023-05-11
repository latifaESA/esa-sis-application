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
  PencilSquareIcon,
  HandRaisedIcon,
  UserGroupIcon,
  NewspaperIcon,
  AcademicCapIcon,
  WalletIcon 
} from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
// import selection_data from '../../utilities/selection_data';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line no-unused-vars
const DashboardSideBar = forwardRef(({ showNav }, ref) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { status, data: session } = useSession();
  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );
  let admin = session?.user.role == '0';

  return (
    <>
      <div ref={ref} className='fixed w-52 h-full overflow-auto bg-white z-10'>
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
        {session?.user.role === '1' ? (
          <div className='flex flex-col'>
            {/* Main Section */}
            <Link href='/user/sis/main'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/main'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <ComputerDesktopIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Basic Information</p>
                </div>
              </div>
            </Link>

            {/* Classes Section */}

            <Link href='/user/sis/classes'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/classes'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
                disabled={true}
              >
                <div className='mr-2'>
                  <TableCellsIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Financial</p>
                </div>
              </div>
            </Link>

            {/* Schedule Section */}
            <Link href='/user/sis/schedule'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/schedule'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <AcademicCapIcon  className='h-5 w-5' />
                </div>
                <div>
                  <p>Grades</p>
                </div>
              </div>
            </Link>

            {/* Grades Section */}

            <Link href='/user/sis/grades'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/grades'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
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

            {/* Attendance Section */}
            <Link href='/user/sis/attendance'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/attendance'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <CreditCardIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Attendance</p>
                </div>
              </div>
            </Link>

            {/* Payment Section */}

            {/* <Link href='/user/sis/payments'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/payments'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <PencilIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Edit Profile</p>
                </div>
              </div>
            </Link> */}

            {/* Courses */}
            {/* <Link href='/user/sis/courses'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/courses'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <PencilSquareIcon className='h-5 w-5' />
                </div>
                <div>
                  <p> Register Courses</p>
                </div>
              </div>
            </Link> */}

            {/* Edit Profile */}

            <Link href='/user/sis/profile'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/profile'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
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
          </div>
        ) : (
          // Program Manager SideBar Section

          <div className='flex flex-col'>
            {/* Dashboard Section */}
            <Link href='/programManager/main'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/main'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
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

            {/* Courses Section */}

            <Link href='/programManager/students'>
            {/* <Link href='/admin/courses'> */}
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/students'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
                disabled={true}
              >
                <div className='mr-2'>
                  <TableCellsIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>List of Students</p>
                </div>
              </div>
            </Link>

            {/* Users Section */}

            <Link href='/programManager/teachers'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/teachers'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <UserGroupIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Teachers</p>
                </div>
              </div>
            </Link>

            <Link href='/programManager/schedule'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/schedule'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <AcademicCapIcon  className='h-5 w-5' />
                </div>
                <div>
                  <p>Grades</p>
                </div>
              </div>
            </Link>

            {/* Report Section */}

            <Link href='/programManager/report'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/report'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
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

            <Link href='/programManager/attendance'>
            {/* <Link href='/admin/payments'> */}
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/attendance'
                  // router.pathname == '/admin/Payments'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <CreditCardIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Attendance</p>
                </div>
              </div>
            </Link>

            {/* Edit Profile */}

            <Link href='/programManager/courses'>
            {/* <Link href='/admin/profile'> */}
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/courses'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <WalletIcon className='h-5 w-5' />
                </div>
                <div>
                  <p> Courses</p>
                </div>
              </div>
            </Link>

            {/* Settings Section */}

            <Link href='/programManager/Settings/Settings'>
            {/* <Link href='/admin/Settings/Settings'> */}
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/admin/Settings/Settings' ||
                  router.pathname == '/admin/Settings/General' ||
                  router.pathname == '/admin/Settings/DropDownList'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <ClipboardDocumentListIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Reports</p>
                </div>
              </div>
            </Link>
            <Link href='/programManager/profile'>
            {/* <Link href='/admin/Settings/Settings'> */}
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  // router.pathname == '/admin/Settings/Settings' ||
                  // router.pathname == '/admin/Settings/General' ||
                  // router.pathname == '/admin/Settings/DropDownList'
                  router.pathname == '/programManager/profile'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                }`}
              >
                <div className='mr-2'>
                  <PencilIcon className='h-5 w-5' />
                </div>
                <div>
                  <p>Edit Profile</p>
                </div>
              </div>
            </Link>
            <Link href='/programManager/Settings/Settings'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/programManager/Settings/Settings' ||
                  router.pathname == '/programManager/Settings/General' ||
                  router.pathname == '/programManager/Settings/DropDownList'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
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
        )}
      </div>
    </>
  );
});

DashboardSideBar.displayName = 'DashboardSideBar';

export default DashboardSideBar;
