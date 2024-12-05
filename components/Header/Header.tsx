import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import Notification from '../Common/Notification';

// import Container from '../Container';
import Logo from '../Logo';
import iconSignIn from '@/public/icons/icon-signIn.svg';
import { showSidebar } from '@/store/slices/global';

const Header = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  return (
    <header className={`border-b border-gray-400 border-opacity-20 bg-primary-white py-[30px] shadow-md ${isAdmin ? 'px-[20px]' : ''}`}>
      {/* <Container> */}
      <div className={`flex items-center justify-between `}>
        {!isMobileAndTablet ? (
          <Logo />
        ) : (
          <IconButton onClick={() => dispatch(showSidebar())}>
            <MenuIcon />
          </IconButton>
        )}
        {/* login */}
        <div className="flex items-center gap-4">
          <Link
            href={'/auth/login'}
            className="flex h-10 items-center gap-2 rounded-md border border-primary-main px-5 font-medium text-primary-main hover:border-black hover:bg-black hover:text-primary-white">
            <Image src={iconSignIn} alt="" className="text-primary-main hover:text-primary-white" />
            Đăng nhập
          </Link>

          <Link
            href={'/auth/Register'}
            className="flex h-10 items-center gap-2 rounded-md border  bg-primary-main px-5 font-medium text-primary-white hover:bg-black">
            Đăng ký
          </Link>
          <Notification />
        </div>
      </div>
      {/* </Container> */}
    </header>
  );
};
export default Header;
