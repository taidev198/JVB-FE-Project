import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BreadCrumbHeaderProps {
  title: string;
  currentPage: string;
}

const BreadCrumbHeader: React.FC<BreadCrumbHeaderProps> = ({ title, currentPage }) => {
  return (
    <div className="rts__section relative min-h-[450px] bg-breakcrumb-bg bg-cover bg-no-repeat">
      <div className="container mx-auto px-[20px] ">
        <div className="flex max-w-full items-center justify-start">
          <div className="z-[2] max-w-max pb-[130px] pt-[210px]">
            <h1 className="breadcrumb-title mp_section_title mb-[13px]">{title}</h1>
            <nav>
              <ul className="flex items-center gap-2 text-lg">
                <li className="breadcrumb-item cursor-pointer">
                  <Link href="/">Trang chủ</Link>
                </li>
                <i className="fa fa-angle-right text-primary-main "></i>
                <li className="breadcrumb-item  text-primary-main" aria-current="page">
                  {currentPage}
                </li>
              </ul>
            </nav>
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
