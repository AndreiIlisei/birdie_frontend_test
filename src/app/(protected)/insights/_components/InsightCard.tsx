import React, { useState } from "react";
import Image from "next/image";

interface InsightCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  bgColor?: string;
  backgroundImage?: string; // Background image path, if any
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  children,
  footer,
  bgColor = "bg-white",
  backgroundImage,
}) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col justify-between h-full overflow-hidden ${bgColor}`}
      style={{ minHeight: 0 }}
    >
      {/* If there is a backgroundImage, only render the background image, header, footer */}
      {backgroundImage && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Image
            src={backgroundImage}
            alt={title}
            width={220}
            height={220}
            style={{ objectFit: "contain"}}
            priority
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="relative z-10">
        <div className="font-semibold text-md text-white drop-shadow" style={{ color: bgColor === 'bg-white' ? 'var(--brand-1)' : undefined }}>{title}</div>
        {description && (
          <div className={`text-xs mb-4 ${bgColor === 'bg-white' ? 'text-gray-500' : 'text-white'}`}>{description}</div>
        )}
        
          
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
      
      {footer && <div className="relative z-10 mt-4 ">{footer}</div>}
    </div>
  );
}; 