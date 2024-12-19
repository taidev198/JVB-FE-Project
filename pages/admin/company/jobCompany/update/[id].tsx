import { IconButton } from '@mui/material';
import Input from '@/components/Common/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SelectMui from '@/components/Common/SelectMui';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import validationSchemaAddJob from '@/validation/companyEmployee/validationAddJob';
import { yupResolver } from '@hookform/resolvers/yup';
import TextEditor from '@/components/Common/TextEditor';
import { Button } from '@/components/Common/Button';
import { useGetAllFieldsQuery } from '@/services/adminSchoolApi';
import SelectReact from '@/components/Common/SelectMui';
import { formatDateSearch } from '@/utils/app/format';
import { useAddJobMutation, useGetDetailCompanyJobQuery, useUpdateJobMutation } from '@/services/adminCompanyApi';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
interface FormUpdateAddJob {
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  jobType: string;
  workTime: string;
  benifits: string;
  jobLevel: string;
  expirationDate: string;
  memberOfCandidate: number;
  maxSalary: number;
  minSalary: number;
  jobField: number[];
  salary_type: string;
}
const UpdateJob = () => {
  const idJob = useAppSelector(state => state.global.id);
  
  const dispatch = useAppDispatch();
  const { data: detailJob, isLoading } = useGetDetailCompanyJobQuery({ id: idJob });
  console.log(detailJob)


  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<FormUpdateAddJob>({
    resolver: yupResolver(validationSchemaAddJob),
    defaultValues: {
      minSalary: 0,
      maxSalary: 0,
    },
  });

  //useEffect
  useEffect(() => {
   if(detailJob?.data){
      reset({
        jobTitle: detailJob.data.jobTitle,
        jobDescription: detailJob.data.jobDescription,
        requirements: detailJob.data.requirements,
        jobType: detailJob.data.jobType,
        workTime: detailJob.data.workTime,
        benifits: detailJob.data.benifits,
        jobLevel: detailJob.data.jobLevel,
        expirationDate: detailJob.data.expirationDate,
        memberOfCandidate: detailJob.data.memberOfCandidate,
        salary_type: detailJob.data.salaryType,
        maxSalary: detailJob.data.maxSalary,
        minSalary: detailJob.data.minSalary,
        jobField: detailJob.data.fields.map((field) => field.id),
      })
   }
  },[detailJob?.data])

  const salaryType = watch('salary_type');

  const { data: faculties } = useGetAllFieldsQuery();

  const [updateJob] = useUpdateJobMutation();

  const onSubmit: SubmitHandler<FormUpdateAddJob> = async data => {
    const newData = {
      ...data,
      expirationDate: formatDateSearch(data.expirationDate),
       status : "REJECT"
    };
    try {
      const response = await updateJob({data: newData, id: idJob}).unwrap();
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
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhập thông tin Công việc </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* tiêu đề */}
          <Input name="jobTitle" control={control} error={errors.jobTitle?.message} placeholder="Tiêu đề công việc" label="Tiêu đề công việc" />
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
                <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Yêu cầu" error={errors.requirements?.message} />
              )}
            />

            {/* phúc lợi */}
            <Controller
              name="benifits"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Phúc lợi" error={errors.benifits?.message} />
              )}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-b-lg sm:grid-cols-2">
            {/* Trạng thái */}
            <SelectMui
              name="jobType"
              label="Loại công việc"
              placeholder="Nhập loại công việc"
              control={control}
              options={[
                { value: 'FULL_TIME', label: 'FULL_TIME' },
                { value: 'PART_TIME', label: 'PART_TIME' },
                { value: 'FREELANCE', label: 'FREELANCE' },
              ]}
              error={errors.jobType?.message}
            />

            {/* time làm vc */}
            <Input name="workTime" control={control} error={errors.workTime?.message} placeholder="Thời gian làm việc" label="Thời gian làm việc" />

            <SelectReact
              name="jobField"
              label="Lĩnh vực"
              placeholder="Chọn lĩnh vực"
              options={(faculties?.data || []).map(faculty => ({
                value: faculty.id,
                label: faculty.fieldName,
              }))}
              control={control}
              isMultiple={true}
              error={errors.jobField?.message}
            />
            {/* Trình độ */}
            <SelectMui
              name="jobLevel"
              label="Trình độ"
              placeholder="Nhập trình độ"
              control={control}
              options={[
                { value: 'JUNIOR', label: 'JUNIOR' },
                { value: 'SENIOR', label: 'SENIOR' },
              ]}
              error={errors.jobLevel?.message}
            />

            {/*Ngày hết hạn */}
            <Input type="date" name="expirationDate" control={control} error={errors.expirationDate?.message} placeholder="Ngày hết hạn" label="Ngày hết hạn" />

            {/* số lượng */}
            <Input name="memberOfCandidate" control={control} error={errors.memberOfCandidate?.message} placeholder="Số lượng tuyển" label="Số lượng tuyển" />

            {/* Lương: cao */}
          </div>{' '}
          <div className="grid grid-cols-3 items-center gap-5">
            <SelectMui
              name="salary_type"
              label="Loại lương"
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
          <Button text="Cập nhập" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateJob;
