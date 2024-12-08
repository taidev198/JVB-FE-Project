import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useChangePasswordMutation } from '@/services/adminSystemApi';
import { setToast } from '@/store/slices/toastSlice';

const validationSchema = Yup.object({
  oldPassword: Yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 8 ký tự'),
  newPassword: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  reNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

interface FormDataChangePassword {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}

const ChangePassword = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataChangePassword>({
    resolver: yupResolver(validationSchema),
  });

  const [changePassword, { data, isError, error, isSuccess }] = useChangePasswordMutation();

  const onSubmit: SubmitHandler<FormDataChangePassword> = data => {
    changePassword(data);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data?.message }));
    }
    if (isError) {
      dispatch(setToast({ message: error?.data.message, type: 'error' }));
    }
  }, [isError, dispatch, error?.data.message, isSuccess, data?.message]);

  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/dashboard'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <div className="mx-auto w-[35%] rounded-lg border border-solid border-[#ccc] p-8">
        <h1 className="mb-12 mt-1 text-center text-2xl font-bold">Đổi mật khẩu</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <Input
              type="password"
              name="oldPassword"
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              control={control}
              error={errors.oldPassword?.message}
              icon={<LockIcon />}
            />
            <Input
              type="password"
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              control={control}
              error={errors.newPassword?.message}
              icon={<LockIcon />}
            />
            <Input
              type="password"
              name="reNewPassword"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập xác nhận mật khẩu mới"
              control={control}
              error={errors.reNewPassword?.message}
              icon={<LockOpenIcon />}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button text="Đổi mật khẩu" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;
