/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = ['Chọn ví', 'Nhập thông tin thanh toán', 'Thanh toán thành công'];

  const handleClick = (index: number) => {
    if (index === 0 || index === 1) {
      setActive(index + 1);
    }
  };

  return (
    <div>
      {options.map((option: any, index: number) => (
        <div key={index} className={`flex w-full py-5`}>
          <div className={`flex h-[35px] w-[35px] items-center justify-center rounded-full ${active > index ? 'bg-blue-500' : 'bg-[#384766]'} relative`}>
            <IoMdCheckmark className="text-[25px]" />
            {index !== options.length - 1 && <div className={`absolute h-[30px] w-1 ${active > index ? 'bg-blue-500' : 'bg-[#384766]'} bottom-[-100%]`} />}
          </div>
          <h5
            onClick={() => handleClick(index)}
            className={`pl-3 ${active === index ? 'text-black dark:text-white' : 'text-black dark:text-white'} cursor-pointer text-[20px]`}>
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;
