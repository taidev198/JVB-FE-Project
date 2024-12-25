import Head from 'next/head';
import React from 'react';

import BreadCrumbHeader from '@/components/Portal/common/BreadCrumbHeader';
import WorkshopsList from '@/components/Portal/WorkshopsList/WorkshopsList';
import PortalLayout from '@/layouts/portal/PortalLayout';

interface WorkshopsListProp {
  serverSideApiKeyIsSet: boolean;
}

const CompanyListPage: React.FC<WorkshopsListProp> = () => {
  return (
    <>
      <Head>
        <title>Workshops List</title>
        <meta name="description" content="Danh sách workshop" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>
      <PortalLayout type="workshop-list">
        <main>
          <BreadCrumbHeader title="Danh sách workshop" currentPage="Workshop" />
          <WorkshopsList />
        </main>
      </PortalLayout>
    </>
  );
};

export default CompanyListPage;
