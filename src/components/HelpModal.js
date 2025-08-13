import React from 'react';
import { calculateOptimalMix, mixColors, rgbToHex, calculateDeltaE, calculatePercentageMatch } from '../utils/colorUtils';

const HelpModal = ({ isOpen, onClose, targetColor, colorPalette }) => {
  if (!isOpen || !targetColor || !colorPalette) {
    return null;
  }

  const optimalMix = calculateOptimalMix(targetColor, colorPalette);
  const optimalMixedColor = mixColors(optimalMix);
  const deltaE = calculateDeltaE(targetColor, optimalMixedColor);
  const percentage = calculatePercentageMatch(deltaE);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">🎯 Solution</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Color */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Target Color</h3>
            <div className="flex justify-center">
              <div 
                className="w-24 h-24 rounded-lg border-4 border-gray-300"
                style={{ 
                  backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rgbToHex(targetColor.r, targetColor.g, targetColor.b)} • RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
            </p>
          </div>

          {/* Optimal Mix */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Optimal Mix</h3>
            <div className="flex justify-center">
              <div 
                className="w-24 h-24 rounded-lg border-4 border-gray-300"
                style={{ 
                  backgroundColor: `rgb(${optimalMixedColor.r}, ${optimalMixedColor.g}, ${optimalMixedColor.b})` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rgbToHex(optimalMixedColor.r, optimalMixedColor.g, optimalMixedColor.b)} • RGB({optimalMixedColor.r}, {optimalMixedColor.g}, {optimalMixedColor.b})
            </p>
            <div className="mt-2">
              <span className={`text-lg font-bold ${percentage >= 90 ? 'text-green-600' : percentage >= 75 ? 'text-blue-600' : 'text-yellow-600'}`}>
                {percentage}% Match
              </span>
            </div>
          </div>

          {/* Color Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">🎨 Optimal Color Mix:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: `rgb(${optimalMix.color1.color.r}, ${optimalMix.color1.color.g}, ${optimalMix.color1.color.b})` }}
                    ></div>
                    <span className="font-medium">{optimalMix.color1.label}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{optimalMix.color1.percentage}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: `rgb(${optimalMix.color2.color.r}, ${optimalMix.color2.color.g}, ${optimalMix.color2.color.b})` }}
                    ></div>
                    <span className="font-medium">{optimalMix.color2.label}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{optimalMix.color2.percentage}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: `rgb(${optimalMix.distractor.color.r}, ${optimalMix.distractor.color.g}, ${optimalMix.distractor.color.b})` }}
                    ></div>
                    <span className="font-medium">{optimalMix.distractor.label}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{optimalMix.distractor.percentage}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border border-gray-300 bg-white"></div>
                    <span className="font-medium">White</span>
                  </div>
                  <span className="text-lg font-bold text-gray-600">{optimalMix.white}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border border-gray-300 bg-black"></div>
                    <span className="font-medium">Black</span>
                  </div>
                  <span className="text-lg font-bold text-gray-600">{optimalMix.black}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mixing Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📝 Mixing Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Start with {optimalMix.color1.percentage}% {optimalMix.color1.label}</li>
              <li>Add {optimalMix.color2.percentage}% {optimalMix.color2.label}</li>
              {optimalMix.distractor.percentage > 0 && <li>Add {optimalMix.distractor.percentage}% {optimalMix.distractor.label}</li>}
              {optimalMix.white > 0 && <li>Lighten with {optimalMix.white}% White</li>}
              {optimalMix.black > 0 && <li>Darken with {optimalMix.black}% Black</li>}
              <li>Mix thoroughly until uniform</li>
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li>Start with the primary colors first</li>
              <li>Add white/black gradually to fine-tune</li>
              <li>Mix in small amounts and test frequently</li>
              <li>Remember: you can always add more, but it's harder to take away</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
