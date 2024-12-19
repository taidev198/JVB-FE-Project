import Image from 'next/image';
import { useState } from 'react';

const CustomImage = ({ src, alt, width, height, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return <Image src={imgSrc} alt={alt} width={width} height={height} className={className} onError={() => setImgSrc('/images/user-default.png')} />;
};

export default CustomImage;
