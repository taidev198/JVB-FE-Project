// pages/portal/jobs/index.tsx

import Head from 'next/head';
import React from 'react';

import BreadCrumbHeader from '@/components/portal/common/BreadCrumbHeader';
import JobsList from '@/components/portal/JobsList/JobsList';
import PortalLayout from '@/layouts/portal/PortalLayout';

interface JobListProps {
  serverSideApiKeyIsSet: boolean;
}

const JobListPage: React.FC<JobListProps> = () => {
  return (
    <>
      <Head>
        <title>Job Link - Dánh sách công việc test conflict</title>
        <meta name="description" content="Danh sách công việc" />
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

export default JobListPage;
