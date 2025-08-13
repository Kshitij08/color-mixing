import React from 'react';
import { calculateDeltaE, calculatePercentageMatch, getFeedbackMessage, getColorHints, getMixingTips } from '../utils/colorUtils';

const ResultDisplay = ({ targetColor, mixedColor, colorPercentages, timeTaken, isVisible = false }) => {
  if (!isVisible || !targetColor || !mixedColor) {
    return null;
  }

  const deltaE = calculateDeltaE(targetColor, mixedColor);
  const percentage = calculatePercentageMatch(deltaE);
  const feedback = getFeedbackMessage(deltaE, targetColor, mixedColor);
  const hints = getColorHints(targetColor, mixedColor, colorPercentages);
  const mixingTips = getMixingTips(colorPercentages.color1, colorPercentages.color2);

  const getPercentageColor = (percent) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 75) return 'text-blue-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeltaEColor = (deltaE) => {
    if (deltaE <= 50) return 'text-green-600';
    if (deltaE <= 100) return 'text-blue-600';
    if (deltaE <= 150) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-800 text-center">
        Mixing Results
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Percentage Match */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getPercentageColor(percentage)}`}>
            {percentage}%
          </div>
          <div className="text-sm text-gray-600">Match</div>
        </div>
        
        {/* DeltaE */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-2xl font-bold ${getDeltaEColor(deltaE)}`}>
            {Math.round(deltaE)}
          </div>
          <div className="text-sm text-gray-600">DeltaE</div>
        </div>
        
        {/* Time Taken */}
        {timeTaken && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ⏱️ {formatTime(timeTaken)}
            </div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        )}
        
        {/* Feedback */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">
            {feedback}
          </div>
        </div>
      </div>
      
      {/* Color Mixing Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">🎨 Mixing Tips:</h4>
        <ul className="space-y-1">
          {mixingTips.map((tip, index) => (
            <li key={index} className="text-sm text-green-700 flex items-center">
              <span className="mr-2">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Color Hints */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Hints:</h4>
        <ul className="space-y-1">
          {hints.map((hint, index) => (
            <li key={index} className="text-sm text-blue-700 flex items-center">
              <span className="mr-2">•</span>
              {hint}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Color Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <h4 className="font-semibold text-gray-700 mb-2">Target Color</h4>
          <div className="flex justify-center">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-gray-300"
              style={{ 
                backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="font-semibold text-gray-700 mb-2">Your Mix</h4>
          <div className="flex justify-center">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-gray-300"
              style={{ 
                backgroundColor: `rgb(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b})` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Color Breakdown */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">🎨 Your Color Mix:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: `rgb(${colorPercentages.color1.color.r}, ${colorPercentages.color1.color.g}, ${colorPercentages.color1.color.b})` }}
            ></div>
            <span>{colorPercentages.color1.label}: {colorPercentages.color1.percentage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: `rgb(${colorPercentages.color2.color.r}, ${colorPercentages.color2.color.g}, ${colorPercentages.color2.color.b})` }}
            ></div>
            <span>{colorPercentages.color2.label}: {colorPercentages.color2.percentage}%</span>
          </div>
          <div className="flex items-center space-x-2 opacity-60">
            <div 
              className="w-4 h-4 rounded border border-gray-300 border-dashed"
              style={{ backgroundColor: `rgb(${colorPercentages.distractor.color.r}, ${colorPercentages.distractor.color.g}, ${colorPercentages.distractor.color.b})` }}
            ></div>
            <span>{colorPercentages.distractor.label}: {colorPercentages.distractor.percentage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border border-gray-300 bg-gradient-to-br from-white to-gray-300"></div>
            <span>White: {colorPercentages.white}% | Black: {colorPercentages.black}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
