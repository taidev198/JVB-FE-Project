import { IconButton } from '@mui/material';
import Input from '@/components/Common/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SelectMui from '@/components/Common/SelectMui';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import validationSchemaAddJob from '@/validation/companyEmployee/validationAddJob';
import { yupResolver } from '@hookform/resolvers/yup';
import TextEditor from '@/components/Common/TextEditor';
import { Button } from '@/components/Common/Button';
import { useGetAllFieldsQuery } from '@/services/adminSchoolApi';
import SelectReact from '@/components/Common/SelectMui';
import { formatDateSearch } from '@/utils/app/format';
import { useAddJobMutation } from '@/services/adminCompanyApi';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useRouter } from 'next/router';
interface FormDataAddJob {
  jobTitle: number;
  jobDescription: string;
  requirements: string;
  jobType: string;
  workTime: string;
  benifits: string;
  jobLevel: number;
  expirationDate: string;
  memberOfCandidate: number;
  salaryType: string;
  maxSalary: number;
  minSalary: number;
  jobField: number;
  salary_type: string;
}
const AddJob = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataAddJob>({
    resolver: yupResolver(validationSchemaAddJob),
    defaultValues: {
      minSalary: 0,
      maxSalary: 0,
    },
  });

  const salaryType = watch('salary_type');
  console.log(salaryType);

  const { data: faculties } = useGetAllFieldsQuery();

  const [addJob] = useAddJobMutation();

  const onSubmit: SubmitHandler<FormDataAddJob> = async data => {
    const newData = {
      ...data,
      expirationDate: formatDateSearch(data.expirationDate),
    };
    try {
      const response = await addJob(newData).unwrap();
      toast.success(response.message);
      router.push('/admin/company/jobCompany')
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
    // addJob(newData)
  };

  return (
    <div className="bg-primary-white px-10">
      {/* Icon */}
      <div className="rounded-t-lg ">
        <Link href={'/admin/company/jobCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm Công việc </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* tiêu đề */}
          <Input name="jobTitle" control={control} error={errors.jobTitle?.message} placeholder="Tiêu đề công việc" label="Tiêu đề công việc" required={true} />
          {/* mô tả */}
          <div className="mt-5 grid grid-cols-1 gap-4">
            <Controller
              name="jobDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Mô tả công việc"
                  required={true}
                  error={errors.jobDescription?.message}
                />
              )}
            />

            {/* yêu cầu */}
            <Controller
              name="requirements"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Yêu cầu" required={true} error={errors.requirements?.message} />
              )}
            />

            {/* phúc lợi */}
            <Controller
              name="benifits"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Phúc lợi" required={true} error={errors.benifits?.message} />
              )}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-b-lg sm:grid-cols-2">
            {/* Trạng thái */}
            <SelectMui
              name="jobType"
              label="Loại công việc"
              placeholder="Nhập loại công việc"
              required={true}
              control={control}
              options={[
                { value: 1, label: 'Full time' },
                { value: 2, label: 'Part time' },
                { value: 2, label: 'Freelance' },
              ]}
              error={errors.jobType?.message}
            />

            {/* time làm vc */}
            <Input  name="workTime" control={control} error={errors.workTime?.message} placeholder="Thời gian làm việc" label="Thời gian làm việc" required={true}/>

            <SelectReact
              name="jobField"
              label="Lĩnh vực"
              required={true}
              placeholder="Chọn lĩnh vực"
              options={(faculties?.data || []).map(faculty => ({
                value: faculty.id,
                label: faculty.fieldName,
              }))}
              control={control}
              
              error={errors.jobField?.message}
            />
            {/* Trình độ */}
            <SelectMui
              name="jobLevel"
              label="Trình độ"
              required={true}
              placeholder="Nhập trình độ"
              control={control}
              options={[
                { value: 1, label: 'junior' },
                { value: 2, label: 'senior' },
              ]}
              error={errors.jobLevel?.message}
            />

            {/*Ngày hết hạn */}
            <Input type="date" name="expirationDate" control={control} error={errors.expirationDate?.message} placeholder="Ngày hết hạn" required={true} label="Ngày hết hạn" />

            {/* số lượng */}
            <Input name="memberOfCandidate" control={control} error={errors.memberOfCandidate?.message} placeholder="Số lượng tuyển" required={true} label="Số lượng tuyển" />

            {/* Lương: cao */}
          </div>

          <div className="grid grid-cols-3 items-center gap-5 mt-5">
            <SelectMui
              name="salary_type"
              label="Loại lương"
              required={true}
              placeholder="Nhập loại lương"
              control={control}
              options={[
                { value: 'NEGOTIABLE', label: 'Thỏa thuận' },
                { value: 'FIXED', label: 'Cố định' },
              ]}
            />
            {salaryType === 'FIXED' && (
              <>
                <Input name="maxSalary" type="number" label="Mức lương từ" placeholder="Cao nhất:" control={control} error={errors.maxSalary?.message} />

                {/* Lương: thấp */}
                <Input name="minSalary" type="number" label="Đến mức lương" placeholder="Thấp nhất:" control={control} error={errors.minSalary?.message} />
              </>
            )}
          </div>
        </div>

        <div className="ml-auto w-fit py-5">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddJob;
