import Image from 'next/image';
import Link from 'next/link';
import Logo from '../Logo';
import Container from '../Container';
import iconSignIn from '@/public/icons/icon-signIn.svg';

const Header = () => {
  return (
    <header className="bg-primary-white py-[30px] shadow-md">
      <Container>
        <div className="flex items-center justify-between  ">
          <Logo />
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
          </div>
        </div>
      </Container>
    </header>
  );
};
export default Header;
