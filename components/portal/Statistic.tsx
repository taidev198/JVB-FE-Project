import React from 'react';

const Statistic = () => {
  return (
    <>
      <section className="rts__section mp_section_padding">
        <div className="container mx-auto 3xl:px-40">
          <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-2 lg:gap-[30px] xl:grid-cols-4 ">
            <div className="rts__single__counter flex flex-col items-center justify-center">
              <h2 className="after:contents-[''] relative z-10 mb-[10px] max-w-max text-[60px] font-bold text-primary-main after:absolute after:left-[-20px] after:top-0 after:z-[-1] after:h-[50px] after:w-[50px] after:rounded-full after:bg-custom-gradient-1">
                <span className="counter">20</span>K
              </h2>
              <p className="text-2xl font-semibold text-primary-gray">Workshop</p>
            </div>

            <div className="rts__single__counter flex flex-col items-center justify-center">
              <h2 className="after:contents-[''] relative z-10 mb-[10px] max-w-max text-[60px] font-bold text-primary-main after:absolute after:left-[-20px] after:top-0 after:z-[-1] after:h-[50px] after:w-[50px] after:rounded-full after:bg-custom-gradient-1">
                <span className="counter">11</span>K
              </h2>
              <p className="text-2xl font-semibold text-primary-gray">Công việc</p>
            </div>

            <div className="rts__single__counter flex flex-col items-center justify-center">
              <h2 className="after:contents-[''] relative z-10 mb-[10px] max-w-max text-[60px] font-bold text-primary-main after:absolute after:left-[-20px] after:top-0 after:z-[-1] after:h-[50px] after:w-[50px] after:rounded-full after:bg-custom-gradient-1">
                <span className="counter">1</span>M
              </h2>
              <p className="text-2xl font-semibold text-primary-gray">Người dúng mới</p>
            </div>

            <div className="rts__single__counter flex flex-col items-center justify-center">
              <h2 className="after:contents-[''] relative z-10 mb-[10px] max-w-max text-[60px] font-bold text-primary-main after:absolute after:left-[-20px] after:top-0 after:z-[-1] after:h-[50px] after:w-[50px] after:rounded-full after:bg-custom-gradient-1">
                <span className="counter">300</span>+
              </h2>
              <p className="text-2xl font-semibold text-primary-gray">Công ty</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Statistic;
