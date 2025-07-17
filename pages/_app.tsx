import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';
import { store } from '../store/store';
import { persistor } from '@/store/store';

// Layouts for different admin sections
import AdminSystemLayout from '@/layouts/Admin/AdminSystemLayout';
import AdminSchoolLayout from '@/layouts/Admin/AdminSchoolLayout';
import AdminCompanyLayout from '@/layouts/Admin/AdminCompanyLayout';
import ToastNotification from '@/components/Common/ToastNotification';
import SocketProvider from '@/context/SoketProvider';
import SocketMessagesProvider from '@/context/SocketMessagesProvider';
import IELTSSystemLayout from '@/layouts/Admin/IELTSSystemLayout';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Function to choose layout based on the pathname
const getLayout = (pathname: string) => {
  if (pathname.startsWith('/admin/system')) {
    return AdminSystemLayout;
  } else if (pathname.startsWith('/admin/school')) {
    return AdminSchoolLayout;
  } else if (pathname.startsWith('/admin/company')) {
    return AdminCompanyLayout;
  } else if (pathname.startsWith('/wallet')) {
    return AdminCompanyLayout;
  } else if (pathname.startsWith('/admin/ielts')) {
    // Assuming you have a specific layout for IELTS admin pages
    return IELTSSystemLayout; // or a specific IELTS layout if you have one
  }
  {
    // Default layout (or no layout if desired)
    return ({ children }: { children: React.ReactNode }) => <>{children}</>;
  }
};

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const Layout = getLayout(router.pathname);

  return (
    <>
      <Head>
        <title>JobLink</title>
        <meta name="description" content="" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SocketMessagesProvider>
        <Provider store={store}>
          <SocketProvider>
            <PersistGate loading={null} persistor={persistor}>
              <main className={plusJakartaSans.className}>
                <Toaster
                  position="top-right"
                  containerStyle={{
                    top: 6,
                    right: 20,
                  }}
                />
                {/* Apply the layout dynamically based on pathname */}
                <Layout>
                  <ToastNotification />
                  <Component {...pageProps} />
                </Layout>
              </main>
            </PersistGate>
          </SocketProvider>
        </Provider>
      </SocketMessagesProvider>
    </>
  );
}

export default appWithTranslation(App);
