import { ChangeEvent } from 'react';

interface Props {
  value?: string;
  placeHolder?: string;
  setValue: (val: string) => void;
}

export const TextArea = ({ value = '', placeHolder = '', setValue }: Props): JSX.Element => {
  const updateVal = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <textarea
      value={value}
      onChange={updateVal}
      className="h-[88px] w-full rounded-[6px] border-[1px] border-[#707070] bg-[#343541] p-[8px_16px] text-[.875rem] focus:right-0 focus:outline-none"
      placeholder={placeHolder}
    />
  );
};
