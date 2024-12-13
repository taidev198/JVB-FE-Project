'use client';
import { useState } from 'react';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '@/components/Logo';
import { Button } from '@/components/Common/Button';

const VerifyMyAccount = () => {
  const [otp, setOtp] = useState('');
  const onOtpChange = (value: string): void => {
    setOtp(value);
  };
  return (
    <div className="flex h-screen  flex-col items-center justify-center bg-[#fff]">
      <div className="max-w-[450px]  p-8 shadow-xl">
        <div className="mx-auto w-fit">
          <Logo />
        </div>
        <div className="flex flex-col">
          <div className="mt-6">
            <h1 className="text-[22px] font-medium text-[#4B465C]">Quên mật khẩu? 🔒</h1>
            <p className="mt-[6px] text-[#4B465C]">Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu</p>
          </div>
          <form className="mt-6 flex flex-col gap-4">
            <OtpInput
              value={otp}
              onChange={onOtpChange}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={props => <input {...props} type="text" />}
              inputStyle={{
                width: 55,
                height: 60,
                backgroundColor: '#ebebe945',
                borderRadius: 20,
              }}
              containerStyle={{
                justifyContent: 'center',
              }}
            />
            <Button full={true} text="Gửi OTP" type="submit" />
            <Link href={'/auth/login'} className="mx-auto cursor-pointer hover:text-primary-main">
              <ArrowBackIcon /> Quay lại login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
export default VerifyMyAccount;
