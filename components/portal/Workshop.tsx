import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Workshop = () => {
  return (
    <div className="rts__section mp_section_padding relative overflow-hidden pb-[180px]">
      <div className="shape__home__one absolute left-[-3%] top-0 z-[-2] hidden lg:block">
        <Image src="/images/banner-shape.svg" alt="Banner Shape" width={502} height={495} />
      </div>
      <div className="shape__home__one absolute bottom-[-20%] right-[20%] z-[-3] hidden lg:block">
        <Image src="/images/banner-shape-2.svg" alt="Banner Shape" width={665} height={796} />
      </div>
      <div className="shape__home__one absolute right-[20%] top-0 z-[-3] hidden lg:block">
        <Image src="/images/banner-shape-2.svg" alt="Banner Shape" width={665} height={796} />
      </div>
      <div className="container mx-auto">
        <div className="text-center">
          <div className="mb-[60px]">
            <h3 className="rts__section__title mp_section_title mb-[13px]">Workshop hấp dẫn</h3>
            <p className="rts__section__desc mp_section_des">Tìm kiếm cơ hội nghề nghiệp tiếp theo? AutoCareerBridge chính là nơi bạn cần!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3 2xl:gap-[40px]">
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rts__single__blog  mp_transition_4  group relative h-full w-full overflow-hidden rounded-[10px] border-[1px] border-primary-border px-[24px] py-[30px] pt-[24px] hover:border-transparent">
            <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
            <Link href="#" className="blog__img">
              <img src="/images/1.webp" className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover" alt="blog" />
            </Link>
            <div className="blog__meta pt-[16px]">
              <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/calender.svg"
                    className="svg">
                    <g clipPath="url(#clip0_171_2257--inject-1)">
                      <path
                        d="M0.351591 9.86717H2.1094V10.9219C2.1094 11.116 2.26681 11.2734 2.46096 11.2734H11.6484C11.8426 11.2734 12 11.116 12 10.9219V1.78125C12 1.58709 11.8426 1.42969 11.6484 1.42969H9.89063V1.07812C9.89063 0.883968 9.73323 0.726562 9.53907 0.726562C9.34492 0.726562 9.18751 0.883968 9.18751 1.07812V1.42969H7.40626V1.07812C7.40626 0.883968 7.24886 0.726562 7.0547 0.726562C6.86055 0.726562 6.70314 0.883968 6.70314 1.07812V1.42969H4.94533V1.07812C4.94533 0.883968 4.78793 0.726562 4.59377 0.726562C4.39961 0.726562 4.24221 0.883968 4.24221 1.07812V1.42969H2.46096C2.26681 1.42969 2.1094 1.58709 2.1094 1.78125V3.89062C2.1094 6.48163 1.03257 8.47489 0.126521 9.24554C0.0128027 9.3403 -0.0293612 9.49611 0.0210059 9.6353C0.0714198 9.77448 0.20356 9.86717 0.351591 9.86717ZM11.2969 10.5703H2.81252V9.86717H9.53907C9.62132 9.86717 9.70096 9.83834 9.76414 9.78568C10.1868 9.43367 10.8414 8.59559 11.2969 7.52221V10.5703ZM2.81252 2.13281H4.24221V2.48437C4.24221 2.67853 4.39961 2.83593 4.59377 2.83593C4.78793 2.83593 4.94533 2.67853 4.94533 2.48437V2.13281H6.70314V2.48437C6.70314 2.67853 6.86055 2.83593 7.0547 2.83593C7.24886 2.83593 7.40626 2.67853 7.40626 2.48437V2.13281H9.18751V2.48437C9.18751 2.67853 9.34492 2.83593 9.53907 2.83593C9.73323 2.83593 9.89063 2.67853 9.89063 2.48437V2.13281H11.2969V3.53906H2.81252V2.13281ZM2.8065 4.24195H11.2906C11.2114 6.47214 10.3555 8.22685 9.40121 9.16405H1.15125C2.23249 7.78637 2.74849 5.99254 2.8065 4.24195Z"
                        fill="#34A853"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_171_2257--inject-1">
                        <rect width={12} height={12} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  30 Tháng Mười Một, 2024
                </span>
                <a href="#" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    height={14}
                    viewBox="0 0 10 14"
                    fill="none"
                    data-inject-url="https://html.themewant.com/jobpath/template/assets/img/icon/user.svg"
                    className="svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.38893 1.42133C5.9778 1.14662 5.49445 1 5 1C4.33696 1 3.70108 1.26339 3.23223 1.73223C2.76339 2.20107 2.5 2.83696 2.5 3.5C2.5 3.99445 2.64662 4.4778 2.92133 4.88893C3.19603 5.30005 3.58648 5.62048 4.04329 5.8097C4.50011 5.99892 5.00277 6.04843 5.48773 5.95196C5.97268 5.8555 6.41814 5.6174 6.76777 5.26777C7.1174 4.91814 7.3555 4.47268 7.45196 3.98773C7.54843 3.50277 7.49892 3.00011 7.3097 2.54329C7.12048 2.08648 6.80005 1.69603 6.38893 1.42133ZM3.05551 0.589856C3.63108 0.205271 4.30777 0 5 0C5.92826 0 6.8185 0.368749 7.47487 1.02513C8.13125 1.6815 8.5 2.57174 8.5 3.5C8.5 4.19223 8.29473 4.86892 7.91014 5.4445C7.52556 6.02007 6.97893 6.46867 6.33939 6.73358C5.69985 6.99848 4.99612 7.0678 4.31719 6.93275C3.63825 6.7977 3.01461 6.46436 2.52513 5.97487C2.03564 5.48539 1.7023 4.86175 1.56725 4.18282C1.4322 3.50388 1.50152 2.80015 1.76642 2.16061C2.03133 1.52107 2.47993 0.974441 3.05551 0.589856ZM9 14H10V11.5C10 10.5717 9.63125 9.6815 8.97487 9.02513C8.3185 8.36875 7.42826 8 6.5 8H3.5C2.57174 8 1.6815 8.36875 1.02513 9.02513C0.368749 9.6815 0 10.5717 0 11.5V14H1V11.5C1 10.837 1.26339 10.2011 1.73223 9.73223C2.20107 9.26339 2.83696 9 3.5 9H6.5C6.8283 9 7.15339 9.06466 7.45671 9.1903C7.76002 9.31594 8.03562 9.50009 8.26777 9.73223C8.49991 9.96438 8.68406 10.24 8.8097 10.5433C8.93534 10.8466 9 11.1717 9 11.5V14Z"
                      fill="#34A853"
                    />
                  </svg>
                  Jon Adom
                </a>
              </div>
              <Link href="blog-details.html" className="block text-[24px] font-semibold text-primary-black">
                Kỹ Năng Giao Tiếp Chuyên Nghiệp
              </Link>
              <div className="mt-[20px] flex flex-row items-center justify-between">
                <Link href="blog-details.html" className="readmore__btn  flex items-center gap-2 text-lg">
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                  <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                </Link>

                <div className="readmore__btn  flex items-center gap-2 text-lg">
                  <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                  <span className="mp_transition_4 font-medium hover:text-primary-main">Thanh Xuân, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="load_more mt-[30px] flex items-center justify-center 2xl:mt-[40px] ">
          <Link href={'/job-list-1'} className="mp_fill_button mp_transition_4 flex items-center gap-2 rounded-[10px] px-[16px] py-[15px] font-medium">
            <span>Xem thêm</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Workshop;
