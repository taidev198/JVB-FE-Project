import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import validationSchemaAddJob from '@/validation/companyEmployee/job/validationAddJob';
import TextEditor from '@/components/Common/TextEditor';
import { Button } from '@/components/Common/Button';
import { useGetAllFieldsQuery } from '@/services/adminSchoolApi';
import SelectReact from '@/components/Common/SelectMui';
import { formatDateSearch } from '@/utils/app/format';
import { useAddJobMutation } from '@/services/adminCompanyApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import SelectMui from '@/components/Common/SelectMui';
import Input from '@/components/Common/Input';
interface FormDataAddJob {
  job_title: number;
  job_description: string;
  requirements: string;
  job_type: string;
  work_time: string;
  benifits: string;
  job_level: number;
  expiration_date: string;
  member_of_candidate: number;
  salaryType: string;
  max_salary: number;
  min_salary: number;
  job_field: number[];
  salary_type: string;
}
const AddJob = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataAddJob>({
    resolver: yupResolver(validationSchemaAddJob),
    defaultValues: {
      max_salary: 0,
      min_salary: 0,
    },
  });

  const salaryType = watch('salary_type');
  const { data: faculties } = useGetAllFieldsQuery();

  const [addJob] = useAddJobMutation();

  const onSubmit: SubmitHandler<FormDataAddJob> = async data => {
    const newData = {
      ...data,
      expiration_date: formatDateSearch(data.expiration_date),
    };
    try {
      await addJob(newData).unwrap();
      toast.success('Thêm mới công việc thành công');
      router.push('/admin/company/jobCompany');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="rounded-lg bg-primary-white p-5">
      {/* Icon */}
      <div className="">
        <Link href={'/admin/company/jobCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm công việc </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* tiêu đề */}
          <Input
            name="job_title"
            control={control}
            error={errors.job_title?.message}
            placeholder="Tiêu đề công việc"
            label="Tiêu đề công việc"
            required={true}
          />
          {/* mô tả */}
          <div className="mt-5 grid grid-cols-1 gap-4">
            <Controller
              name="job_description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Mô tả công việc"
                  required={true}
                  error={errors.job_description?.message}
                />
              )}
            />

            {/* yêu cầu */}
            <Controller
              name="requirements"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Yêu cầu"
                  required={true}
                  error={errors.requirements?.message}
                />
              )}
            />

            {/* phúc lợi */}
            <Controller
              name="benifits"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Phúc lợi"
                  required={true}
                  error={errors.benifits?.message}
                />
              )}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-b-lg sm:grid-cols-2">
            {/* Trạng thái */}
            <SelectMui
              name="job_type"
              label="Loại công việc"
              placeholder="Nhập loại công việc"
              required={true}
              control={control}
              options={[
                { value: 'FULL_TIME', label: 'Full time' },
                { value: 'PART_TIME', label: 'Part time' },
                { value: 'FREELANCE', label: 'Freelance' },
              ]}
              error={errors.job_type?.message}
            />

            {/* time làm vc */}
            <Input
              name="work_time"
              control={control}
              error={errors.work_time?.message}
              placeholder="Thời gian làm việc"
              label="Thời gian làm việc"
              required={true}
            />

            <SelectReact
              name="job_field"
              label="Lĩnh vực"
              required={true}
              placeholder="Chọn lĩnh vực"
              options={(faculties?.data || []).map(faculty => ({
                value: faculty.id,
                label: faculty.fieldName,
              }))}
              control={control}
              isMultiple={true}
              error={errors.job_field?.message}
            />
            {/* Trình độ */}
            <SelectMui
              name="job_level"
              label="Trình độ"
              required={true}
              placeholder="Nhập trình độ"
              control={control}
              options={[
                { value: 'INTERN', label: 'Intern' },
                { value: 'JUNIOR', label: 'Junior' },
                { value: 'SENIOR', label: 'Senior' },
                { value: 'FRESHER', label: 'Fresher' },
              ]}
              error={errors.job_level?.message}
            />

            {/*Ngày hết hạn */}
            <Input
              type="date"
              name="expiration_date"
              control={control}
              error={errors.expiration_date?.message}
              placeholder="Ngày hết hạn"
              required={true}
              label="Ngày hết hạn"
            />

            {/* số lượng */}
            <Input
              name="member_of_candidate"
              control={control}
              error={errors.member_of_candidate?.message}
              placeholder="Số lượng tuyển"
              required={true}
              label="Số lượng tuyển"
            />

            {/* Lương: cao */}
          </div>

          <div className="mt-5 grid grid-cols-3 items-center gap-5">
            <SelectMui
              name="salary_type"
              label="Loại lương"
              required={true}
              placeholder="Nhập loại lương"
              control={control}
              error={errors.salary_type?.message}
              options={[
                { value: 'NEGOTIABLE', label: 'Thỏa thuận' },
                { value: 'FIXED', label: 'Cố định' },
              ]}
            />
            {salaryType === 'FIXED' && (
              <>
                <Input name="max_salary" type="number" label="Mức lương từ" placeholder="Cao nhất:" control={control} error={errors.max_salary?.message} />

                {/* Lương: thấp */}
                <Input name="min_salary" type="number" label="Đến mức lương" placeholder="Thấp nhất:" control={control} error={errors.min_salary?.message} />
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
