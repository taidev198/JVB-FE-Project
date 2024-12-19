import { useRouter } from 'next/router';
import { Avatar, IconButton, Menu, useMediaQuery, useTheme, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { memo, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import Notification from '../Common/Notification';

// import Container from '../Container';
import Logo from '../Logo';
import { showSidebar } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/slices/user';

const Header = memo(({ isAdmin = false }: { isAdmin?: boolean }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    dispatch(logOut());
    router.push('/');
  };
  return (
    <header className={`fixed z-50 w-full border-b border-gray-400 border-opacity-20 bg-primary-white py-5 ${isAdmin ? 'px-[20px]' : ''}`}>
      <div className="flex items-center justify-between">
        {!isMobileAndTablet ? (
          <Logo />
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
            <span className="text-primary-black">Xin chào {user?.user?.fullName ?? ''}</span>

            <IconButton onClick={handleMenuOpen}>
              <Avatar src="" />
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
              <MenuItem>Trang Admin</MenuItem>
              <MenuItem onClick={handleLogout}>
                Đăng xuất <LogoutIcon />
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
