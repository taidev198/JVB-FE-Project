import React from 'react';

const index = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold leading-[38px]">
            Welcome, <span className="text-blue-500">Adrian</span>
          </h1>
          <span className="text-base text-[#475467]">Truy cập và quản lý tài khoản và giao dịch của bạn một cách hiệu quả.</span>
        </div>

        <div className="flex w-full flex-wrap justify-between">
          <div className="flex w-2/3 flex-col gap-8">
            <div className="flex w-full items-center justify-between gap-[20px] rounded-md bg-primary-white px-5 py-5">
              <div className="flex w-full  items-center gap-4">
                <div className="w-fit rounded-md bg-[#F1F1F1] p-4"></div>
                <div className="flex w-full flex-col ">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-base font-semibold">Tài khoản ví Plus</span>
                    <div
                      className={
                        'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main bg-primary-main px-4 text-white'
                      }>
                      <span>Nạp tiền</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>Tài khoản ví Plus</span>
                  <div>
                    <span>Nạp tiền</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
