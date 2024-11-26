/* eslint-disable no-console */
import { useState } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import RegisterCompanyComponent from '@/components/auth/Company/RegisterCompanyComponent';
import RegisterSchoolComponent from '@/components/auth/School/RegisterSchoolComponent';

// Đưa validationSchema lên trước

const RegisterCompany = () => {
  const [registerSelect, setRegisterSelect] = useState('company');
  console.log({ registerSelect });

  return (
    <AuthLayout type="register">
      <div className="mt-5 flex justify-center gap-4">
        <div
          className={`cursor-pointer rounded px-8 py-4 text-[#7e8188] ${registerSelect === 'company' ? 'bg-primary-main text-primary-white' : 'bg-[#f1f1f1]'}`}
          onClick={() => setRegisterSelect('company')}>
          Doanh nghiệp
        </div>
        <div
          className={`cursor-pointer rounded px-8 py-4 text-[#7e8188] ${registerSelect === 'school' ? 'bg-primary-main text-primary-white' : 'bg-[#f1f1f1]'}`}
          onClick={() => setRegisterSelect('school')}>
          Trường học
        </div>
      </div>
      {registerSelect === 'company' && <RegisterCompanyComponent />}
      {registerSelect === 'school' && <RegisterSchoolComponent />}
    </AuthLayout>
  );
};

export default RegisterCompany;
