import { useState, useEffect, Fragment } from 'react';
import AdminSideBar from './AdminSideBar';
import AdminTopBar from './AdminTopBar';
import { Transition } from '@headlessui/react';
import Head from 'next/head';
// import selection_data from '../../utilities/selection_data';
// import { GoToLogin } from '../../components/GoToLogin';
import { useSession } from 'next-auth/react';
import UserAccessDenied from '../UserAccessDenied';
import { useSelector } from 'react-redux';

export default function AdminLayout({ children, title }) {
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  const appState = useSelector(
    (state) => state.persistedReducer.app_state.appState
  );

  function handleResize() {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      addEventListener('resize', handleResize);
    }

    return () => {
      removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          {title
            ? title + '- ESA SIS Application Dashboard'
            : 'ESA SIS Application Dashboard'}
        </title>
        <meta
          name='description'
          content='ESA SIS Application Dashboard Website Using Next.Js'
        />
        <link rel='icon' href={appState.appVar.esa_logo} />
      </Head>
      {session?.user.role !== '1' ? (
        <>
          <AdminTopBar showNav={showNav} setShowNav={setShowNav} />
          <Transition
            as={Fragment}
            show={showNav}
            enter='transform transition duration-[400ms]'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transform duration-[400ms] transition ease-in-out'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <AdminSideBar showNav={showNav} />
          </Transition>
          <main
            className={`pt-16 transition-all duration-[400ms] ${
              showNav && !isMobile ? 'pl-56' : ''
            }`}
          >
            <div className='px-4 md:px-16'>{children}</div>
          </main>
        </>
      ) : (
        <>
          <UserAccessDenied />
        </>
      )}
    </>
  );
}
