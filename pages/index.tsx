// pages/index.tsx
import Head from 'next/head';
import React from 'react';
import Banner from '../components/Portal/Banner';
import OurProcess from '../components/Portal/OurProcess';

import Brand from '@/components/Portal/Brand';
import FeedBack from '@/components/Portal/FeedBack';
import Job from '@/components/Portal/Job';
import Majors from '@/components/Portal/Majors';
import Statistic from '@/components/Portal/Statistic';
import WhyWe from '@/components/Portal/WhyWe';
import Workshop from '@/components/Portal/Workshop';
import PortalLayout from '@/layouts/portal/PortalLayout';

interface HomeProps {
  serverSideApiKeyIsSet: boolean;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Head>
        <title>Base</title>
        <meta name="description" content="" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="home">
        <main>
          <Banner />
          <OurProcess />
          <Brand />
          <Majors />
          <Job />
          <WhyWe />
          <FeedBack />
          <Statistic />
          <Workshop />
        </main>
      </PortalLayout>
    </>
  );
};
export default Home;
