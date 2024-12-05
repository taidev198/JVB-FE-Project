import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import addWorkshopSchema from '@/validation/addWorkshop';
import Input from '@/components/Common/Input';
import SelectMui from '@/components/Common/SelectMui';
import Text from '@/components/Common/Text';
import ImageUploader from '@/components/Common/ImageUploader';
import TextEditor from '@/components/Common/TextEditor';
import Select from '@/components/Common/Select';

interface FormDataWorkShop {
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  wardId: number;
  districtIid: number;
  provinceId: number;
  houseNumber: string;
  agenda: string;
  fieldIds: number[];
}

const UpdateWorkshop = () => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataWorkShop>({
    resolver: yupResolver(addWorkshopSchema),
  });

  const onSubmit: SubmitHandler<FormDataWorkShop> = data => {
    ({ data, newImages });
  };

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([
    'https://via.placeholder.com/150/0000FF',
    'https://via.placeholder.com/150/FF0000',
    'https://via.placeholder.com/150/FFFF00',
  ]);

  // Hàm xử lý xóa ảnh đã lưu
  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls(existingImageUrls.filter(imageUrl => imageUrl !== url));
    // Có thể thêm logic xóa ảnh trên server nếu cần
    console.log(`Đã xóa ảnh: ${url}`);
  };

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
              <Input
                startTime={true}
                type="date"
                name="startTime"
                label="Thời gian bắt đầu"
                placeholder=""
                control={control}
                error={errors.startTime?.message}
              />
              {/*  */}
              <Input type="date" name="endTime" label="Thời gian kết thúc" placeholder="" control={control} error={errors.endTime?.message} />
              {/*  */}
              <Input
                type="number"
                name="estimateCompanyParticipants"
                label="Số lượng công ty ước tính"
                placeholder="Nhập số lượng công ty ước tính"
                control={control}
                error={errors.estimateCompanyParticipants?.message}
              />
              <SelectMui
                name="fieldIds"
                label="Lĩnh vực"
                control={control}
                options={[
                  { value: 1, label: 'Kỹ thuật phần mềm' },
                  { value: 2, label: 'Hệ thống thông tin' },
                  { value: 3, label: 'Mạng máy tính' },
                  { value: 4, label: 'Kinh tế' },
                  { value: 5, label: 'A' },
                  { value: 6, label: 'B' },
                  { value: 7, label: 'C' },
                  { value: 8, label: 'D' },
                  { value: 9, label: 'E' },
                ]}
                isMultiple={true} // Bật chế độ chọn nhiều
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
          <Select
            name="provinceId"
            label="Tỉnh/ Thành phố"
            control={control}
            options={[
              { value: '0', label: 'Chọn' },
              { value: '1', label: 'Health' },
              { value: '2', label: 'Finance' },
            ]}
            error={errors.provinceId?.message}
          />
          <Select
            name="districtIid"
            label="Quận/ Huyện"
            control={control}
            options={[
              { value: '0', label: 'Chọn' },
              { value: '1', label: 'Health' },
              { value: '2', label: 'Finance' },
            ]}
            error={errors.districtIid?.message}
          />
          <Select
            name="wardId"
            label="Xã/ Phường"
            control={control}
            options={[
              { value: '0', label: 'Chọn' },
              { value: '3', label: 'Health' },
              { value: '4', label: 'Finance' },
            ]}
            error={errors.wardId?.message}
          />
          <Input type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.houseNumber?.message} />
        </div>
        <div className="flex justify-end bg-primary-white p-5">
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default UpdateWorkshop;
