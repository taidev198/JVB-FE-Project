/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploader from '@/components/Common/ImageUploader';
import TextEditor from '@/components/Common/TextEditor';
import { useGetAllFieldsQuery, useGetDetailWorkshopQuery, useUpdateWorkshopMutation } from '@/services/adminSchoolApi';
import SelectReact from '@/components/Common/SelectMui';
import { setLoading } from '@/store/slices/global';
import { ImageWorkshops } from '@/types/workshop';
import updateWorkshopSchema from '@/validation/updateWorkshop';
import { formatDateWorkshop } from '@/utils/app/format';
import { useAppSelector } from '@/store/hooks';
import DateComponent from '@/components/Common/DateComponent';
import Address from '@/components/Common/Address';

interface FormDataWorkShop {
  workshopTitle: string;
  workshopDescription: string;
  startTime: Dayjs | string;
  endTime: Dayjs | string;
  estimateCompanyParticipants: number;
  wardId?: number | null;
  districtId?: number | null;
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

  const methods = useForm<FormDataWorkShop>({
    resolver: yupResolver(updateWorkshopSchema),
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

  const IdWorkshop = useAppSelector(state => state.global.id);

  const { data: workshop, isLoading: isLoadingDetailWorkshop } = useGetDetailWorkshopQuery({ id: IdWorkshop });

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

    const startTime = dayjs(data?.startTime);
    const endTime = dayjs(data?.endTime);

    if (!startTime.isValid()) {
      console.error('startTime is invalid');
    }

    if (!endTime.isValid()) {
      console.error('endTime is invalid');
    }

    formData.append('workshopTitle', data.workshopTitle);
    formData.append('workshopDescription', data.workshopDescription);
    // Chuyển đổi dayjs thành chuỗi trước khi append vào formData
    formData.append('startTime', formatDateWorkshop(data.startTime));
    formData.append('endTime', formatDateWorkshop(data.endTime));
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
        startTime: workshop.data.startTime ? dayjs(workshop.data.startTime, 'DD/MM/YYYY HH:mm:ss') : null,
        endTime: workshop.data.endTime ? dayjs(workshop.data.endTime, 'DD/MM/YYYY HH:mm:ss') : null,
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
              <DateComponent
                showTime={true}
                name="startTime"
                label="Thời gian bắt đầu"
                placeholder="Thời gian bắt đầu"
                control={control}
                error={errors.startTime?.message}
              />
              {/*  */}
              <DateComponent
                showTime={true}
                name="endTime"
                label="Thời gian kết thúc"
                placeholder="Thời gian kết thúc"
                control={control}
                error={errors.endTime?.message}
              />{' '}
              <Input
                type="number"
                name="estimateCompanyParticipants"
                label="Số lượng công ty ước tính"
                placeholder="Nhập số lượng công ty ước tính"
                control={control}
                error={errors.estimateCompanyParticipants?.message}
              />
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
          </div>
        </div>

        {/* Block 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 ">
          {/* Image */}
          <ImageUploader images={newImages} setImages={setNewImages} existingImages={existingImageUrls} removeExistingImage={handleRemoveExistingImage} />
        </div>

        {/* workshopDescription */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5">
          <Controller
            name="workshopDescription"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Mô tả" error={errors.workshopDescription?.message} />
            )}
          />
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
        <div className="mt-4 gap-4 rounded-t-lg bg-primary-white p-5">
          <p className="mb-1 block text-sm font-semibold text-gray-700">Địa chỉ</p>
          {/* Chọn tỉnh */}
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
        </div>
        <div className="ml-auto mt-5 w-fit">
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default UpdateWorkshop;
