import React from "react";
import {
  PencilIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  // CreditCardIcon,
  // TableCellsIcon,
  // CalendarDaysIcon,
  ClipboardDocumentListIcon,
  // PencilSquareIcon,
  // HandRaisedIcon,
  // UserGroupIcon,
  // NewspaperIcon,
  // AcademicCapIcon,
  // WalletIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Link from "next/link";

const AdminView = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col">
        {/* Main Board Section */}
        <Link href="/admin/main">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/main"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <ComputerDesktopIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Main Board</p>
            </div>
          </div>
        </Link>
        {/* Statistics Section */}
        <Link href="/admin/statistics">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/statistics"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Statistics</p>
            </div>
          </div>
        </Link>

        {/* Account Managment */}

        <Link href="/admin/Accounts">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/Accounts"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
            disabled={true}
          >
            <div className="mr-2">
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Accounts</p>
            </div>
          </div>
        </Link>

        {/* Create Section */}

        {/* <Link href="/admin/createAccount">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/createAccount"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
            disabled={true}
          >
            <div className="mr-2">
              <UserPlusIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Create Accounts</p>
            </div>
          </div>
        </Link> */}
        <Link href="/admin/Courses">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/Courses"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
            disabled={true}
          >
            <div className="mr-2">
              <UserPlusIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Courses</p>
            </div>
          </div>
        </Link>

        {/* Report Section */}

        {/* Assign Section */}

        {/* <Link href="/admin/assign">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/assign"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
            disabled={true}
          >
            <div className="mr-2">
              <UserPlusIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Assign Major</p>
            </div>
          </div>
        </Link> */}

        {/* Report Section */}

        <Link href="/admin/report">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/report"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <ClipboardDocumentListIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Report</p>
            </div>
          </div>
        </Link>
        {/* Settings Section */}

        {/* Profile Section */}
        <Link href="/admin/profile">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/profile"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <PencilIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Edit Profile</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/Settings/Settings">
          <div
            className={`pl-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/admin/Settings/Settings" ||
              router.pathname == "/admin/Settings/General" ||
              router.pathname == "/admin/Settings/DropDownList"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <Cog8ToothIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Settings</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AdminView;
