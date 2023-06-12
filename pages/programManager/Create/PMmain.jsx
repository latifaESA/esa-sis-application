/*
 * Created By: Jaber Mohamad
 * Project: Online Application
 * File: components/Admin/Account/AccountMain.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import Link from 'next/link';
import React from 'react';

export default function PMmain() {
  return (
    <>
    <div className="flex items-center justify-center h-[300px] gap-6">
      <div className="flex font-bold text-xl">
        <Link href="/programManager/Create/createAttendance">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-blue-500 rounded uppercase"
            type="button"
          >
            Create Attendance
          </button>
        </Link>
      </div>

      <div className="flex font-bold text-xl">
        <Link href="/programManager/attendance">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-blue-500 rounded uppercase"
            type="button"
          >
            View or Edit attendance
          </button>
        </Link>
      </div>
    </div>
  </>
  )
}
PMmain.auth = true;
PMmain.adminOnly = true;
