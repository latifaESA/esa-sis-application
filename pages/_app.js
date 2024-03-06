/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\_app.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { wrapper } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import Cookies from "js-cookie";
import Head from "next/head";

// Remove unused componentDidMount function
// function componentDidMount() {
//   process.on('uncaughtException', function (exception) {
//     console.log('uncaughtException',exception);
//   });
// }

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const persistor = store.__persisitor;

  // Remove componentDidMount(); It's unnecessary

  if (Component.getLayout) {
    return (
      <>
        <SessionProvider session={session}>
          <Provider store={store}>
            <Component {...props.pageProps} />
          </Provider>
        </SessionProvider>
      </>
    );
  }

  return (
    <div className="primary-bg h-full">
      <Head>
        <link rel="icon" href="/esa.ico" />
      </Head>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth adminOnly={Component.auth}>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                {Component.adminOnly ? (
                  <DashboardLayout>
                    <Component {...props.pageProps} />
                  </DashboardLayout>
                ) : (
                  <Component {...props.pageProps} />
                )}
              </PersistGate>
            </Provider>
          </Auth>
        ) : (
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <Component {...props.pageProps} />
            </PersistGate>
          </Provider>
        )}
      </SessionProvider>
    </div>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=Login Required");
    },
  });

  if (status === "loading") {
    return (
      <div className="grid h-screen place-items-center">
        <CircularProgress />
      </div>
    );
  }

  if (status === "unauthenticated") {
    sessionStorage.clear();
    Cookies.remove("sessionCookieName", { path: "" });
  }

  return children;
}

export default MyApp;
