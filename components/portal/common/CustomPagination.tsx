import React, { useEffect, useRef } from 'react';

const CustomPagination: React.FC<{
  total: number;
  currentPage: number;
  pageSize: number;
  onChange: (page: number) => void;
}> = ({ total, currentPage, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set interval for auto page transition
    intervalRef.current = setInterval(() => {
      if (currentPage < totalPages) {
        onChange(currentPage + 1); // Move to the next page
      } else {
        onChange(1); // Loop back to the first page
      }
    }, 7000); // 7 seconds

    return () => {
      // Clear interval when the component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPage, totalPages, onChange]);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onChange(index + 1)}
          className={`rounded-full transition-all ${currentPage === index + 1 ? 'h-[10px] w-[20px] bg-primary-main' : 'h-[10px] w-[10px] bg-primary-gray'}`}
        />
      ))}
    </div>
  );
};

export default CustomPagination;
