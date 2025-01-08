import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, FormProvider, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import { Button } from '@/components/Common/Button';
import addWorkshopSchema from '@/validation/addWorkshop';
import Input from '@/components/Common/Input';
import ImageUploader from '@/components/Common/ImageUploader';
import TextEditor from '@/components/Common/TextEditor';
import SelectReact from '@/components/Common/SelectMui';
import { useAddWorkshopMutation, useGetAllFieldsQuery } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';
import { formatDateWorkshop } from '@/utils/app/format';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useAppSelector } from '@/store/hooks';

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
  const { address } = useAppSelector(state => state.user);

  const methods = useForm<FormDataWorkShop>({
    resolver: yupResolver(addWorkshopSchema) as Resolver<FormDataWorkShop>,
    mode: 'onChange',
    defaultValues: {
      wardId: address?.ward?.id,
      districtId: address?.district?.id,
      provinceId: address?.province?.id,
      houseNumber: address?.houseNumber,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const { data: faculties, isLoading: isLoadingFaculty } = useGetAllFieldsQuery();
  const [addWorkshop, { isLoading: isLoadingAddWorkshop }] = useAddWorkshopMutation();

  const onSubmit: SubmitHandler<FormDataWorkShop> = async data => {
    const formData = new FormData();

    formData.append('workshopTitle', data.workshopTitle);
    formData.append('workshopDescription', data.workshopDescription);
    formData.append('startTime', formatDateWorkshop(data.startTime));
    formData.append('endTime', formatDateWorkshop(data.endTime));
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
      await addWorkshop(formData).unwrap();
      toast.success('Thêm mới workshop thành công');
      router.push('/admin/school/workshop');
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
    dispatch(setLoading(isLoadingFaculty || isLoadingAddWorkshop));
  }, [dispatch, isLoadingFaculty, isLoadingAddWorkshop]);

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
          <Input
            name="workshopTitle"
            control={control}
            error={errors.workshopTitle?.message}
            placeholder="Nhập tiêu đề Workshop"
            label="Tiêu đề Workshop"
            required={true}
          />
          <div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateComponent
                name="startTime"
                label="Thời gian bắt đầu"
                placeholder="Thời gian bắt đầu"
                control={control}
                error={errors.startTime?.message}
                showTime={true}
                required={true}
              />
              {/*  */}
              <DateComponent
                name="endTime"
                label="Thời gian kết thúc"
                placeholder="Thời gian kết thúc"
                control={control}
                error={errors.endTime?.message}
                showTime={true}
                required={true}
              />
              {/*  */}
              <Input
                type="number"
                name="estimateCompanyParticipants"
                label="Số lượng công ty ước tính"
                placeholder="Nhập số lượng công ty ước tính"
                control={control}
                error={errors.estimateCompanyParticipants?.message}
                required={true}
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
                required={true}
              />
            </div>
          </div>
        </div>
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
        {/* Block 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 ">
          {/* Image */}
          <ImageUploader images={image} setImages={setImage} />
        </div>

        {/* workshopDescription */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5">
          <Controller
            name="workshopDescription"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Mô tả"
                error={errors.workshopDescription?.message}
                required={true}
              />
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
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Lịch trình"
                error={errors.agenda?.message}
                required={true}
              />
            )}
          />
        </div>

        {/* Block 4 */}

        <div className="flex justify-end bg-primary-white p-5">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default AddWorkshop;
