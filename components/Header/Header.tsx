import { IconButton, Menu, useMediaQuery, useTheme, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { memo, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import Notification from '../Common/Notification';
import ImageComponent from '../Common/Image';

// import Container from '../Container';
import Logo from '../Logo';
import { BackdropType, setBackdrop, showSidebar } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/hooks';
// const showToast = () => {
//   toast.custom(
//     t => (
//       <div
//         className={`${
//           t.visible ? 'animate-enter' : 'animate-leave'
//         } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
//         <div className="w-0 flex-1 p-4">
//           <div className="flex items-start">
//             <div className="flex-shrink-0 pt-0.5">
//               <img
//                 className="h-10 w-10 rounded-full"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//                 alt=""
//               />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm font-medium text-gray-900">vinamilk</p>
//               <p className="mt-1 text-sm text-gray-500">Đã xác nhận tham gia workshop!</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex border-l border-gray-200">
//           <button
//             onClick={() => toast.remove(t.id)}
//             className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
//             Đóng
//           </button>
//         </div>
//       </div>
//     ),
//     { duration: 1222, position: 'bottom-right' }
//   );
// };

const Header = memo(({ isAdmin = false }: { isAdmin?: boolean }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { logOut } = useLogout();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <header className={`fixed z-50 w-full border-b border-gray-400 border-opacity-20 bg-primary-white py-5 ${isAdmin ? 'px-[20px]' : ''}`}>
      <div className="flex items-center justify-between">
        {!isMobileAndTablet ? (
          <>
            <Logo />
            <nav className="flex gap-6 ml-8">
              <Link href="/admin/ielts/tutorial" className="font-semibold text-lg hover:text-primary-main transition-colors">Tutorial</Link>
              {/* Add more nav links here if needed */}
            </nav>
          </>
        ) : (
          <IconButton onClick={() => dispatch(showSidebar())}>
            <MenuIcon />
          </IconButton>
        )}

        {/* login */}
        {!user.token ? (
          <div className="flex items-center gap-4">
            <Link
              href={'/auth/login'}
              className="flex h-10 items-center gap-2 rounded-md border border-primary-main px-5 font-medium text-primary-main hover:border-black hover:bg-black hover:text-primary-white">
              Đăng nhập
            </Link>

            <Link
              href={'/auth/Register'}
              className="flex h-10 items-center gap-2 rounded-md border bg-primary-main px-5 font-medium text-primary-white hover:bg-black">
              Đăng ký
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p>{user.name}</p>
            <IconButton onClick={handleMenuOpen}>
              <ImageComponent src={user.logoUrl} alt={user.name} className="rounded-full border-[2px] border-solid object-contain" width={40} height={40} />
              {/* <Avatar src={user.logoUrl} /> */}
            </IconButton>

            {/* Menu cho Avatar */}
            <Menu
              open={!!anchorEl}
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
              <MenuItem>
                <Link href={'/'} className="flex gap-5">
                  Ra portal <HomeOutlined />
                </Link>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setBackdrop(BackdropType.ModalChat))}>
                <p className="flex gap-5">
                  Trò chuyện <HomeOutlined />
                </p>
              </MenuItem>
              <MenuItem onClick={() => logOut()} className="flex gap-5">
                Đăng xuất
                <LogoutOutlined />
              </MenuItem>
            </Menu>

            <Notification />
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
