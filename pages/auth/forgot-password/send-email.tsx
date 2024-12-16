import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Input from '@/components/Common/Input';
import Logo from '@/components/Logo';
import { Button } from '@/components/Common/Button';
import { useGetOtpMutation } from '@/services/adminSystemApi';
import { setLoading } from '@/store/slices/global';
import { isFetchBaseQueryError, isErrorWithMessage } from '@/services/helpers';
interface FormDataForgot {
  email: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ')
    .required('Email không được bỏ trống')
    .max(50, 'Email không được quá 50 kí tự'),
});

const SendEmail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataForgot>({
    resolver: yupResolver(validationSchema),
  });
  const [getOtp, { isLoading }] = useGetOtpMutation();

  const onSubmit: SubmitHandler<FormDataForgot> = async formData => {
    try {
      const response = await getOtp({ email: formData.email }).unwrap();
      toast.success(response.message);
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string }).message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
        router.push({ pathname: '/auth/forgot-password/verify-my-account', query: { email: formData.email } });
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
        router.push({ pathname: '/auth/forgot-password/verify-my-account', query: { email: formData.email } });
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#fff]">
      <div className="max-w-[450px] p-8 shadow-xl">
        <div className="mx-auto w-fit">
          <Logo />
        </div>
        <div className="flex flex-col">
          <div className="mt-6">
            <h1 className="text-[22px] font-medium text-[#4B465C]">Quên mật khẩu? 🔒</h1>
            <p className="mt-[6px] text-[#4B465C]">Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <Input type="email" name="email" label="Email" placeholder="john.doe@gmail.com" control={control} error={errors.email?.message} required={true} />
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

export default SendEmail;
