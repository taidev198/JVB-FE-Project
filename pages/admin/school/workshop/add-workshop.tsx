/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { Button } from '@/components/Common/Button';
import addWorkshopSchema from '@/validation/addWorkshop';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import ImageUploader from '@/components/Common/ImageUploader';
import TextEditor from '@/components/Common/TextEditor';
import SelectReact from '@/components/Common/SelectMui';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
import { useAddWorkshopMutation, useGetAllFieldsQuery } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import Date from '@/components/Common/Date';
import { formatDate } from '@/utils/app/format';
import { setToast } from '@/store/slices/toastSlice';

interface FormDataWorkShop {
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  wardId: number;
  districtId: number;
  provinceId: number;
  houseNumber: string;
  agenda: string;
  fieldIds: number[];
}

const AddWorkshop = () => {
  const [image, setImage] = useState<File[]>([]);
  const router = useRouter();

  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataWorkShop>({
    resolver: yupResolver(addWorkshopSchema),
  });

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  watch('wardId');
  // Fetch data
  const { data: provinces, isLoading } = useGetAllProvincesQuery();
  const { data: districts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });
  const { data: faculties, isLoading: isLoadingFaculies } = useGetAllFieldsQuery();
  const [addWorkshop, { data, isLoading: isLoadingAddworksop, isSuccess }] = useAddWorkshopMutation();

  const onSubmit: SubmitHandler<FormDataWorkShop> = async data => {
    const formData = new FormData();

    formData.append('workshopTitle', data.workshopTitle);
    formData.append('workshopDescription', data.workshopDescription);
    formData.append('startTime', formatDate(data.startTime));
    formData.append('endTime', formatDate(data.endTime));
    formData.append('estimateCompanyParticipants', String(data.estimateCompanyParticipants));
    formData.append('agenda', data.agenda);
    formData.append('addressDetail', data.houseNumber);
    formData.append('wardId', String(data.wardId));
    formData.append('fieldIds', String(data.fieldIds));

    if (Array.isArray(image)) {
      image.forEach(file => {
        formData.append('imageWorkshops', file);
      });
    } else if (image) {
      formData.append('imageWorkshops', image);
    }

    try {
      await addWorkshop(formData);
      router.push('/admin/school/workshop');
    } catch (err) {
      // Handle lỗi
      console.error('Error creating workshop:', err);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data.message }));
    }
    dispatch(setLoading(isLoadingFaculies || isLoadingAddworksop));
  }, [dispatch, isLoadingFaculies, isLoadingAddworksop, data?.message, isSuccess]);

  return (
    <div className="">
      {/* Icon */}
      <div className="rounded-t-lg bg-white p-5">
        <Link href={'/admin/school/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm mới WorkShop </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Block 1 */}
        <div className="rounded-b-lg bg-primary-white p-5">
          <Input name="workshopTitle" control={control} error={errors.workshopTitle?.message} placeholder="Nhập tiêu đề Workshop" label="Tiêu đề Workshop" />
          <div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Date name="startTime" label="Thời gian bắt đầu" placeholder="Thời gian bắt đầu" control={control} error={errors.startTime?.message} />
              {/*  */}
              <Date name="endTime" label="Thời gian kết thúc" placeholder="Thời gian kết thúc" control={control} error={errors.endTime?.message} />
              {/*  */}
              <Input
                type="number"
                name="estimateCompanyParticipants"
                label="Số lượng công ty ước tính"
                placeholder="Nhập số lượng công ty ước tính"
                control={control}
                error={errors.estimateCompanyParticipants?.message}
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
            {/* workshopDescription */}
            <div className="mt-4">
              <Text name="workshopDescription" label="Mô tả" placeholder="Nhập mô tả" control={control} error={errors.workshopDescription?.message} />
            </div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 ">
          {/* Image */}
          <ImageUploader images={image} setImages={setImage} />
        </div>

        {/* Block 3 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5">
          {/* Lịch trình */}
          <Controller
            name="agenda"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Lịch trình" error={errors.agenda?.message} />
            )}
          />
        </div>

        {/* Block 4 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 sm:grid-cols-2">
          {/* Chọn tỉnh */}
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
                  isLoading={isLoading}
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
                  isLoading={isLoading}
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
                  isLoading={isLoading}
                  options={wards?.data || []}
                  getOptionLabel={(option: { wardName: any }) => option.wardName || ''} // Hiển thị tên tỉnh
                  getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                  onChange={(selectedOption: { id: any }) => {
                    field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                  }}
                  value={wards?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                  ref={field.ref}
                />
              )}
            />
            {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
          </div>
          <Input type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.houseNumber?.message} />
        </div>
        <div className="flex justify-end bg-primary-white p-5">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default AddWorkshop;
