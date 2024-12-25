/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Text from '@/components/Common/Text';
import SelectReact from '@/components/Common/SelectMui';
import { typeUniversity } from '@/utils/app/const';
import { useGetDetailSchoolQuery, useUpdateSchoolMutation } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import validationSchemaUpdateSchool from '@/components/Admin/school/profileSchool/validationUpdateSchool';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';
import TextEditor from '@/components/Common/TextEditor';

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
  const methods = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaUpdateSchool),
    mode: 'onChange',
    defaultValues: {
      wardId: null,
      districtId: null,
      provinceId: null,
    },
  });
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const { data: detailSchool } = useGetDetailSchoolQuery();
  useEffect(() => {
    if (detailSchool?.data.logoUrl) {
      setImage(detailSchool?.data.logoUrl);
    }
  }, [detailSchool?.data.logoUrl]);
  const [updateSchool, { isLoading }] = useUpdateSchoolMutation();
  console.log(detailSchool);
  const onSubmit: SubmitHandler<FormDataAddStudent> = async data => {
    const formData = new FormData();
    const universityRequest = {
      universityCode: data.universityCode,
      universityName: data.universityName,
      email: data.email,
      establishedDate: formatDateDd_MM_yyyy(data.establishedDate),
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
      await updateSchool({ formData: formData }).unwrap();
      toast.success('Sửa hồ sơ trường thành công');
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
        establishedDate: detailSchool?.data.establishedDate ? dayjs(detailSchool?.data.establishedDate, 'DD/MM/YYYY') : null,
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
    <div className=" bg-primary-white px-10">
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
              required={true}
            />

            <Input
              type="text"
              name="universityName"
              label="Tên trường"
              placeholder="Nhập tên trường"
              control={control}
              error={errors.universityName?.message}
              required={true}
              disabled={true}
            />

            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
              required={true}
            />

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Nhập Email"
              control={control}
              error={errors.email?.message}
              required={true}
              disabled={true}
            />
            <DateComponent
              name="establishedDate"
              control={control}
              error={errors.establishedDate?.message}
              placeholder={'Nhập ngày thành lập'}
              label={'Ngày thàng lập'}
              required={true}
            />
            <Input type="url" name="linkWebsite" label="Link website" placeholder="Nhập link website" control={control} error={errors.linkWebsite?.message} />

            <Input
              type="number"
              name="numberOfStudents"
              label="Số lượng sinh viên"
              placeholder="Nhập số lượng sinh viên"
              control={control}
              error={errors.numberOfStudents?.message}
              required={true}
            />
            <Input
              type="number"
              name="numberOfGraduates"
              label="Số lượng sinh viên tốt nghiệp"
              placeholder="Nhập số lượng sinh viên tốt nghiệp"
              control={control}
              error={errors.numberOfGraduates?.message}
              required={true}
            />
          </div>

          <FormProvider {...methods}>
            <Address
              control={methods.control}
              districtName="districtId"
              provinceName="provinceId"
              wardName="wardId"
              errorDistrict={errors.districtId?.message}
              errorProvince={errors.provinceId?.message}
              errorWard={errors.wardId?.message}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="text"
                name="houseNumber"
                label="Số nhà, đường"
                placeholder="Nhập số nhà, đường"
                control={control}
                error={errors.houseNumber?.message}
                required={true}
              />
            </Address>
          </FormProvider>

          <div className="mt-[16px]">
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
              required={true}
              disabled={true}
            />
          </div>
          <div className="mt-[16px]">
            
            <Controller
              name="universityDescription"
              control={control}
              {...register('universityDescription')}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Nhập mô tả hồ sơ trường"
                  error={errors.universityDescription?.message}
                  required={true}
                />
              )}
            />
          </div>
        </div>
        <Text
          label="Mô tả ngắn "
          placeholder="Nhập mô tả ngắn"
          control={control}
          error={errors.universityShortDescription?.message}
          {...register('universityShortDescription')}
          required={true}
        />

        <div className="ml-auto w-fit">
          {' '}
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateSchoolManagement;
