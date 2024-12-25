import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import validationSchemaAddDepartment from '../../../../components/Admin/school/Department/validationAddDepartment';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import { useAddDepartmentMutation } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface FormDataAddDepartment {
  facultyCode: string;
  facultyName: string;
  establishYear: number;
  nameDean: string;
  address: string;
  facultyDescription?: string;
}
const AddDepartment = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddDepartment>({
    resolver: yupResolver(validationSchemaAddDepartment),
  });
  const [addDepartment, { data, isLoading: isLoadingAddDepartment, isSuccess }] = useAddDepartmentMutation();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormDataAddDepartment> = async data => {
    const updatedData = { ...data, universityId: 12 };
    try {
      await addDepartment(updatedData).unwrap();
      toast.success('Thêm khoa thành công');
      router.push('/admin/school/department');
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
    dispatch(setLoading(isLoadingAddDepartment));
  }, [dispatch, isLoadingAddDepartment, data?.message, isSuccess]);
  return (
    <div className="h h-screen rounded-lg bg-primary-white">
      <div className="p-5">
        <Link href={'/admin/school/department'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm mới khoa </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-primary-white px-5">
        {/* Icon */}
        <div className="grid grid-cols-1 gap-4 bg-primary-white sm:grid-cols-2">
          
          <Input
            type="text"
            name="facultyCode"
            label="Mã khoa"
            placeholder="Nhập mã khoa"
            control={control}
            error={errors.facultyCode?.message}
            required={true}
          />
          <Input
            type="text"
            name="facultyName"
            label="Tên Khoa"
            placeholder="Nhập tên khoa"
            control={control}
            error={errors.facultyName?.message}
            required={true}
          />
          <Input
            type="number"
            name="establishYear"
            label="Năm thành lập"
            placeholder="Nhập năm thành lập"
            control={control}
            error={errors.establishYear?.message}
          />
          <Input
            type="text"
            name="nameDean"
            label="Tên trưởng khoa"
            placeholder="Nhập tên trưởng khoa"
            control={control}
            error={errors.nameDean?.message}
            required={true}
          />
        </div>
        <div className="mt-5 flex flex-col gap-5">
          <Input type="text" name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} error={errors.address?.message} required={true} />
          <Text name="facultyDescription" label="Mô tả khoa" placeholder="Nhập mô tả khoa" control={control} error={errors.facultyDescription?.message} />
        </div>
        <div className="ml-auto w-fit ">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default AddDepartment;
