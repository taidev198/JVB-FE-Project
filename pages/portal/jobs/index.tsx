import Head from 'next/head';
import React from 'react';

import BreadCrumbHeader from '@/components/Portal/common/BreadCrumbHeader';
import JobsList from '@/components/Portal/JobsList/JobsList';
import PortalLayout from '@/layouts/portal/PortalLayout';

interface CompanyListProps {
  serverSideApiKeyIsSet: boolean;
}

const CompanyListPage: React.FC<CompanyListProps> = () => {
  return (
    <>
      <Head>
        <title>Jobs List</title>
        <meta name="description" content="Danh sách công ty" />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>
      <PortalLayout type="job-list">
        <main>
          <BreadCrumbHeader title="Danh sách công việc" currentPage="Công việc" />
          <JobsList />
        </main>
      </PortalLayout>
    </>
  );
};

export default CompanyListPage;
