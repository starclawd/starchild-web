import React, { useCallback, useState } from 'react';

import defaultImg from 'assets/png/default.png'

interface ImgLoadProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImgLoad: React.FC<ImgLoadProps> = ({
  src,
  fallbackSrc = defaultImg,
  alt,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = useCallback(() => {
    setImgSrc(fallbackSrc);
  }, [fallbackSrc]);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      onError={handleError}
      {...rest} 
    />
  );
};

export default ImgLoad;
