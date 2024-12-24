import ImageComponent from '@/components/Common/Image';
import { EnvironmentOutlined } from '@ant-design/icons';
import React from 'react';

interface BreadCrumbHeaderProps {
  title: string;
  currentPage: string;
  schoolType: string;
  address: string;
  logo: string;
}

const BreadCrumbHeader: React.FC<BreadCrumbHeaderProps> = ({ title, schoolType, address, logo }) => {
  return (
    <div className="rts__section relative min-h-[450px] bg-breakcrumb-bg bg-cover bg-no-repeat">
      <div className="container mx-auto lg:px-[80px]">
        <div className=" w-full">
          <div className="z-[2] flex w-full flex-col items-center  gap-10 pb-[130px] pt-[210px] sm:items-start lg:flex-row lg:items-center lg:gap-0 ">
            <div className="z-50 flex w-full flex-col items-center gap-[30px] sm:flex-row xl:w-[calc(100%-200px)]">
              <div className="flex h-[140px] w-[140px] flex-shrink-0 flex-col items-center justify-center rounded-md bg-primary-white">
                <ImageComponent src={logo} width={120} height={120} alt={title} className="object-contain" />
              </div>
              <div className="max-w-[100%] text-center sm:max-w-[70%] sm:text-left">
                <h1 className="breadcrumb-title mp_section_title mb-[13px] truncate">{title}</h1>
                <div className="xxl:flex-row xxl:items-center xxl:gap-4 flex flex-col items-start gap-2 truncate whitespace-nowrap text-lg text-primary-gray">
                  <span className="w-full truncate whitespace-nowrap">{schoolType}</span>
                  <span className="flex w-full items-center gap-2 ">
                    <EnvironmentOutlined />
                    <span className="block w-full truncate whitespace-nowrap">{address}</span>
                  </span>
                </div>
              </div>
            </div>
            <button className="mp_transition_4 z-[2] min-w-[200px] rounded-md bg-primary-main px-[30px] py-[20px] text-lg font-medium tracking-wide text-white hover:bg-primary-black ">
              Liên kết ngay
            </button>
          </div>
        </div>
        <div className="absolute right-[10%] top-[60%] flex h-full w-full translate-y-[-50%] items-center justify-end gap-6 ">
          <div className="shape__one absolute right-[25%] hidden lg:block ">
            <ImageComponent src="/images/shape-1.svg" width={316} height={115} alt="shape-1" />
          </div>
          <div className="shape__two ">
            <ImageComponent src="/images/shape-2.svg" width={80} height={80} alt="shape-2" />
          </div>
          <div className="shape__three">
            <ImageComponent src="/images/shape-3.svg" width={121} height={122} alt="shape-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbHeader;
