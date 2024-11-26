/* eslint-disable no-console */
'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import AuthLayout from '@/layouts/AuthLayout';

interface FormDataLogin {
  password: string;
  email: string;
}

// Đưa validationSchema lên trước
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ')
    .required('Email không được bỏ trống')
    .max(50, 'Email không được quá 50 kí tự'),
  password: Yup.string()
    .required('Mật khẩu không được bỏ trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormDataLogin> = data => {
    console.log(data);
  };

  return (
    <AuthLayout type="login">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <h1 className="my-10 text-2xl font-bold">Đăng nhập</h1>
        <Input name="email" label="Email" placeholder="Enter your Email" control={control} error={errors.email?.message} />
        <Input type="password" name="password" label="Password" placeholder="Enter your Password" control={control} error={errors.password?.message} />
        <Button text="Đăng nhập" full={true} type="submit" />
      </form>
    </AuthLayout>
  );
};

export default Login;
