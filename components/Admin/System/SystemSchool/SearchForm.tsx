// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import SearchIcon from '@mui/icons-material/Search';

// import { Button as MyButton } from '@/components/Common/Button';
// import Input from '@/components/Common/Input';

// interface Props {
//   onSearch: (results: any[]) => void;
// }

// interface FormDataRegisterCompany {
//   search_company: string;
// }
// const validationSchema = Yup.object({
//   search_company: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
// });

// const SearchFormSystemAdminSchool = ({ onSearch }: Props) => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormDataRegisterCompany>({
//     resolver: yupResolver(validationSchema),
//   });

//   const onSubmit: SubmitHandler<FormDataRegisterCompany> = data => {
//     onSearch(data);
//     // onSearch(data) sẽ trả dữ liệu về component cha
//   };
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="rounded-t-md bg-white p-5 pb-5">
//       <h1 className="mb-5 font-bold">Doanh sách tài khoản trường đại học</h1>
//       <div className="flex items-center gap-3 ">
//         <div className="w-[400px]">
//           <Input
//             type="text"
//             name="search_company"
//             placeholder="Tìm kiếm trường đại học"
//             control={control}
//             error={errors.search_company?.message}
//             icon={<SearchIcon />}
//           />
//         </div>
//         <MyButton type="submit" text="Tìm kiếm" />
//       </div>
//     </form>
//   );
// };
// export default SearchFormSystemAdminSchool;
