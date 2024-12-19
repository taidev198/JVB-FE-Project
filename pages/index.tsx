// pages/index.tsx
import Head from 'next/head';
import React from 'react';
import Banner from '../components/Portal/Banner';
import OurProcess from '../components/Portal/OurProcess';
import PortalLayout from '@/layouts/Portal/PortalLayout';
import Brand from '@/components/Portal/Brand';
import Majors from '@/components/Portal/Majors';
import Job from '@/components/Portal/Job';
import WhyWe from '@/components/Portal/WhyWe';
import FeedBack from '@/components/Portal/FeedBack';
import Statistic from '@/components/Portal/Statistic';
import Workshop from '@/components/Portal/Workshop';
import { ConfigProvider } from 'antd';

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
