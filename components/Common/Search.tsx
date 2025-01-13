import { memo } from 'react';

interface SearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  value: string;
  className?: string;
  placeholder: string;
}

const Search = ({ onChange, value, onClear, className, placeholder }: SearchProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === 'function') {
      onChange(event);
    }
  };

  return (
    <div className={`${className} h-10 w-full rounded-full border-2 border-[#e8e8e8] px-2 transition-all focus-within:border-[#444] sm:w-[300px]`}>
      <div className="flex h-full w-full items-center justify-center px-2">
        <i className="fa-solid fa-magnifying-glass text-[#848484]"></i>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          className="h-full w-full border-none px-2 py-0 outline-none placeholder:text-sm"
          onChange={handleInputChange}
        />
        {value && <i className="fa-solid fa-xmark fa-sm cursor-pointer text-[#848484]" onClick={onClear}></i>}
      </div>
    </div>
  );
};

export default memo(Search);
