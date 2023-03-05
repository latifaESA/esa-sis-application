// import ListUsersDetail from '../../components/Admin/ListUsersDetail';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
import { Students } from '../../components/Admin/Students';
import { appIsWaiting } from '../../redux/slices/appSlice';
// import { Home } from '../../components/GOToHome';

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>Dashboard - Main Board</title>
      </Head>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Dashboard</p>

      {/* <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded bg-white h-20 shadow-sm">Notifications</div>
        <div className="rounded bg-white h-20 shadow-sm">Messages</div>
      </div> */}
      <div className="grid lg:grid-cols-1 gap-5 mb-5">
        {/* <ListUsersDetail /> */}
        <Students />
      </div>
      {/* <div className="grid lg:grid-cols-1 gap-5 mb-5">
        <div className="grid col-1 bg-white h-96 shadow-sm">Candidate List</div>
      </div> */}
      {/* <div className='grid lg:grid-cols-1 bg-white p-5 shadow-sm'>
        <LowerButtons />
      </div> */}
    </>
  );
}
Dashboard.auth = true;
Dashboard.adminOnly = true;
