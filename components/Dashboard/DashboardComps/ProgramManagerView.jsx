import React from 'react'
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
  import Link from 'next/link';

const ProgramManagerView = () => {

    const router = useRouter();

  return (
    <>
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
    </>
  )
}

export default ProgramManagerView