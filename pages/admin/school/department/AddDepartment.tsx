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
import { setToast } from '@/store/slices/toastSlice';
import { setLoading } from '@/store/slices/global';

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
  const onSubmit: SubmitHandler<FormDataAddDepartment> = data => {
    // Thêm trường universityId vào data
    const updatedData = { ...data, universityId: 12 };

    // Gọi hàm addDepartment với dữ liệu mới
    addDepartment(updatedData);

    // Chuyển hướng tới trang department
    router.push('/admin/school/department');
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data.message }));
    }
    dispatch(setLoading(isLoadingAddDepartment));
  }, [dispatch, isLoadingAddDepartment, data?.message, isSuccess]);
  return (
    <div className="bg-primary-white">
      <div className="rounded-t-lg">
        <Link href={'/admin/school/department'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="ml-5 mr-10 w-full bg-primary-white px-5 sm:px-0  ">
        {/* Icon */}

        <h1 className="my-10 text-2xl font-bold "> Thêm mới khoa</h1>
        <div className="mr-5 grid grid-cols-1 gap-4 bg-primary-white sm:grid-cols-2">
          {/* Các trường thông tin khác */}

          <Input type="text" name="facultyCode" label="Mã khoa" placeholder="Nhập mã khoa" control={control} error={errors.facultyCode?.message} />
          <Input type="text" name="facultyName" label="Tên Khoa" placeholder="Nhập tên khoa" control={control} error={errors.facultyName?.message} />
          <Input
            type="number"
            name="establishYear"
            label="Năm thành lập"
            placeholder="Nhập năm thành lập"
            control={control}
            error={errors.establishYear?.message}
          />
          <Input type="text" name="nameDean" label="Tên trưởng khoa" placeholder="Nhập tên trưởng khoa" control={control} error={errors.nameDean?.message} />
        </div>
        <div className="mr-5 ">
          <Input type="text" name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} error={errors.address?.message} />
          <Text name="facultyDescription" label="Mô tả khoa" placeholder="Nhập mô tả khoa" control={control} />

          <Button text="Thêm " full={true} type="submit" />
        </div>
      </form>
    </div>
  );
};
export default AddDepartment;
