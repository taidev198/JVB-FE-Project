import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      alt="logo"
      className="h-auto w-[120px] sm:w-[160px] md:w-[180px]"
      height={38}
      width={160}
      src={'https://html.themewant.com/jobpath/template/assets/img/logo/header__one.svg'}
    />
  );
};
export default Logo;
