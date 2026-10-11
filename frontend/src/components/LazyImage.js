import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />
      
      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-sm">Bild nicht verfügbar</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
