import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';

interface BreadCrumbHeaderProps {
  title: string;
  currentPage: string;
  schoolType: string;
  address: string;
}

const BreadCrumbHeader: React.FC<BreadCrumbHeaderProps> = ({ title, schoolType, address }) => {
  return (
    <div className="rts__section relative min-h-[450px] bg-breakcrumb-bg bg-cover bg-no-repeat">
      <div className="container mx-auto  px-[80px]">
        <div className="w-full">
          <div className="z-[2] flex w-full items-center justify-between pb-[130px] pt-[210px]">
            <div className="flex items-center gap-[30px]">
              <Image src="/images/user-default.png" width={120} height={120} alt="" />
              <div>
                <h1 className="breadcrumb-title mp_section_title">{title}</h1>
                <div className="flex items-center gap-4 text-lg text-primary-gray">
                  <span>{schoolType}</span>
                  <span className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    <span>{address}</span>
                  </span>
                </div>
              </div>
            </div>
            <button className="mp_transition_4 z-[2] rounded-md bg-primary-main px-[30px]	 py-[20px] text-lg font-medium tracking-wide text-white hover:bg-primary-black ">
              Liên kết ngay
            </button>
          </div>
        </div>
        <div className="absolute right-[10%] top-[60%] flex h-full w-full translate-y-[-50%] items-center justify-end gap-6 ">
          <div className="shape__one absolute right-[25%] hidden lg:block ">
            <Image src="/images/shape-1.svg" width={316} height={115} alt="shape-1" />
          </div>
          <div className="shape__two ">
            <Image src="/images/shape-2.svg" width={80} height={80} alt="shape-2" />
          </div>
          <div className="shape__three">
            <Image src="/images/shape-3.svg" width={121} height={122} alt="shape-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbHeader;
