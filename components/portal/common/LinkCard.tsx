import Link from 'next/link';
import React from 'react';
import ImageComponent from '@/components/Common/Image';

interface LinkCardProps {
  logoUrl: string;
  name: string;
  shortDes: string;
  websiteUrl: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ logoUrl, name, shortDes, websiteUrl }) => {
  return (
    <div className="link flex flex-col items-center justify-between gap-[40px] rounded-[10px] bg-custom-gradient-1 p-[30px]">
      <div className="flex flex-col items-center gap-[20px] text-center">
        <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-md bg-primary-white">
          <ImageComponent src={logoUrl} alt="logo" width={60} height={60} className="object-contain" />
        </div>
        <h3 className="line-clamp-2 text-center text-[32px] font-bold text-primary-black">{name}</h3>
        <p className="text-center text-lg text-primary-gray">{shortDes}</p>
      </div>
      <Link
        href={websiteUrl}
        className="mp_transition_4 z-[2] rounded-md bg-primary-main px-[30px] py-[20px] text-center text-lg font-medium tracking-wide text-white hover:bg-primary-black">
        Truy cập website
      </Link>
    </div>
  );
};

export default LinkCard;
