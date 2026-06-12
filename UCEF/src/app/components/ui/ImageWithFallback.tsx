/**
 * src/app/components/ui/ImageWithFallback.tsx
 * UI Utility for resilient image rendering.
 */

import React, { useState } from 'react';

// Constant for the fallback SVG icon
const ERROR_IMG_SRC = 'data:image/svg+xml;base64,...';

/**
 * Handles image loading errors by providing a glassmorphic-friendly fallback.
 */
export const ImageWithFallback = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  // Renders a fallback div if the source fails, maintaining layout consistency (NFR-05)
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  );
};
