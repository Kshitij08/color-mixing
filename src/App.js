import React, { useState, useEffect } from 'react';
import ColorSlider from './components/ColorSlider';
import ColorSwatch from './components/ColorSwatch';
import ResultDisplay from './components/ResultDisplay';
import HistoryPanel from './components/HistoryPanel';
import HelpModal from './components/HelpModal';
import { 
  mixColors, 
  generateRandomColor, 
  generateColorPalette,
  calculateDeltaE, 
  calculatePercentageMatch,
  testColorMixing
} from './utils/colorUtils';

function App() {
  // State for color mixing
  const [colorPercentages, setColorPercentages] = useState({
    color1: { name: '', color: { r: 0, g: 0, b: 0 }, label: '', percentage: 0 },
    color2: { name: '', color: { r: 0, g: 0, b: 0 }, label: '', percentage: 0 },
    distractor: { name: '', color: { r: 0, g: 0, b: 0 }, label: '', percentage: 0 },
    white: 0,
    black: 0
  });

  // State for target and mixed colors
  const [targetColor, setTargetColor] = useState(null);
  const [mixedColor, setMixedColor] = useState({ r: 255, g: 255, b: 255 });
  
  // State for UI
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  // State for time tracking
  const [startTime, setStartTime] = useState(null);

  // Generate initial target color and color palette
  useEffect(() => {
    generateNewChallenge();
    // Test color mixing to verify fix
    testColorMixing();
  }, []);

  // Update mixed color when percentages change
  useEffect(() => {
    const newMixedColor = mixColors(colorPercentages);
    setMixedColor(newMixedColor);
  }, [colorPercentages]);

  const generateNewChallenge = () => {
    const newTargetColor = generateRandomColor();
    setTargetColor(newTargetColor);
    
    // Generate color palette for this target
    const palette = generateColorPalette(newTargetColor);
    setColorPercentages({
      color1: palette.color1,
      color2: palette.color2,
      distractor: palette.distractor,
      white: 0,
      black: 0
    });
    
    setShowResults(false);
    setAttemptCount(prev => prev + 1);
    
    // Set start time for this challenge
    setStartTime(Date.now());
  };

  const handleSliderChange = (colorType, value) => {
    setColorPercentages(prev => ({
      ...prev,
      [colorType]: {
        ...prev[colorType],
        percentage: value
      }
    }));
  };

  const handleShadingChange = (shadingType, value) => {
    setColorPercentages(prev => ({
      ...prev,
      [shadingType]: value
    }));
  };

  const handleMix = () => {
    setShowResults(true);
    
    // Calculate time taken
    const timeTaken = startTime ? Date.now() - startTime : 0;
    const timeTakenSeconds = Math.round(timeTaken / 1000);
    
    // Calculate match percentage
    const deltaE = calculateDeltaE(targetColor, mixedColor);
    const matchPercentage = calculatePercentageMatch(deltaE);
    
    // Add to history
    const newAttempt = {
      targetColor,
      mixedColor,
      colorPercentages: { ...colorPercentages },
      timestamp: new Date().toISOString(),
      timeTaken: timeTakenSeconds,
      matchPercentage: matchPercentage,
      deltaE: deltaE
    };
    
    setHistory(prev => [...prev, newAttempt]);
  };

  const handleReset = () => {
    if (targetColor) {
      const palette = generateColorPalette(targetColor);
      setColorPercentages({
        color1: { ...palette.color1, percentage: 0 },
        color2: { ...palette.color2, percentage: 0 },
        distractor: { ...palette.distractor, percentage: 0 },
        white: 0,
        black: 0
      });
    }
    setShowResults(false);
    
    // Reset start time for this attempt
    setStartTime(Date.now());
  };

  const handleNewChallenge = () => {
    generateNewChallenge();
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  if (!targetColor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            🎨 Color Mixing Challenge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mix the two primary colors to match the target color, then adjust with white/black for shading!
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>Challenge #{attemptCount}</span>
            <span>•</span>
            <span>Attempts: {history.length}</span>
            {startTime && !showResults && (
              <>
                <span>•</span>
                <span className="text-purple-600 font-semibold">
                  ⏱️ {Math.round((Date.now() - startTime) / 1000)}s
                </span>
              </>
            )}
          </div>
        </div>

        {/* Color Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Target Color */}
          <ColorSwatch
            color={targetColor}
            label="Target Color"
            size="xlarge"
            isTarget={true}
            className="justify-self-center"
          />
          
          {/* Mixed Color */}
          <ColorSwatch
            color={mixedColor}
            label="Your Mix"
            size="xlarge"
            className="justify-self-center"
          />
        </div>

        {/* Color Sliders Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🎛️ Color Mixing Controls
            </h2>
            <button
              onClick={handleShowHelp}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              💡 Show Solution
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Color 1 */}
            <ColorSlider
              color="color1"
              value={colorPercentages.color1.percentage}
              onChange={(value) => handleSliderChange('color1', value)}
              label={colorPercentages.color1.label}
              colorHex={`rgb(${colorPercentages.color1.color.r}, ${colorPercentages.color1.color.g}, ${colorPercentages.color1.color.b})`}
            />
            
            {/* Primary Color 2 */}
            <ColorSlider
              color="color2"
              value={colorPercentages.color2.percentage}
              onChange={(value) => handleSliderChange('color2', value)}
              label={colorPercentages.color2.label}
              colorHex={`rgb(${colorPercentages.color2.color.r}, ${colorPercentages.color2.color.g}, ${colorPercentages.color2.color.b})`}
            />
            
            {/* Distractor Color */}
            <ColorSlider
              color="distractor"
              value={colorPercentages.distractor.percentage}
              onChange={(value) => handleSliderChange('distractor', value)}
              label={colorPercentages.distractor.label}
              colorHex={`rgb(${colorPercentages.distractor.color.r}, ${colorPercentages.distractor.color.g}, ${colorPercentages.distractor.color.b})`}
              isDistractor={true}
            />
            
            {/* White Shading */}
            <ColorSlider
              color="white"
              value={colorPercentages.white}
              onChange={(value) => handleShadingChange('white', value)}
              label="White"
              colorHex="#FFFFFF"
            />
            
            {/* Black Shading */}
            <ColorSlider
              color="black"
              value={colorPercentages.black}
              onChange={(value) => handleShadingChange('black', value)}
              label="Black"
              colorHex="#000000"
            />
          </div>
          
          {/* Color Palette Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎨 Available Colors:</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: `rgb(${colorPercentages.color1.color.r}, ${colorPercentages.color1.color.g}, ${colorPercentages.color1.color.b})` }}></div>
                <span className="text-sm text-blue-700">{colorPercentages.color1.label} (Primary)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: `rgb(${colorPercentages.color2.color.r}, ${colorPercentages.color2.color.g}, ${colorPercentages.color2.color.b})` }}></div>
                <span className="text-sm text-blue-700">{colorPercentages.color2.label} (Primary)</span>
              </div>
              <div className="flex items-center space-x-2 opacity-60">
                <div className="w-4 h-4 rounded border border-gray-300 border-dashed" style={{ backgroundColor: `rgb(${colorPercentages.distractor.color.r}, ${colorPercentages.distractor.color.g}, ${colorPercentages.distractor.color.b})` }}></div>
                <span className="text-sm text-blue-700">{colorPercentages.distractor.label} (Distractor)</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handleMix}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎨 Mix Colors!
            </button>
            
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              🔄 Reset
            </button>
            
            <button
              onClick={handleNewChallenge}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              🎯 New Challenge
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <ResultDisplay
            targetColor={targetColor}
            mixedColor={mixedColor}
            colorPercentages={colorPercentages}
            timeTaken={startTime ? Math.round((Date.now() - startTime) / 1000) : 0}
            isVisible={showResults}
          />
        )}

        {/* History Section */}
        <HistoryPanel history={history} maxItems={3} />

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            💡 Tip: Use the two primary colors to create the base hue, then adjust with white/black for shading!
          </p>
          <p className="mt-2">
            The distractor color is there to test your color mixing skills - try to avoid using it!
          </p>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={handleCloseHelp}
        targetColor={targetColor}
        colorPalette={colorPercentages}
      />
    </div>
  );
}

export default App;