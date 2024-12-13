/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Text from '@/components/Common/Text';
import ImageUploader from '@/components/Common/ImageUploader';
import TextEditor from '@/components/Common/TextEditor';
import Date from '@/components/Common/Date';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
import { useGetAllFieldsQuery, useGetDetailWorkshopQuery, useUpdateWorkshopMutation } from '@/services/adminSchoolApi';
import SelectReact from '@/components/Common/SelectMui';
import { setLoading } from '@/store/slices/global';
import { ImageWorkshops } from '@/types/workshop';
import updateWorkshopSchema from '@/validation/updateWorkshop';
import { formatDate } from '@/utils/app/format';
import { useAppSelector } from '@/store/hooks';

interface FormDataWorkShop {
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  wardId?: number | null; // Thêm null vào đây
  districtId?: number | null; // Thêm null vào đây
  provinceId?: number | null;
  houseNumber: string;
  agenda: string;
  fields: number[];
}

const UpdateWorkshop = () => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [idImageDelete, setIdImageDelete] = useState<number[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm<FormDataWorkShop>({
    resolver: yupResolver(updateWorkshopSchema),
  });
  const IdWorkshop = useAppSelector(state => state.global.id);

  const { data: workshop, isLoading: isLoadingDetailWorkshop } = useGetDetailWorkshopQuery({ id: IdWorkshop });
  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  watch('wardId');
  // Fetch data
  const { data: provinces, isLoading } = useGetAllProvincesQuery();
  const { data: districts } = useGetAllDistrictsQuery({ id: provinceSelect ?? null }, { skip: !provinceSelect });
  const { data: wards } = useGetAllWardsQuery({ id: districtSelect ?? null }, { skip: !districtSelect });
  const { data: faculties, isLoading: isLoadingFields } = useGetAllFieldsQuery();
  const [existingImageUrls, setExistingImageUrls] = useState<ImageWorkshops[]>([]);
  useEffect(() => {
    if (workshop?.data?.imageWorkshops) {
      setExistingImageUrls(workshop.data.imageWorkshops);
    }
  }, [workshop]);

  const [updateWorkshop] = useUpdateWorkshopMutation();
  const onSubmit: SubmitHandler<FormDataWorkShop> = async data => {
    const formData = new FormData();

    formData.append('workshopTitle', data.workshopTitle);
    formData.append('workshopDescription', data.workshopDescription);
    formData.append('startTime', formatDate(data?.startTime ? data?.startTime : ''));
    formData.append('endTime', formatDate(data?.endTime ? data?.endTime : ''));
    formData.append('estimateCompanyParticipants', String(data.estimateCompanyParticipants));
    formData.append('agenda', data.agenda);
    formData.append('addressDetail', data.houseNumber);
    formData.append('wardId', String(data.wardId));
    formData.append('fieldIds', String(data.fields));
    if (Array.isArray(newImages)) {
      newImages.forEach(file => {
        formData.append('imageNews', file);
      });
    } else if (newImages) {
      formData.append('imageNews', newImages);
    }
    formData.append('imageDeletes', String(idImageDelete));
    try {
      await updateWorkshop({ formData, id: IdWorkshop });
      router.push('/admin/school/workshop');
    } catch (err) {
      console.error('Error creating workshop:', err);
    }
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
  };

  // Hàm xử lý xóa ảnh đã lưu
  const handleRemoveExistingImage = (id: number) => {
    setExistingImageUrls(existingImageUrls.filter(image => image.id !== id));
    setIdImageDelete(prevIds => [...prevIds, id]);
  };

  useEffect(() => {
    if (workshop?.data) {
      reset({
        workshopTitle: workshop.data.workshopTitle,
        workshopDescription: workshop.data.workshopDescription,
        startTime: workshop.data.startTime,
        endTime: workshop.data.endTime,
        estimateCompanyParticipants: workshop.data.estimateCompanyParticipants,
        agenda: workshop.data.agenda,
        houseNumber: workshop.data.address.houseNumber,
        provinceId: workshop.data.address.province.id,
        districtId: workshop.data.address.district.id,
        wardId: workshop.data.address.ward.id,
        fields: workshop.data.fields.map(fields => fields.id),
      });
    }
    dispatch(setLoading(isLoadingFields || isLoadingDetailWorkshop));
  }, [dispatch, isLoadingDetailWorkshop, isLoadingFields, reset, workshop]);

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
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật WorkShop </h1>
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
              <SelectReact
                name="fields"
                label="Lĩn vực"
                placeholder="Chọn lĩnh vực"
                options={(faculties?.data || []).map(faculty => ({
                  value: faculty.id,
                  label: faculty.fieldName,
                }))}
                control={control}
                isMultiple={true}
                error={errors.fields?.message}
              />
            </div>
            <Input
              type="number"
              name="estimateCompanyParticipants"
              label="Số lượng công ty ước tính"
              placeholder="Nhập số lượng công ty ước tính"
              control={control}
              error={errors.estimateCompanyParticipants?.message}
            />
            {/* workshopDescription */}
            <div className="mt-4">
              <Text name="workshopDescription" label="Mô tả" placeholder="Nhập mô tả" control={control} error={errors.workshopDescription?.message} />
            </div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 ">
          {/* Image */}
          <ImageUploader images={newImages} setImages={setNewImages} existingImages={existingImageUrls} removeExistingImage={handleRemoveExistingImage} />
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
          {/* Address */}
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
                  getOptionLabel={(option: { provinceName: string }) => option.provinceName || ''} // Hiển thị tên tỉnh
                  getOptionValue={(option: { id: number }) => option.id} // Chỉ lưu id
                  onChange={(selectedOption: { id: number }) => {
                    // Nếu người dùng không chọn tỉnh mới, chọn tỉnh hiện tại
                    field.onChange(selectedOption ? selectedOption.id : workshop?.data.address.province.id);
                  }}
                  value={
                    provinces?.data?.find(option => option.id === getValues('provinceId')) ||
                    provinces?.data?.find(option => option.id === workshop?.data.address.province.id)
                  } // Giữ giá trị đã chọn, nếu không có giá trị chọn thì dùng tỉnh hiện tại
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
                    field.onChange(selectedOption ? selectedOption.id : workshop?.data.address.district.id); // Lưu id vào form
                  }}
                  value={districts?.data?.find(option => option.id === workshop?.data.address.district.id)} // Giữ giá trị name (tên tỉnh) khi chọn
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
                    field.onChange(selectedOption ? selectedOption.id : workshop?.data.address.ward.id); // Lưu id vào form
                  }}
                  value={wards?.data?.find(option => option.id === workshop?.data.address.ward.id)} // Giữ giá trị name (tên tỉnh) khi chọn
                />
              )}
            />
            {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
          </div>
          <Input type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.houseNumber?.message} />
        </div>

        <Button text="Cập nhật" type="submit" />
      </form>
    </div>
  );
};
export default UpdateWorkshop;
