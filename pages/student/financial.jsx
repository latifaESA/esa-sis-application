import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TabsComponent from '../../components/tabs/TabsComponent';
// import Link from 'next/link';


export default function Financial() {
  // const appState = useSelector(
  //   (state) => state.persistedReducer.app_state.appState
  // );
  // console.log('appState.isWaiting==', appState.isWaiting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: session } = useSession();
  const router = useRouter()

  const redirect = () => { 
    router.push('/AccessDenied')
  }

  return (
    <>
      <Head>
        <title>SIS - Financial</title>
      </Head>

     {session?.user.role === '1' ? ( 
      <>
     <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Financial</p>
     <TabsComponent items={items} />
      </>
     ) : redirect()}

    </>
  );
}

const items = [
  {
    title: 'History',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600'>Title Test 1</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          aperiam asperiores doloribus velit dolore magnam ex consectetur fugit
          earum illum qui similique architecto dolorum, minima enim quidem
          voluptatibus at nulla deleniti harum! Totam, mollitia quos voluptatem
          deleniti provident obcaecati rerum.
        </p>
      </div>
    ),
  },
  {
    title: 'Future Payment',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <table className='w-full text-center'>
          <thead className="border-b border-blue-gray-100 p-4 bg-blue-50">
            <tr>
              <th>Date</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-4 border-b border-blue-gray-50">
              <td>27/10/2023</td>
              <td>1200</td>
            </tr>
            <tr className="p-4 border-b border-blue-gray-50">
              <td>27/10/2023</td>
              <td>1200</td>
            </tr>
            <tr className="p-4 border-b border-blue-gray-50">
              <td>27/10/2023</td>
              <td>1200</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
];
Financial.auth = true;
Financial.adminOnly = true;
