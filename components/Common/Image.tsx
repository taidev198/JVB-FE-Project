import { useEffect, useState } from 'react';

interface ImageComponentProps {
  src?: string;
  width: number;
  height: number;
  className?: string;
  alt: string;
  onclick?: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt, width, height, className, onclick }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(`https://placehold.co/${width}x${height}?text=No Image`);

  useEffect(() => {
    const img = new Image();

    if (src) {
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
      };
      return;
    }

    setCurrentSrc(`https://placehold.co/${width}x${height}?text=No Image`);

    return () => {
      // Dọn dẹp sự kiện onload
      img.onload = null;
    };
  }, [src, width, height]);

  return (
    <img
      className={currentSrc === src || !src ? className : `${className} blur-sm`}
      style={{ height: `${height}px` }}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      onClick={onclick}
    />
  );
};

export default ImageComponent;
