/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Text from '@/components/Common/Text';
import validationSchemaAddStudent from '@/components/Admin/school/Student/validationAddStudent';
import SelectReact from '@/components/Common/SelectMui';
import { gender } from '@/utils/app/const';
import { useGetAllMajorsQuery, useGetDetailStudentQuery, useUpdateStudentMutation } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';

interface FormDataAddStudent {
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  gender: string | null;
  phoneNumber: string;
  yearOfEnrollment: number;
  houseNumber: string;
  gpa: number;
  dateOfBirth: string | null;
  studentStatus: string;
  majorId: number;
  provinceId: number;
  districtId: number;
  wardId: number;
}

const UpdateStudent = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const methods = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaAddStudent),
    mode: 'onChange',
    defaultValues: {
      wardId: null,
      districtId: null,
      provinceId: null,
    },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const id = useAppSelector(state => state.global.id);
  const { data: detailStudent } = useGetDetailStudentQuery({ id });
  useEffect(() => {
    if (detailStudent?.data.avatarUrl) {
      setImage(detailStudent?.data.avatarUrl);
    }
  }, [detailStudent?.data.avatarUrl]);

  const { data: majors } = useGetAllMajorsQuery();
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();
  const onSubmit: SubmitHandler<FormDataAddStudent> = async data => {
    const formData = new FormData();
    const studentRequest = {
      studentCode: data.studentCode,
      fullName: data.fullName,
      email: data.email,
      gender: data.gender,
      yearOfEnrollment: data.yearOfEnrollment,
      addressRequest: {
        houseNumber: data.houseNumber,
        wardId: data.wardId,
      },
      gpa: data.gpa,
      dateOfBirth: formatDateDd_MM_yyyy(data.dateOfBirth),
      studentStatus: data.studentStatus,
      phoneNumber: data.phoneNumber,
      majorId: data.majorId,
    };
    formData.append('studentRequest', new Blob([JSON.stringify(studentRequest)], { type: 'application/json' }));
    formData.append('file', image as File);

    try {
      await updateStudent({ formData: formData, id: id }).unwrap();
      await toast.success('Cập nhật thông tin thành công');
      router.push('/admin/school/students');
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
    if (detailStudent?.data) {
      reset({
        studentCode: detailStudent?.data.studentCode,
        fullName: detailStudent?.data.fullName,
        avatarUrl: detailStudent?.data.avatarUrl,
        email: detailStudent?.data.email,
        gender: detailStudent?.data.gender,
        phoneNumber: detailStudent?.data.phoneNumber,
        yearOfEnrollment: detailStudent?.data.yearOfEnrollment,
        houseNumber: detailStudent?.data.address.houseNumber,
        gpa: detailStudent?.data.gpa,
        dateOfBirth: detailStudent?.data.dateOfBirth ? dayjs(detailStudent?.data.dateOfBirth, 'DD/MM/YYYY') : null,
        studentStatus: detailStudent?.data.studentStatus,
        majorId: detailStudent?.data.major.id,
        provinceId: detailStudent?.data?.address.province.id,
        districtId: detailStudent?.data?.address.district.id,
        wardId: detailStudent?.data?.address.ward.id,
      });
    }
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch, detailStudent?.data, reset]);

  return (
    <div className="bg-primary-white px-10">
      <div className="rounded-t-lg py-5">
        <Link href={'/admin/school/students'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật sinh viên</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* Avatar */}
          <ImageUploaderOne image={image} setImage={setImage} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Student Code */}
            <Input type="text" name="studentCode" label="Mã sinh viên" placeholder="Nhập mã sinh viên" control={control} error={errors.studentCode?.message} />
            {/* Student name */}
            <Input type="text" name="fullName" label="Tên sinh viên" placeholder="Nhập tên sinh viên" control={control} error={errors.fullName?.message} />
            {/* Phone */}
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
            />
            {/* Email */}
            <Input type="email" name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
            {/* Year Of Enrollment */}
            <Input
              type="number"
              name="yearOfEnrollment"
              label="Năm nhập học"
              placeholder="Nhập năm nhập học"
              control={control}
              error={errors.yearOfEnrollment?.message}
            />
            {/* Date Of Birth */}
            <DateComponent
              name="dateOfBirth"
              control={control}
              error={errors.dateOfBirth?.message}
              placeholder={'Nhập ngày sinh'}
              label={'Ngày sinh'}
              required={true}
            />
            {/* GPA */}
            <Input type="number" name="gpa" label="Điểm GPA" placeholder="Nhập Điểm GPA" control={control} error={errors.gpa?.message} />
            {/* Student status */}
            <SelectReact
              name="studentStatus"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={[
                { value: 'IN_PROGRESS', label: 'Đang học' },
                { value: 'GRADUATED', label: 'Đã tốt nghiệp' },
                { value: 'DROPPED_OUT', label: 'Bỏ học' },
              ]}
              control={control}
              error={errors.studentStatus?.message}
            />
            {/* Major */}
            <SelectReact
              name="majorId"
              label="Ngành học"
              placeholder="Chọn ngành học"
              options={(majors?.data || []).map(major => ({
                value: major.id,
                label: major.majorName,
              }))}
              control={control}
              error={errors.majorId?.message}
            />
            {/* Gender */}
            <SelectReact
              name="gender"
              label="Giới tính"
              placeholder="Chọn giới tính"
              options={gender.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              control={control}
            />
          </div>
          {/* Address */}
          <FormProvider {...methods}>
            <Address
              control={methods.control}
              districtName="districtId"
              provinceName="provinceId"
              wardName="wardId"
              errorDistrict={errors.districtId?.message}
              errorProvince={errors.provinceId?.message}
              errorWard={errors.wardId?.message}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"></Address>
          </FormProvider>{' '}
          <Text type="text" name="houseNumber" label="Địa chỉ cụ thể" placeholder="Nhập địa chỉ cụ thể" control={control} error={errors.houseNumber?.message} />
        </div>

        <div className="ml-auto w-fit py-5">
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;
