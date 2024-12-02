import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import validationSchemaAddDepartment from './validationAddDepartment';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import { setBackdrop } from '@/store/slices/global';

interface FormDataAddDepartment {
  facultyCode: string;
  facultyName: string;
  establishYear: string;
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

  const onSubmit: SubmitHandler<FormDataAddDepartment> = () => {
    // const { confirm_password, ...payload } = data;
    // console.log({ payload });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold"> Thêm mới khoa</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Các trường thông tin khác */}

          <Input type="text" name="facultyCode" label="Mã khoa" placeholder="Nhập mã khoa" control={control} error={errors.facultyCode?.message} />
          <Input type="text" name="facultyName" label="Tên Khoa" placeholder="Nhập tên khoa" control={control} error={errors.facultyName?.message} />
          <Input type="date" name="establishYear" label="Năm thành lập" placeholder="Năm thành lập" control={control} error={errors.establishYear?.message} />
          <Input type="text" name="nameDean" label="Tên trưởng khoa" placeholder="Nhập tên trưởng khoa" control={control} error={errors.nameDean?.message} />
        </div>
        <Input type="text" name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} error={errors.address?.message} />
        <Text name="facultyDescription" label="Mô tả khoa" placeholder="Nhập mô tả khoa" control={control} />
        <Button text="Thêm " full={true} type="submit" />
      </form>
    </div>
  );
};
export default AddDepartment;
