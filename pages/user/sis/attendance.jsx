import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../../redux/slices/appSlice';

export default function Attendance() {
  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );
  // console.log('appState.isWaiting==', appState.isWaiting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>SIS - Attendance</title>
      </Head>

      <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Attendance</p>

      <div className='grid lg:grid-cols-1 gap-5 mb-5'>Attendance table</div>
    </>
  );
}
Attendance.auth = true;
Attendance.adminOnly = true;
