import React from 'react';
import { calculateDeltaE, calculatePercentageMatch, rgbToHex } from '../utils/colorUtils';

const HistoryPanel = ({ history = [], maxItems = 3 }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📚 Mixing History
        </h3>
        <p className="text-gray-500 text-center py-8">
          Your mixing attempts will appear here
        </p>
      </div>
    );
  }

  const recentHistory = history.slice(-maxItems).reverse();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📚 Mixing History (Last {Math.min(maxItems, history.length)})
      </h3>
      
      <div className="space-y-4">
        {recentHistory.map((attempt, index) => {
          const deltaE = calculateDeltaE(attempt.targetColor, attempt.mixedColor);
          const percentage = calculatePercentageMatch(deltaE);
          const hexColor = rgbToHex(attempt.mixedColor.r, attempt.mixedColor.g, attempt.mixedColor.b);
          
          const getPercentageColor = (percent) => {
            if (percent >= 90) return 'text-green-600 bg-green-100';
            if (percent >= 75) return 'text-blue-600 bg-blue-100';
            if (percent >= 50) return 'text-yellow-600 bg-yellow-100';
            return 'text-red-600 bg-red-100';
          };

          return (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Mixed Color Preview */}
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: hexColor }}
              ></div>
              
              {/* Attempt Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Attempt #{history.length - index}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hexColor} • RGB({attempt.mixedColor.r}, {attempt.mixedColor.g}, {attempt.mixedColor.b})
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold px-2 py-1 rounded ${getPercentageColor(percentage)}`}>
                      {percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      ΔE: {Math.round(deltaE)}
                    </div>
                  </div>
                </div>
                
                {/* Color Breakdown */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 rounded bg-white border border-gray-200">
                    {attempt.colorPercentages.color1.label}: {attempt.colorPercentages.color1.percentage}%
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-white border border-gray-200">
                    {attempt.colorPercentages.color2.label}: {attempt.colorPercentages.color2.percentage}%
                  </span>
                  {attempt.colorPercentages.distractor.percentage > 0 && (
                    <span className="text-xs px-2 py-1 rounded bg-white border border-gray-200 border-dashed opacity-60">
                      {attempt.colorPercentages.distractor.label}: {attempt.colorPercentages.distractor.percentage}%
                    </span>
                  )}
                  {(attempt.colorPercentages.white > 0 || attempt.colorPercentages.black > 0) && (
                    <span className="text-xs px-2 py-1 rounded bg-white border border-gray-200">
                      W:{attempt.colorPercentages.white}% B:{attempt.colorPercentages.black}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {history.length > maxItems && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing last {maxItems} of {history.length} attempts
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
