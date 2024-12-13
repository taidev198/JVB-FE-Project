import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import required modules
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

export default function FeedBackSwiper({ swiperRef }) {
  return (
    <Swiper
      ref={swiperRef} // Truyền tham chiếu đến Swiper instance
      direction={'horizontal'}
      pagination={{
        clickable: true,
        type: 'fraction',
      }}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper h-full w-full pb-[40px] xl:h-[330px]">
      {' '}
      {/* Đảm bảo chiều rộng và chiều cao */}
      <SwiperSlide>
        <div className="mx-auto w-[80%]">
          <Image src="/images/quote.svg" alt="Image 1" width={58} height={46} className="mx-auto mb-[40px]"></Image>
          <p className="text-center text-[18px] font-medium lg:text-[20px]">
            JobLink chính là giải pháp. Khác với những nền tảng thông thường, chúng tôi mang đến sự kết nối thực chất giữa doanh nghiệp và trường học, mở ra cơ
            hội nghề nghiệp thực tiễn và chất lượng.
          </p>
          <div className="flex items-center justify-center gap-6 pb-[20px] pt-[40px]">
            <Image src="/images/avt.jpg" alt="Image 1" width={60} height={60} className="rounded-full"></Image>
            <div className="flex flex-col items-start">
              <p className="text-center text-[18px] font-bold text-primary-black lg:text-[20px]">Nguyễn Thanh Tùng</p>
              <p className="text-center text-[16px] font-medium text-primary-gray">Web Developer</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="mx-auto w-[80%]">
          <Image src="/images/quote.svg" alt="Image 1" width={58} height={46} className="mx-auto mb-[40px]"></Image>
          <p className="text-center text-[18px] font-medium lg:text-[20px]">
            JobLink chính là giải pháp. Khác với những nền tảng thông thường, chúng tôi mang đến sự kết nối thực chất giữa doanh nghiệp và trường học, mở ra cơ
            hội nghề nghiệp thực tiễn và chất lượng.
          </p>
          <div className="flex items-center justify-center gap-6 pb-[20px] pt-[40px]">
            <Image src="/images/avt.jpg" alt="Image 1" width={60} height={60} className="rounded-full"></Image>
            <div className="flex flex-col items-start">
              <p className="text-center text-[18px] font-bold text-primary-black lg:text-[20px]">Nguyễn Thanh Tùng</p>
              <p className="text-center text-[16px] font-medium text-primary-gray">Web Developer</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="mx-auto w-[80%]">
          <Image src="/images/quote.svg" alt="Image 1" width={58} height={46} className="mx-auto mb-[40px]"></Image>
          <p className="text-center text-[18px] font-medium lg:text-[20px]">
            JobLink chính là giải pháp. Khác với những nền tảng thông thường, chúng tôi mang đến sự kết nối thực chất giữa doanh nghiệp và trường học, mở ra cơ
            hội nghề nghiệp thực tiễn và chất lượng.
          </p>
          <div className="flex items-center justify-center gap-6 pb-[20px] pt-[40px]">
            <Image src="/images/avt.jpg" alt="Image 1" width={60} height={60} className="rounded-full"></Image>
            <div className="flex flex-col items-start">
              <p className="text-center text-[18px] font-bold text-primary-black lg:text-[20px]">Nguyễn Thanh Tùng</p>
              <p className="text-center text-[16px] font-medium text-primary-gray">Web Developer</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
