'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from '@mui/material';
import toast from 'react-hot-toast';

import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import AuthLayout from '@/layouts/AuthLayout';
import { useLoginMutation } from '@/services/adminSystemApi';
import { useAppDispatch } from '@/store/hooks';
import { logIn } from '@/store/slices/user';
import { setLoading } from '@/store/slices/global';
import { roles } from '@/utils/app/const';

interface FormDataLogin {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email không được bỏ trống')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ')
    .max(255, 'Email không được quá 255 kí tự'),
  password: Yup.string().required('Mật khẩu không được bỏ trống'),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(validationSchema) as Resolver<FormDataLogin>,
  });
  const [login, { isLoading, isSuccess, data, isError }] = useLoginMutation();

  const onSubmit: SubmitHandler<FormDataLogin> = async data => {
    try {
      const response = await login(data).unwrap();
      toast.success(response?.message);
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (isSuccess) {
      dispatch(
        logIn({
          token: data.data.token,
          name: data.data.user.fullName || data.data.user.companyName || data.data.user.universityName,
          id: data.data.user.id,
          logoUrl: data.data?.user.logoUrl ? data.data?.user.logoUrl : '',
          idAccount: data.data.user.account.id,
          roleAccount: data.data.roleAccount,
          address: data.data?.user?.address,
        })
      );
      switch (data?.data.roleAccount) {
        case roles.ADMIN:
          router.push('/admin/system/dashboard');
          break;
        case roles.COMPANY:
          router.push('/admin/company/dashboard');
          break;
        case roles.UNIVERSITY:
          router.push('/admin/school/dashboard');
          break;
        default:
          break;
      }
    }
  }, [isSuccess, isError, data?.data, dispatch, isLoading, router]);

  return (
    <AuthLayout type="login">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <h1 className="my-6 text-2xl font-bold">Đăng nhập</h1>
        <div className="border p-5 shadow">
          <div className="flex flex-col gap-4 rounded-lg ">
            <Input name="email" label="Email" placeholder="Nhập email" control={control} error={errors.email?.message} required={true} />

            <Input
              type="password"
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              control={control}
              error={errors.password?.message}
              required={true}
            />
          </div>
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-password" color="success" size="small" className="!p-0" />
                <label htmlFor="remember-password" className="cursor-pointer text-sm">
                  Nhớ mật khẩu
                </label>
              </div>
              <Link href={'/auth/forgot-password/send-email'} className="text-sm text-primary-main">
                Quên mật khẩu ?
              </Link>
            </div>
            <Button text="Đăng nhập" full={true} type="submit" />
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
