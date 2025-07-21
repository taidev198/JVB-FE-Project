// pages/index.tsx
import Head from 'next/head';
import React from 'react';
import Banner from '../components/portal/Banner';
import OurProcess from '../components/portal/OurProcess';

import Brand from '@/components/portal/Brand';
import FeedBack from '@/components/portal/FeedBack';
import Job from '@/components/portal/Job';
import Majors from '@/components/portal/Majors';
import Statistic from '@/components/portal/Statistic';
import WhyWe from '@/components/portal/WhyWe';
import Workshop from '@/components/portal/Workshop';
import PortalLayout from '@/layouts/portal/PortalLayout';
import iconLogo from '@/assets/icons/LogoJobLink.svg';

interface HomeProps {
  serverSideApiKeyIsSet: boolean;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Head>
        <title>JobLink</title>
        <meta name="description" content="" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href={iconLogo} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
        <link href="https://vjs.zencdn.net/8.23.3/video-js.css" rel="stylesheet" />
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
