import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { useGetDetailCompanyJobQuery } from '@/services/adminCompanyApi';
import DetailJobComponent from '@/components/Admin/System/SystemJob/DetailJobComponent';

const DetailJobCompany = () => {
  const idJobCompany = useAppSelector(state => state.global.id);

  const dispatch = useAppDispatch();
  const { data: jobCompany, isLoading } = useGetDetailCompanyJobQuery({ id: idJobCompany });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return <DetailJobComponent jobDetail={jobCompany} href={'/admin/company/jobCompany'} />;
};

export default DetailJobCompany;
