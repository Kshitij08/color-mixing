import React from 'react';
import { rgbToHex } from '../utils/colorUtils';

const ColorSlider = ({ 
  color, 
  value, 
  onChange, 
  label, 
  colorHex, 
  min = 0, 
  max = 100
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: colorHex }}
          ></div>
          <span>{label}</span>
        </label>
        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {value}%
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      </div>
    </div>
  );
};

export default ColorSlider;
