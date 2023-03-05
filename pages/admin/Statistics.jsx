import Counts from '../../components/Admin/Statistics/Counts';
import Chart from '../../components/Admin/Statistics/Chart';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';

export default function Statistics() {
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
        <title>Dashboard - Statistics</title>
      </Head>

      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Statistics</p>

      <div className="grid lg:grid-cols-1 gap-5 mb-5">
        <Counts />
        <>{appState.isWaiting ? <> </> : <Chart />}</>
      </div>
    </>
  );
}
Statistics.auth = true;
Statistics.adminOnly = true;
