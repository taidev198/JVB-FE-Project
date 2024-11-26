/* eslint-disable react-hooks/rules-of-hooks */
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '../store/store';
import { persistor } from '@/store/store';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <>
      <Head>
        <title>Base</title>
        <title>Base</title>
        <meta name="description" content="" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <main className={plusJakartaSans.className}>
            <Toaster
              position="top-right"
              containerStyle={{
                top: 6,
                right: 20,
              }}
            />
            <Component {...pageProps} />
          </main>
        </PersistGate>
      </Provider>
    </>
  );
}

export default appWithTranslation(App);
