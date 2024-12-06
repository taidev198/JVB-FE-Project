import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import validationSchemaAddStudent from '@/components/Admin/School/Student/validationAddStudent';
import Select from '@/components/Common/Select';
import Text from '@/components/Common/Text';

interface FormDataAddStudent {
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  gender?: string;
  phoneNumber: string;
  yearOfEnrollment: number;
  address: string;
  gpa: number;
  dateOfBirth: string;
  studentStatus?: string;
  majorId: number;
  province_id: number;
  district_id: number;
  ward_id: string;
}

const AddStudent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaAddStudent),
  });

  const onSubmit: SubmitHandler<FormDataAddStudent> = () => {};

  const [image, setImage] = useState<File | null>(null);

  return (
    <div className="bg-primary-white px-10">
      <div className="rounded-t-lg p-5">
        <Link href={'/admin/school/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm mới sinh viên </h1>
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
            {/* Email */}
            <Input type="email" name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />

            {/* Year Of Enrollment */}
            <Input
              type="number"
              name="fullName"
              label="Năm nhập học"
              placeholder="Nhập năm nhập học"
              control={control}
              error={errors.yearOfEnrollment?.message}
            />
            {/* Date Of Birth */}
            <Input type="date" name="dateOfBirth" label="Ngày sinh" placeholder="" control={control} error={errors.dateOfBirth?.message} />
            {/* GPA */}
            <Input type="number" name="gpa" label="Điểm GPA" placeholder="Nhập Điểm GPA" control={control} error={errors.gpa?.message} />
            {/* Student status */}
            <Select
              name="studentStatus"
              label="Trạng thái"
              control={control}
              options={[
                { value: 'IN_PROGRESS', label: 'Đang học' },
                { value: 'GRADUATED', label: 'Đã tốt nghiệp' },
                { value: 'DROPPED_OUT', label: 'Bỏ học' },
              ]}
              error={errors.studentStatus?.message}
            />
            {/* Major */}
            <Select
              name="majorId"
              label="Ngành"
              control={control}
              options={[
                { value: 1, label: 'Kinh tế' },
                { value: 2, label: 'Công nghệ thông tin' },
                { value: 3, label: 'Bỏ học' },
              ]}
              error={errors.majorId?.message}
            />
            {/* Gender */}
            <Select
              name="gender"
              label="Giới tính"
              control={control}
              options={[
                { value: 'FEMALE', label: 'Nữ' },
                { value: 'MALE', label: 'Nam' },
                { value: 'DROPPED_OUT', label: 'Khác' },
              ]}
              error={errors.gender?.message}
            />
            <Select
              name="province_id"
              label="Tỉnh/ Thành phố"
              control={control}
              options={[
                { value: 0, label: 'Chọn' },
                { value: 1, label: 'Health' },
                { value: 2, label: 'Finance' },
              ]}
              error={errors.province_id?.message}
            />
            <Select
              name="district_id"
              label="Quận/ Huyện"
              control={control}
              options={[
                { value: 0, label: 'Chọn' },
                { value: 1, label: 'Health' },
                { value: 2, label: 'Finance' },
              ]}
              error={errors.district_id?.message}
            />
            <Select
              name="ward_id"
              label="Xã/ Phường"
              control={control}
              options={[
                { value: 0, label: 'Chọn' },
                { value: 1, label: 'Health' },
                { value: 2, label: 'Finance' },
              ]}
              error={errors.ward_id?.message}
            />
            {/* Address */}
          </div>
          <Text type="text" name="address" label="Địa chỉ cụ thể" placeholder="Nhập địa chỉ cụ thể" control={control} error={errors.address?.message} />
        </div>

        <div className="ml-auto w-fit py-5">
          <Button text="Thêm sinh viên" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
