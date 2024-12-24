/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
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
import { useUpdateSchoolMutation} from '@/services/adminSchoolApi';
import { setId, setLoading } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import validationSchemaUpdateSchool from '@/components/Admin/school/profileSchool/validationUpdateSchool';
import { useGetDetailProfileQuery } from '@/services/adminCompanyApi';

interface FormDataProfile {
  companyCode: string;
  companyName: string;
  phoneNumber: string;
  linkWebsite: string;
  establishedDate: string;
  email: string;
  logoUrl: string;
  wardId: number;
  houseNumber: string;
  provinceId: number;
  districtId: number;
  fieldIds: number[];
  address: string;
  companyShortDescription: string;
  companyDescription: string;
  taxCode: string;
}

const UpdateProfileCompany = () => {
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
  } = useForm<FormDataProfile>({
    resolver: yupResolver(validationSchemaUpdateSchool),
  });
  console.log(errors);
  const id = useAppSelector(state => state.global.id);
  const { data: detailProfile } = useGetDetailProfileQuery();
  useEffect(() => {
    if (detailProfile?.data.logoUrl) {
      setImage(detailProfile?.data.logoUrl);
    }
  }, [detailProfile?.data.logoUrl]);
  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  // const { data: majors } = useGetAllMajorsQuery();
  const [updateProfile, { isLoading }] = useUpdateSchoolMutation();

  const onSubmit: SubmitHandler<FormDataProfile> = async data => {
    const formData = new FormData();

    // Append dữ liệu JSON dưới dạng chuỗi
    const profileRequest = {
      companyCode: detailProfile.data.companyCode,
      companyName: detailProfile.data.companyName,
      email: detailProfile.data.email,
      establishedDate: detailProfile.data.establishedDate,
      fieldIds: detailProfile.data.fields.map(fielId => fielId.id),
      linkWebsite: detailProfile.data.linkWebsite,
      companyDescription: detailProfile.data.companyDescription,
      companyShortDescription: detailProfile.data.companyShortDescription,
      taxCode: detailProfile.data.taxCode,
      address: {
        houseNumber: detailProfile.data.address.houseNumber,
        wardId: detailProfile.data.address.ward.id,
      },
      phoneNumber: detailProfile.data.phoneNumber,
    };

    console.log('detailProfile', detailProfile)
    
    formData.append('profileRequest', new Blob([JSON.stringify(profileRequest)], { type: 'application/json' }));
    formData.append('file', image as File);

    try {
      const response = await updateProfile({ formData: formData, id: id }).unwrap();
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
    if (detailProfile?.data) {
      reset({
        companyCode: detailProfile?.data.companyCode,
        establishedDate: detailProfile?.data.establishedDate,
        companyName: detailProfile?.data.companyName,
        taxCode: detailProfile?.data.taxCode,
        linkWebsite: detailProfile?.data.linkWebsite,
        companyDescription: detailProfile?.data.companyDescription,
        companyShortDescription: detailProfile?.data.companyShortDescription,
        logoUrl: detailProfile?.data.logoUrl,
        email: detailProfile?.data.email,
        phoneNumber: detailProfile?.data.phoneNumber,
        houseNumber: detailProfile?.data.address.houseNumber,
        provinceId: detailProfile?.data?.address.province.id,
        districtId: detailProfile?.data?.address.district.id,
        wardId: detailProfile?.data?.address.ward.id,
      });
    }
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch, detailProfile?.data, reset]);


  return (
    <div className="bg-primary-white p-5 rounded-lg">
     <div className="">
      <Link href={'/admin/company/profileCompany'}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      Trở về
      <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Chi tiết công ty </h1>
    </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* Avatar */}
          <ImageUploaderOne image={image} setImage={setImage} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="companyCode"
              label="Mã công ty"
              placeholder="Nhập mã công ty"
              control={control}
              error={errors.companyCode?.message}
              disabled={true}
            />

            <Input
              type="text"
              name="companyName"
              label="Tên công ty"
              placeholder="Nhập tên công ty"
              control={control}
              error={errors.companyName?.message}
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
              name="taxCode"
              label="Mã Code"
              placeholder="Nhập mã code"
              control={control}
              error={errors.taxCode?.message}
            />

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
          <Text type="text" name="houseNumber" label="Địa chỉ cụ thể" placeholder="Nhập địa chỉ cụ thể" control={control} error={errors.houseNumber?.message} />
          <Text
            label="Mô tả hồ sơ trường "
            placeholder="Nhập mô tả hồ sơ trường"
            control={control}
            error={errors.companyDescription?.message}
            {...register('companyDescription')}
          />
          <Text
            label="Mô tả ngắn "
            placeholder="Nhập mô tả ngắn"
            control={control}
            error={errors.companyShortDescription?.message}
            {...register('companyShortDescription')}
          />

          {/* Type fiels */}
          <>
            <li className="mt-4 mb-5 flex  gap-3 ">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span>
                Fields:
              </span>
              {detailProfile?.data.fields.map(field => (
                <Chip key={field.id} label={field.fieldName} color="primary" variant="outlined" style={{ fontSize: '14px' }} />
              ))}
            </div>
          </li>
            </>
        </div>

        
        <div className="ml-auto w-fit">
            <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileCompany;
