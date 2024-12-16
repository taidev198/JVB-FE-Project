'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '@/components/Logo';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useForgotPasswordMutation } from '@/services/adminSystemApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface FormDataForgot {
  password: string;
  confirmPassword: string;
}
const validationSchemaSchool = Yup.object({
  password: Yup.string()
    .required('Mật khẩu mới là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu mới là bắt buộc'),
});

const VerifyMyAccount = () => {
  const [otp, setOtp] = useState('');
  const onOtpChange = (value: string): void => {
    setOtp(value);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataForgot>({
    resolver: yupResolver(validationSchemaSchool),
  });
  const router = useRouter();
  const email = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email || '';
  const [forgot] = useForgotPasswordMutation();
  const onSubmit: SubmitHandler<FormDataForgot> = async data => {
    try {
      const response = await forgot({ email, password: data.password, confirmPassword: data.confirmPassword, otp }).unwrap();
      toast.success(response?.message);
      router.push({ pathname: '/auth/login' });
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string }).message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <OtpInput
              value={otp}
              onChange={onOtpChange}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={props => <input {...props} type="text" />}
              inputStyle={{
                width: 55,
                height: 60,
                backgroundColor: '#ebebe928',
                borderRadius: 10,
              }}
              containerStyle={{
                justifyContent: 'center',
              }}
            />
            <Input
              name="password"
              type="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              control={control}
              error={errors.password?.message}
              required={true}
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập xác nhận mật khẩu"
              control={control}
              error={errors.confirmPassword?.message}
              required={true}
            />
            <Button full={true} text="Đổi mật khẩu" type="submit" />
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
