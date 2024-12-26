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
import { setLoading } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import DateComponent from '@/components/Common/DateComponent';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';
import validationUpdateCompany from '@/validation/companyEmployee/validationUpdateCompany';
import { useGetDetailProfileQuery, useUpdateProfileMutation } from '@/services/adminCompanyApi';
import Address from '@/components/Common/Address';
import TextEditor from '@/components/Common/TextEditor';
import SelectReact from '@/components/Common/SelectMui';
import { useGetAllFieldsQuery } from '@/services/adminSchoolApi';

interface FormDataProfile {
  companyCode: string;
  companyName: string;
  logoUrl: string;
  linkWebsite: string;
  phoneNumber: string;
  establishedDate: string | null;
  email: string;
  wardId: number;
  houseNumber: string;
  provinceId: number;
  districtId: number;
  address: string;
  taxCode: string;
  quantityEmployee: number;
  companyDescription: string;
  companyShortDescription: string;
  fieldIds: number[];
}

const UpdateSchoolManagement = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const methods = useForm<FormDataProfile>({
    resolver: yupResolver(validationUpdateCompany),
    mode: 'onChange',
    defaultValues: {
      wardId: null,
      districtId: null,
      provinceId: null,
    },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const { data: detailCompany } = useGetDetailProfileQuery();
  useEffect(() => {
    if (detailCompany?.data.logoUrl) {
      setImage(detailCompany?.data.logoUrl);
    }
  }, [detailCompany?.data.logoUrl]);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const onSubmit: SubmitHandler<FormDataProfile> = async data => {
    const formData = new FormData();
    const companyRequest = {
      companyCode: data.companyCode,
      companyName: data.companyName,
      email: data.email,
      establishedDate: formatDateDd_MM_yyyy(data.establishedDate),
      linkWebsite: data.linkWebsite,
      companyDescription: data.companyDescription,
      companyShortDescription: data.companyShortDescription,
      quantityEmployee: data.quantityEmployee,
      address: {
        houseNumber: data.houseNumber,
        wardId: data.wardId,
      },
      phoneNumber: data.phoneNumber,
      fieldIds: data.fieldIds,
      taxCode: data.taxCode,
    };
    formData.append('companyRequest', new Blob([JSON.stringify(companyRequest)], { type: 'application/json' }));
    formData.append('file', image as File);

    try {
      const response = await updateProfile({ formData: formData }).unwrap();
      toast.success(response.message);
      router.push('/admin/company/profileCompany');
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
    if (detailCompany?.data) {
      reset({
        companyCode: detailCompany?.data.companyCode,
        establishedDate: detailCompany?.data.establishedDate ? dayjs(detailCompany?.data.establishedDate, 'DD/MM/YYYY') : null,
        companyName: detailCompany?.data.companyName,
        linkWebsite: detailCompany?.data.linkWebsite,
        quantityEmployee: detailCompany?.data.quantityEmployee,
        companyDescription: detailCompany?.data.companyDescription,
        companyShortDescription: detailCompany?.data.companyShortDescription,
        logoUrl: detailCompany?.data.logoUrl,
        email: detailCompany?.data.account.email,
        phoneNumber: detailCompany?.data.phoneNumber,
        houseNumber: detailCompany?.data.address.houseNumber,
        provinceId: detailCompany?.data?.address.province.id,
        districtId: detailCompany?.data?.address.district.id,
        wardId: detailCompany?.data?.address.ward.id,
        taxCode: detailCompany?.data?.taxCode,
        fieldIds: detailCompany.data.fields?.map(field => field.id),
      });
    }
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch, detailCompany?.data, reset]);

  const { data: faculties } = useGetAllFieldsQuery();

  return (
    <div className="bg-primary-white px-10">
      <div className="rounded-t-lg py-5">
        <Link href={'/admin/company/profileCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật hồ sơ công ty</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Avatar */}
        <ImageUploaderOne image={image} setImage={setImage} />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input type="text" name="companyCode" label="Mã công ty" placeholder="Nhập mã công ty" control={control} disabled={true} required={true} />

          <Input type="text" name="companyName" label="Tên công ty" placeholder="Nhập tên công ty" control={control} required={true} disabled={true} />
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
          <Input type="email" name="email" label="Email" placeholder="Nhập Email" control={control} required={true} disabled={true} />

          {/* Date Of Birth */}
          <DateComponent
            name="establishedDate"
            control={control}
            error={errors.establishedDate?.message}
            placeholder={'Nhập ngày thành lập'}
            label={'Ngày thành lập'}
            required={true}
          />
          <Input type="url" name="linkWebsite" label="Link website" placeholder="Nhập link website" control={control} error={errors.linkWebsite?.message} />

          <Input
            type="number"
            name="quantityEmployee"
            label="Quy mô công ty"
            placeholder="Nhập số lượng nhân viên"
            control={control}
            error={errors.quantityEmployee?.message}
            required={true}
          />

          <Input
            type="string"
            name="taxCode"
            label="Mã số thuế"
            placeholder="Nhập mã số thuế"
            control={control}
            error={errors.taxCode?.message}
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
        <div className="mt-4">
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
            required={true}
          />
        </div>
        <div className="mt-[16px] flex flex-col gap-4">
          <>
            <Controller
              name="companyDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Mô tả chi tiết"
                  error={errors.companyDescription?.message}
                  required={true}
                />
              )}
            />
          </>
          <>
            <Controller
              name="companyShortDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Mô tả ngắn"
                  error={errors.companyShortDescription?.message}
                  required={true}
                />
              )}
            />
          </>
        </div>
        <div className="ml-auto w-fit py-4">
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateSchoolManagement;
