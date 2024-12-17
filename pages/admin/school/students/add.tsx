/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Text from '@/components/Common/Text';
import validationSchemaAddStudent from '@/components/Admin/school/Student/validationAddStudent';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
import SelectReact from '@/components/Common/SelectMui';
import { gender } from '@/utils/app/const';
import { useAddStudentMutation, useGetAllMajorsQuery } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface FormDataAddStudent {
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  gender: string;
  phoneNumber: string;
  yearOfEnrollment: number;
  houseNumber: string;
  gpa: number;
  dateOfBirth: string;
  studentStatus: string;
  majorId: number;
  provinceId: number;
  districtId: number;
  wardId: number;
}

const AddStudent = () => {
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaAddStudent),
    defaultValues: {
      yearOfEnrollment: undefined,
    },
  });

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  const { data: majors } = useGetAllMajorsQuery();
  const [addStudent, { isLoading }] = useAddStudentMutation();

  const onSubmit: SubmitHandler<FormDataAddStudent> = async data => {
    const formData = new FormData();

    // Append dữ liệu JSON dưới dạng chuỗi
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
      dateOfBirth: data.dateOfBirth,
      studentStatus: data.studentStatus,
      phoneNumber: data.phoneNumber,
      majorId: data.majorId,
    };

    // Chuyển đổi đối tượng studentRequest thành chuỗi JSON và append vào FormData
    formData.append('studentRequest', new Blob([JSON.stringify(studentRequest)], { type: 'application/json' }));
    // Append file vào FormData
    formData.append('file', image as File);
    try {
      const response = await addStudent(formData).unwrap();
      toast.success(response.messages);
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
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  return (
    <div className="bg-primary-white px-10">
      <div className="rounded-t-lg p-5">
        <Link href={'/admin/school/students'}>
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
            <Input
              type="text"
              name="studentCode"
              label="Mã sinh viên"
              placeholder="Nhập mã sinh viên"
              control={control}
              error={errors.studentCode?.message}
              required={true}
            />
            {/* Student name */}
            <Input
              type="text"
              name="fullName"
              label="Tên sinh viên"
              placeholder="Nhập tên sinh viên"
              control={control}
              error={errors.fullName?.message}
              required={true}
            />
            {/* Phone */}
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
              required={true}
            />
            {/* Email */}
            <Input type="email" name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} required={true} />
            {/* Year Of Enrollment */}
            <Input
              type="number"
              name="yearOfEnrollment"
              label="Năm nhập học"
              placeholder="Nhập năm nhập học"
              control={control}
              error={errors.yearOfEnrollment?.message}
              required={true}
            />
            {/* Date Of Birth */}
            <Input type="date" name="dateOfBirth" label="Ngày sinh" placeholder="" control={control} error={errors.dateOfBirth?.message} required={true} />
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
              required={true}
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
              required={true}
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
              error={errors.gender?.message}
              required={true}
            />

            {/* Tỉnh */}
            <div>
              <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
                Tỉnh <span className="text-red-600">*</span>
              </label>
              <Controller
                name="provinceId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Tỉnh/Thành phố"
                    isLoading={isLoadingProvinces}
                    options={provinces?.data || []}
                    getOptionLabel={(option: { provinceName: any }) => option.provinceName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={provinces?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                    ref={field.ref}
                  />
                )}
              />
              {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
            </div>

            {/* Chọn Huyện */}
            <div>
              <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
                Huyện <span className="text-red-600">*</span>
              </label>
              <Controller
                name="districtId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Quận/Huyện"
                    isLoading={isLoadingDistricts}
                    options={districts?.data || []}
                    getOptionLabel={(option: { districtName: any }) => option.districtName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={districts?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                    ref={field.ref}
                  />
                )}
              />
              {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
            </div>

            {/* Chọn Xã */}
            <div>
              <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
                Xã <span className="text-red-600">*</span>
              </label>
              <Controller
                name="wardId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Xã/Phường"
                    isLoading={isLoadingWard}
                    options={wards?.data || []}
                    getOptionLabel={(option: { wardName: any }) => option.wardName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={wards?.data?.find(option => option.id === Number(field.value))} // Giữ giá trị name (tên tỉnh) khi chọn
                    ref={field.ref}
                  />
                )}
              />
              {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
            </div>
          </div>
          <div className="mt-4">
            <Text
              type="text"
              name="houseNumber"
              label="Địa chỉ cụ thể"
              placeholder="Nhập địa chỉ cụ thể"
              control={control}
              error={errors.houseNumber?.message}
              required={true}
            />
          </div>
        </div>

        <div className="ml-auto w-fit py-5">
          <Button text="Thêm sinh viên" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
