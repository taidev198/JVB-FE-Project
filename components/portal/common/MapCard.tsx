import React from 'react';

interface GoogleMapProps {
  googleMapsUrl: string;
  title?: string;
  height?: string | number; // Chiều cao vẫn có thể được tùy chỉnh
}

const GoogleMap: React.FC<GoogleMapProps> = ({ googleMapsUrl, title = 'Vị trí trên Google Maps', height = 300 }) => {
  return (
    <div className="map w-full">
      <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">{title}</h3>
      <iframe src={googleMapsUrl} style={{ width: '100%', height: height, border: 0 }} allowFullScreen loading="lazy"></iframe>
    </div>
  );
};

export default GoogleMap;
