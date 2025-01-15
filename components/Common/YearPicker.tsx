import React, { FC } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface YearPickerComponentProps {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const YearPickerComponent: FC<YearPickerComponentProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="mr-5 flex flex-col gap-9 sm:flex-row sm:flex-nowrap">
      <div className="flex flex-col sm:flex-wrap">
        <DatePicker
          showYearPicker
          dateFormat="yyyy"
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Chọn năm bắt đầu"
          isClearable
          className="rounded-md !border-[#dfdede] p-2"
        />
      </div>

      <div className="flex flex-col">
        <DatePicker
          showYearPicker
          dateFormat="yyyy"
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="Chọn năm kết thúc"
          isClearable
          minDate={startDate || undefined}
          className="rounded-md !border-[#ece6e6] p-2"
        />
      </div>
    </div>
  );
};

export default YearPickerComponent;
