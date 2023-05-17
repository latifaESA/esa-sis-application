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


const AdminView = () => {

    const router = useRouter();

  return (
    <>
<div className='flex flex-col'>
  {/* Dashboard Section */}
  <Link href='/admin/main'>
    <div
      className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
        router.pathname == '/admin/main'
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

  {/* Create Section */}

  <Link href='/admin/create'>
  {/* <Link href='/admin/courses'> */}
    <div
      className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
        router.pathname == '/admin/create'
          ? 'bg-blue-100 text-blue-500'
          : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
      }`}
      disabled={true}
    >
      <div className='mr-2'>
        <TableCellsIcon className='h-5 w-5' />
      </div>
      <div>
        <p>Create</p>
      </div>
    </div>
  </Link>

  {/* Report Section */}

  <Link href='/admin/report'>
    <div
      className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
        router.pathname == '/admin/report'
          ? 'bg-blue-100 text-blue-500'
          : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
      }`}
    >
      <div className='mr-2'>
        <ClipboardDocumentListIcon className='h-5 w-5' />
      </div>
      <div>
        <p>Report</p>
      </div>
    </div>
  </Link>

      {/* Profile Section */}

  <Link href='/admin/profile'>
    <div
      className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
        router.pathname == '/admin/profile'
          ? 'bg-blue-100 text-blue-500'
          : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
      }`}
    >
      <div className='mr-2'>
        <PencilIcon  className='h-5 w-5' />
      </div>
      <div>
        <p>Edit Profile</p>
      </div>
    </div>
  </Link>
</div>
    </>
  )
}

export default AdminView