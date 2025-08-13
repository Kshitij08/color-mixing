import React from 'react';
import { rgbToHex } from '../utils/colorUtils';

const ColorSwatch = ({ 
  color, 
  label, 
  size = "large", 
  showHex = true, 
  isTarget = false,
  className = "" 
}) => {
  const hexColor = rgbToHex(color.r, color.g, color.b);
  
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32",
    xlarge: "w-40 h-40"
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} color-swatch rounded-lg shadow-lg transition-all duration-300 ${
            isTarget ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
          }`}
          style={{ backgroundColor: hexColor }}
        >
          {isTarget && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
              TARGET
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <h3 className={`font-semibold ${isTarget ? 'text-yellow-700' : 'text-gray-700'}`}>
          {label}
        </h3>
        {showHex && (
          <p className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded mt-1">
            {hexColor}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          RGB({color.r}, {color.g}, {color.b})
        </p>
      </div>
    </div>
  );
};

export default ColorSwatch;
