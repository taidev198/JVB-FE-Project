import React, { FC } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerComponentProps {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DatePickerComponent: FC<DatePickerComponentProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <div className="flex flex-col sm:flex-wrap">
        <DatePicker
          showIcon
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Chọn ngày bắt đầu"
          isClearable
          className="!borer-[#c4c4c4] rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <DatePicker
          showIcon
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="Chọn ngày kết thúc"
          isClearable
          minDate={startDate || undefined}
          className="!borer-[#c4c4c4] rounded-md"
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
