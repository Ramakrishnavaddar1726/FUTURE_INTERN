import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Veda Aesthetic Clinic',
  fallbackTitle = 'Clinical Precision',
  fallbackSubtitle = 'Aesthetic Medicine',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${containerClassName}`}>
      {/* Background skeleton/fallback */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50/40 to-stone-200 text-stone-600 p-4 select-none">
          <div className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-amber-800" />
          </div>
          <p className="font-serif text-sm font-medium text-stone-800 text-center">{fallbackTitle}</p>
          <p className="text-xs text-stone-500 text-center tracking-wider uppercase mt-0.5">{fallbackSubtitle}</p>
        </div>
      )}

      {/* Main Image */}
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
