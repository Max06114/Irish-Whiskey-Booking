import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extrahiere Dateinamen und erstelle WebP-Pfad
  const getImagePaths = (imgSrc) => {
    // Wenn es ein lokales Bild ist (beginnt mit /)
    if (imgSrc.startsWith('/')) {
      const basePath = imgSrc.replace(/\.(jpg|jpeg|png)$/i, '');
      return {
        webp: `${basePath}.webp`,
        fallback: imgSrc
      };
    }
    // Für externe URLs (Unsplash etc.)
    return {
      webp: null,
      fallback: imgSrc
    };
  };

  const { webp, fallback } = getImagePaths(src);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      
      {/* Picture element mit WebP support */}
      <picture>
        {webp && <source srcSet={webp} type="image/webp" />}
        <img
          src={fallback}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      </picture>
      
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
