import Link from 'next/link';
import Image from '@/assets/icons/LogoJobLink.svg';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image src={Image} alt="logo" width={60} height={60} priority={true} loading="eager" className=" h-auto object-cover" />
      <h2 className="ml-2 font-logo text-3xl font-bold">
        <span className="text-primary-main">Job</span>Link
      </h2>
    </Link>
  );
};

export default Logo;
