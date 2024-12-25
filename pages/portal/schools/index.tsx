import Head from 'next/head';
import React from 'react';

import BreadCrumbHeader from '@/components/Portal/common/BreadCrumbHeader';
import SchoolsList from '@/components/Portal/SchoolsList/SchoolsList';
import PortalLayout from '@/layouts/portal/PortalLayout';

interface SchoolsListProps {
  serverSideApiKeyIsSet: boolean;
}

const SchoolsListPage: React.FC<SchoolsListProps> = () => {
  return (
    <>
      <Head>
        <title>Schools List</title>
        <meta name="description" content="Danh sách trường học" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="company-list">
        <main>
          <BreadCrumbHeader title="Danh sách trường học" currentPage="Trường học" />
          <SchoolsList />
        </main>
      </PortalLayout>
    </>
  );
};

export default SchoolsListPage;
