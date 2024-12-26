import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/autoplay';
import { useGetFieldsCountJobQuery } from '@/services/portalHomeApi';

interface MajorsSwiperProps {
  swiperRef: React.RefObject<any>;
}

const MajorsSwiper: React.FC<MajorsSwiperProps> = ({ swiperRef }) => {
  const { data: fieldsData, isLoading, error } = useGetFieldsCountJobQuery();
  console.log(fieldsData, 'firstData');
  // Mapping field names to images
  const fieldImages: Record<string, string> = {
    'Kế toán tài chính': '/images/tc.png',
    'Quản lý hình ảnh thương hiệu': '/images/ha.png',
    'Nghiên cứu và Phát triển sản phẩm': '/images/tc.png',
    'Khoa học dữ liệu': '/images/cntt.png',
    'Quảng cáo sáng tạo': '/images/pr.png',
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      // Ensure Swiper instance is updated after data changes
      swiperRef.current.swiper.update();
    }
  }, [fieldsData, swiperRef]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !fieldsData || fieldsData.code !== 200) {
    return <div>Failed to load fields data. Please try again later.</div>;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay]}
        loop={true} // Infinite looping
        autoplay={{
          delay: 3000, // Auto-slide delay in milliseconds
          disableOnInteraction: false, // Continue autoplay after user interaction
        }}
        speed={1000} // Transition speed
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
          1440: {
            slidesPerView: 4,
          },
        }}
        ref={swiperRef} // Store ref for accessing Swiper API
      >
        {fieldsData.data.map((field, index) => (
          <SwiperSlide key={index}>
            <Link href="/#" className="flex items-center justify-start gap-6 rounded-[10px] bg-primary-white px-[30px] py-[22px] text-white">
              <div className="single__cat__icon flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                <img src={fieldImages[field.fieldName] || '/images/default-icon.png'} alt={field.fieldName} className="object-cover" />
              </div>
              <div className="single__cat__link flex flex-col truncate">
                <a href="#" aria-label={field.fieldName} className="truncate text-[18px] text-primary-black">
                  {field.fieldName}
                </a>
                <span className="text-[18px] text-primary-gray">{field.countJob}+ Công việc</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MajorsSwiper;
