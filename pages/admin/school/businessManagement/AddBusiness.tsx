import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import validationSchemaAddBusiness from '../../../../components/Admin/school/Business/validationAddBusiness';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import Select from '@/components/Common/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setBackdrop, setLoading } from '@/store/slices/global';
import SelectMui from '@/components/Common/SelectMui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { setToast } from '@/store/slices/toastSlice';
import SelectReact from '@/components/Common/SelectMui';
import { useAddBusinessMutation, useAddDepartmentMutation, useGetAllFieldsQuery, useGetAllMajorByQuery } from '@/services/adminSchoolApi';
import Link from 'next/link';
import { Faculty } from '@/types';
import { log } from 'console';

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
    defaultValues: {},
  });
  const { data: majores, isLoading: isLoadingMajor } = useGetAllMajorByQuery();
  const [addBusiness, { data, isLoading: isLoadingAddBusiness, isSuccess }] = useAddBusinessMutation();
  const router = useRouter();
  console.log(errors);
  const { data: faculties, isLoading: isLoadingFaculies } = useGetAllFieldsQuery();
  const onSubmit: SubmitHandler<FormDataAddBusiness> = data => {
    console.log({ data });

    addBusiness(data);
    router.push('/admin/school/businessManagement');
  };
  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data.message }));
    }
    dispatch(setLoading(isLoadingMajor || isLoadingAddBusiness || isLoadingFaculies));
  }, [dispatch, isLoadingAddBusiness, isLoadingMajor, isLoadingFaculies, data?.message, isSuccess]);

  return (
    <div className="bg-primary-white p-6">
      <div className="rounded-t-lg bg-white p-5">
        <Link href={'/admin/school/businessManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-primary-white px-5 sm:px-0 ">
        <h1 className="my-10 ml-5  text-2xl font-bold"> Thêm mới ngành học</h1>
        <div className="ml-5 mr-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <SelectReact
            name="facultyId"
            label="Khoa"
            placeholder="Chọn khoa"
            options={(majores?.data || []).map(major => ({
              value: major.id,
              label: major.facultyName,
            }))}
            control={control}
            isMultiple={true}
            error={errors.facultyId?.message}
          />
          <SelectReact
            name="fieldIds"
            label="Lĩnh vực"
            placeholder="Chọn lĩnh vực"
            options={(faculties?.data || []).map(faculty => ({
              value: faculty.id,
              label: faculty.fieldName,
            }))}
            control={control}
            isMultiple={true}
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
