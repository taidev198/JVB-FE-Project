/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSendPaymentResultMutation } from '@/services/adminCompanyApi';

// utils/getQueryParams.ts
export const getQueryParams = (query: string) => {
  const params = new URLSearchParams(query);
  const result: { [key: string]: string | null } = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const PaymentSuccess = () => {
  const router = useRouter();
  const [sendPaymentResult] = useSendPaymentResultMutation();

  useEffect(() => {
    if (router.isReady) {
      const queryParams = getQueryParams(router.asPath.split('?')[1]);

      // Gửi dữ liệu về backend
      console.log('Check queryParams: ', queryParams);
      sendPaymentResult(queryParams)
        .unwrap()
        .then(response => {
          console.log('Kết quả thanh toán đã được gửi thành công:', response);
        })
        .catch(error => {
          console.error('Lỗi khi gửi kết quả thanh toán:', error);
        });
    }
  }, [router.isReady, router.asPath]);

  return (
    <form className="w-full">
      <div className="w-full rounded-lg border border-[#CADBFC] bg-[#FCFCFD] p-8">
        <div className="send-balance">
          <div className="mb-4">
            <span className="text-base">Xác nhận thanh toán thành công</span>
          </div>
          <div className="mb-4">
            <span className="text-base">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</span>
          </div>
          <Link href={'/admin/company/wallet'}>Quay lại tài khoản ví</Link>
        </div>
      </div>
    </form>
  );
};

export default PaymentSuccess;
