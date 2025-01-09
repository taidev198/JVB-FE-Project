import Head from 'next/head';
import AboutUsHeader from '@/components/portal/AboutUs/AboutUsHeader';
import PortalLayout from '@/layouts/portal/PortalLayout';

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>Workshops List</title>
        <meta name="description" content="Danh sách workshop" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>
      <PortalLayout type="school-list">
        <main>
          <AboutUsHeader />
        </main>
      </PortalLayout>
    </>
  );
};
export default AboutUs;
