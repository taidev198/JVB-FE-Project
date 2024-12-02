import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import validationSchemaAddBusiness from './validationAddBusiness';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import Select from '@/components/Common/Select';

import { setBackdrop } from '@/store/slices/global';
import SelectMui from '@/components/Common/SelectMui';

interface FormDataAddBusiness {
  majorCode: string;
  majorName: string;
  creditRequirement: number;
  majorDescription?: string;
  numberOfStudents: number;
  facultyId: number;
  fieldIds: number[];
}

const AddBussiness = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddBusiness>({
    resolver: yupResolver(validationSchemaAddBusiness),
    defaultValues: {
      fieldIds: [], // Đảm bảo fieldIds là một mảng rỗng ban đầu
    },
  });

  const onSubmit: SubmitHandler<FormDataAddBusiness> = () => {};

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold"> Thêm mới ngành học</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Các trường thông tin khác */}

          <Input type="text" name="majorCode" label="Mã ngành học" placeholder="Nhập mã ngành học" control={control} error={errors.majorCode?.message} />
          <Input type="text" name="majorName" label="Tên ngành học" placeholder="Nhập tên ngành học" control={control} error={errors.majorName?.message} />
          <Input
            type="number"
            name="creditRequirement"
            label="Số tín chỉ"
            placeholder="Nhập số tín chỉ ngành học"
            control={control}
            error={errors.creditRequirement?.message}
          />

          <Input
            type="number"
            name="numberOfStudents"
            label="Số lượng sinh viên"
            placeholder="Nhập số lượng sinh viên"
            control={control}
            error={errors.numberOfStudents?.message}
          />
          <Select
            name="facultyId"
            label="Khoa"
            control={control}
            options={[
              { value: '0', label: 'Chọn' },
              { value: '3', label: 'CNTT' },
              { value: '4', label: 'TKDH' },
              { value: '5', label: 'TY' },
            ]}
            error={errors.facultyId?.message}
          />
          <SelectMui
            name="fieldIds"
            label="Lĩnh vực"
            control={control}
            options={[
              { value: 1, label: 'Kỹ thuật phần mềm' },
              { value: 2, label: 'Hệ thống thông tin' },
              { value: 3, label: 'Mạng máy tính' },
              { value: 4, label: 'Trí tuệ nhân tạo' },
            ]}
            isMultiple={true} // Bật chế độ chọn nhiều
            error={errors.fieldIds?.message}
          />
        </div>
        <Text name="majorDescription" label="Mô tả ngành học" placeholder="Nhập mô tả ngành học" control={control} error={errors.majorDescription?.message} />
        <Button text="Thêm " full={true} type="submit" />
      </form>
    </div>
  );
};
export default AddBussiness;
