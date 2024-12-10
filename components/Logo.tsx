import Link from 'next/link';
import Image from '@/assets/icons/LogoJobLink.svg';

const Logo = () => {
  return (
    <Link href="/">
      <Image src={Image} alt="logo" width={60} height={60} priority={true} loading="eager" className=" h-auto object-cover" />
    </Link>
  );
};

export default Logo;
