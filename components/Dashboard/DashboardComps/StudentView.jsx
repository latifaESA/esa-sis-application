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
    WalletIcon 
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
          { !isLimited && <Link href='/user/sis/grades'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/grades'
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
                  router.pathname == '/user/sis/grades'
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
            }

            {/* Grades Section */}

            <Link href='/user/sis/schedule'>
              <div
                className={`pl-2 py-3 mx-5 rounded text-center  cursor-pointer mb-3 flex items-center transition-colors ${
                  router.pathname == '/user/sis/schedule'
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
    </>
  )
}

export default StudentView