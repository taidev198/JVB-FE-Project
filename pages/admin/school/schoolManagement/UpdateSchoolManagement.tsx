/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Text from '@/components/Common/Text';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
import SelectReact from '@/components/Common/SelectMui';
import { typeUniversity } from '@/utils/app/const';
import { useGetAllMajorsQuery, useGetDetailSchoolQuery, useUpdateSchoolMutation } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import validationSchemaUpdateSchool from '@/components/Admin/school/profileSchool/validationUpdateSchool';

interface FormDataAddStudent {
  universityName: string;
  email: string;
  logoUrl: string;
  universityCode: string;
  linkWebsite: string;
  universityDescription?: string;
  universityShortDescription?: string;
  phoneNumber: string;
  establishedDate: string | null;
  universityType: string;
  numberOfStudents: number;
  numberOfGraduates: number;
  wardId: number;
  houseNumber: string;
  provinceId: number;
  districtId: number;
}

const UpdateSchoolManagement = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaUpdateSchool),
  });
  const id = useAppSelector(state => state.global.id);
  const { data: detailSchool } = useGetDetailSchoolQuery();
  useEffect(() => {
    if (detailSchool?.data.logoUrl) {
      setImage(detailSchool?.data.logoUrl);
    }
  }, [detailSchool?.data.logoUrl]);
  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  const { data: majors } = useGetAllMajorsQuery();
  const [updateSchool, { isLoading }] = useUpdateSchoolMutation();
  console.log(detailSchool);
  const onSubmit: SubmitHandler<FormDataAddStudent> = async data => {
    const formData = new FormData();

    // Append dữ liệu JSON dưới dạng chuỗi
    const universityRequest = {
      universityCode: data.universityCode,
      universityName: data.universityName,
      email: data.email,
      establishedDate: data.establishedDate,
      linkWebsite: data.linkWebsite,
      universityDescription: data.universityDescription,
      universityShortDescription: data.universityShortDescription,
      numberOfGraduates: data.numberOfGraduates,
      numberOfStudents: data.numberOfStudents,
      universityType: data.universityType,
      address: {
        houseNumber: data.houseNumber,
        wardId: data.wardId,
      },
      phoneNumber: data.phoneNumber,
    };
    formData.append('universityRequest', new Blob([JSON.stringify(universityRequest)], { type: 'application/json' }));
    formData.append('file', image as File);

    try {
      const response = await updateSchool({ formData: formData }).unwrap();
      toast.success(response.message);
      router.push('/admin/school/schoolManagement');
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
    if (detailSchool?.data) {
      reset({
        universityCode: detailSchool?.data.universityCode,
        establishedDate: detailSchool?.data.establishedDate,
        universityName: detailSchool?.data.universityName,
        numberOfGraduates: detailSchool?.data.numberOfGraduates,
        numberOfStudents: detailSchool?.data.numberOfStudents,
        linkWebsite: detailSchool?.data.linkWebsite,
        universityType: detailSchool?.data.universityType,
        universityDescription: detailSchool?.data.universityDescription,
        universityShortDescription: detailSchool?.data.universityShortDescription,
        logoUrl: detailSchool?.data.logoUrl,
        email: detailSchool?.data.account.email,
        phoneNumber: detailSchool?.data.phoneNumber,
        houseNumber: detailSchool?.data.address.houseNumber,
        provinceId: detailSchool?.data?.address.province.id,
        districtId: detailSchool?.data?.address.district.id,
        wardId: detailSchool?.data?.address.ward.id,
      });
    }
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch, detailSchool?.data, reset]);

  return (
    <div className="bg-primary-white px-10">
      <div className="rounded-t-lg p-5">
        <Link href={'/admin/school/schoolManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật hồ sơ trường</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* Avatar */}
          <ImageUploaderOne image={image} setImage={setImage} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="universityCode"
              label="Mã trường"
              placeholder="Nhập mã trường"
              control={control}
              error={errors.universityCode?.message}
              disabled={true}
            />

            <Input
              type="text"
              name="universityName"
              label="Tên trường"
              placeholder="Nhập tên trường"
              control={control}
              error={errors.universityName?.message}
            />
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

            {/* Date Of Birth */}
            <Input type="date" name="establishedDate" label="Nhập năm thành lập" placeholder="Nhập ngày thành lập" control={control} />
            <Input type="url" name="linkWebsite" label="Link website" placeholder="Nhập link website" control={control} error={errors.linkWebsite?.message} />

            <Input
              type="number"
              name="numberOfStudents"
              label="Số lượng sinh viên"
              placeholder="Nhập số lượng sinh viên"
              control={control}
              error={errors.numberOfStudents?.message}
            />
            <Input
              type="number"
              name="numberOfGraduates"
              label="Số lượng sinh viên tốt nghiệp"
              placeholder="Nhập số lượng sinh viên tốt nghiệp"
              control={control}
              error={errors.numberOfGraduates?.message}
            />
            {/* Type school */}
            <>
              <SelectReact
                name="universityType"
                label="Loại trường"
                placeholder="Chọn loại trường"
                options={(typeUniversity || []).map(type => ({
                  value: type.value,
                  label: type.label,
                }))}
                control={control}
                error={errors.universityType?.message}
                disabled={true}
              />
            </>
            {/* Tỉnh */}
            <div>
              <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
                Tỉnh
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
                    getOptionLabel={(option: { provinceName: any }) => option.provinceName || ''}
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={provinces?.data?.find(option => option.id === field.value)}
                    ref={field.ref}
                  />
                )}
              />
              {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
            </div>

            {/* Chọn Huyện */}
            <div>
              <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
                Huyện
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
                    getOptionLabel={(option: { districtName: any }) => option.districtName || ''}
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={districts?.data?.find(option => option.id === field.value)}
                    ref={field.ref}
                  />
                )}
              />
              {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
            </div>

            {/* Chọn Xã */}
            <div>
              <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
                Xã
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
                    getOptionLabel={(option: { wardName: any }) => option.wardName || ''}
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={wards?.data?.find(option => option.id === Number(field.value))}
                    ref={field.ref}
                  />
                )}
              />
              {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
            </div>
          </div>
          <div className="mt-5">
            <Text
              type="text"
              name="houseNumber"
              label="Địa chỉ cụ thể"
              placeholder="Nhập địa chỉ cụ thể"
              control={control}
              error={errors.houseNumber?.message}
            />
          </div>
          <Text
            label="Mô tả hồ sơ trường "
            placeholder="Nhập mô tả hồ sơ trường"
            control={control}
            error={errors.universityDescription?.message}
            {...register('universityDescription')}
          />
          <Text
            label="Mô tả ngắn "
            placeholder="Nhập mô tả ngắn"
            control={control}
            error={errors.universityShortDescription?.message}
            {...register('universityShortDescription')}
          />
        </div>

        <Button text="Cập nhật" type="submit" />
      </form>
    </div>
  );
};

export default UpdateSchoolManagement;
