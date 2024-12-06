// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/store/hooks';
// import { setToast } from '@/store/slices/toastSlice';

// const withRoleProtection = (Component, allowedRoles) => {
//   return props => {
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const role = useAppSelector(state => state.user.roleAccount);

//     useEffect(() => {
//       if (!allowedRoles.includes(role)) {
//         dispatch(
//           setToast({
//             message: 'Bạn không có quyền truy cập trang này.',
//             type: 'error',
//           })
//         );
//         router.replace('/auth/login'); // Điều hướng tới trang lỗi
//       }
//     }, [role, router, allowedRoles, dispatch]);

//     if (!allowedRoles.includes(role)) return null; // Tránh hiển thị nội dung khi không có quyền

//     return <Component {...props} />;
//   };
// };

// export default withRoleProtection;
