import React, { useEffect, useState } from 'react'
import axios from 'axios';
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
    WalletIcon ,
    LockClosedIcon 
  } from '@heroicons/react/24/solid';
  import { useRouter } from 'next/router';
  import Link from 'next/link';
  import { useSession } from 'next-auth/react';


const StudentView = () => {

  const { data: session } = useSession();

  let isLimited;
      if(session?.user.status == 'limited'){
        isLimited = true
      }
  

    const router = useRouter();
  return (
    <>
     <div className='flex flex-col'>
            {/* Main Section */}
            <Link href='/student/main'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/main'
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

            <Link href='/student/classes'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/classes'
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
          { !isLimited && <Link href='/student/grades'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/grades'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                    
                }`}
                
              >
                <div className='mr-2' >
                  <AcademicCapIcon  className='h-5 w-5' />
                </div>
                <div >
                  <p>Grades</p>
                </div>
              </div>
            </Link>}
            
            { isLimited &&

              <div
                className={`pl-2 py-3 mx-5 rounded pointer-events-none text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/grades'
                    ? 'bg-blue-100 text-blue-500'
                    : 'text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                    
                }`}
                
              >
                <div className='mr-2' >
                  <AcademicCapIcon  className='h-5 w-5' />
                </div>
                <div className='flex'>
                  <p>Grades </p><LockClosedIcon className='h-4 w-4 ml-2'/>
                </div>
              </div>
            }

            {/* Grades Section */}

            <Link href='/student/schedule'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center  cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/schedule'
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
            <Link href='/student/attendance'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/attendance'
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

            <Link href='/student/profile'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/student/profile'
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
    </>
  )
}

export default StudentView