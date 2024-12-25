import React, { useRef } from 'react';
import FeedBackSwiper from './common/FeedBackSwiper';

const FeedBack: React.FC = () => {
  const swiperRef = useRef(null);

  return (
    <section className="rts__section section__padding mp_section_padding bg-feedback-bg bg-cover bg-no-repeat">
      <div className="container mx-auto">
        <div className="mb-[60px]  text-center">
          <h3 className="rts__section__title mp_section_title mb-[13px]">Khách Hàng Nói Gì Về Chúng Tôi</h3>
          <p className="rts__section__desc mp_section_des">Tìm kiếm cơ hội nghề nghiệp tiếp theo của bạn?</p>
        </div>
        <div className="flex max-h-[530px] items-center justify-center overflow-hidden">
          {/* Nút Prev */}
          <div
            className="rts__slide__next slider__btn h-full cursor-pointer px-4 text-2xl"
            tabIndex={0}
            role="button"
            aria-label="Next slide"
            aria-controls="swiper-wrapper-88109e76d8f5dd768"
            onClick={() => swiperRef.current?.swiper?.slidePrev()} // Điều khiển slide Prev
          >
            <i className="fa-sharp fa-solid fa-chevron-left" />
          </div>

          {/* Component FeedBackSwiper với swiperRef */}
          <FeedBackSwiper swiperRef={swiperRef} />

          {/* Nút Next */}
          <div
            className="rts__slide__prev slider__btn h-full cursor-pointer px-4 text-2xl"
            tabIndex={0}
            role="button"
            aria-label="Previous slide"
            aria-controls="swiper-wrapper-88109e76d8f5dd768"
            onClick={() => swiperRef.current?.swiper?.slideNext()} // Điều khiển slide Next
          >
            <i className="fa-sharp fa-solid fa-chevron-right" />
          </div>
        </div>
      </div>
      <div className="rts__slider__control d-lg-flex justify-content-between g-0 position-absolute top-50 translate-middle-y d-none"></div>
    </section>
  );
};

export default FeedBack;
