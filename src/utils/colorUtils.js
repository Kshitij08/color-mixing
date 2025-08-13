// Color mixing utilities for the Color Mixing Challenge

// Base colors in RGB format
export const BASE_COLORS = {
  red: { r: 255, g: 0, b: 0 },
  yellow: { r: 255, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  green: { r: 0, g: 255, b: 0 },
  purple: { r: 128, g: 0, b: 128 },
  orange: { r: 255, g: 165, b: 0 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 }
};

// Convert RGB to XYZ (using sRGB standard)
export function rgbToXyz(r, g, b) {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return { x: x * 100, y: y * 100, z: z * 100 };
}

// Convert XYZ to LAB
export function xyzToLab(x, y, z) {
  // D65 white point
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  x = x / xn;
  y = y / yn;
  z = z / zn;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return { l, a, b };
}

// Convert RGB to LAB
export function rgbToLab(r, g, b) {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

// Convert LAB to XYZ
export function labToXyz(l, a, b) {
  const yn = 100.000;
  const xn = 95.047;
  const zn = 108.883;

  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787;
  y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787;
  z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787;

  return {
    x: x * xn,
    y: y * yn,
    z: z * zn
  };
}

// Convert XYZ to RGB
export function xyzToRgb(x, y, z) {
  x = x / 100;
  y = y / 100;
  z = z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1/2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

// Convert LAB to RGB
export function labToRgb(l, a, b) {
  const xyz = labToXyz(l, a, b);
  return xyzToRgb(xyz.x, xyz.y, xyz.z);
}

// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to RGB
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// CIEDE2000 color difference algorithm
export function calculateDeltaE2000(lab1, lab2) {
  const kL = 1;
  const kC = 1;
  const kH = 1;

  const L1 = lab1.l;
  const a1 = lab1.a;
  const b1 = lab1.b;
  const L2 = lab2.l;
  const a2 = lab2.a;
  const b2 = lab2.b;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cb = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const Cbp = (C1p + C2p) / 2;

  let h1p = Math.atan2(b1, a1p);
  if (h1p < 0) h1p += 2 * Math.PI;

  let h2p = Math.atan2(b2, a2p);
  if (h2p < 0) h2p += 2 * Math.PI;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp = h2p - h1p;
  if (dhp > Math.PI) dhp -= 2 * Math.PI;
  if (dhp < -Math.PI) dhp += 2 * Math.PI;

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / 2);

  let Hp;
  if (Math.abs(h1p - h2p) <= Math.PI) {
    Hp = (h1p + h2p) / 2;
  } else {
    if (h1p + h2p < 2 * Math.PI) {
      Hp = (h1p + h2p + 2 * Math.PI) / 2;
    } else {
      Hp = (h1p + h2p - 2 * Math.PI) / 2;
    }
  }

  const T = 1 - 0.17 * Math.cos(Hp - Math.PI / 6) + 0.24 * Math.cos(2 * Hp) + 0.32 * Math.cos(3 * Hp + Math.PI / 30) - 0.2 * Math.cos(4 * Hp - Math.PI * 21 / 60);

  const SL = 1 + (0.015 * Math.pow(L1 + L2 - 50, 2)) / Math.sqrt(20 + Math.pow(L1 + L2 - 50, 2));
  const SC = 1 + 0.045 * Cbp;
  const SH = 1 + 0.015 * Cbp * T;

  const RT = -2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + Math.pow(25, 7))) * Math.sin(Math.PI / 3 * Math.exp(-Math.pow((Hp * 180 / Math.PI - 275) / 25, 2)));

  const dE = Math.sqrt(
    Math.pow(dLp / (kL * SL), 2) +
    Math.pow(dCp / (kC * SC), 2) +
    Math.pow(dHp / (kH * SH), 2) +
    RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
  );

  return dE;
}

// Calculate DeltaE using CIEDE2000 algorithm (human-perceived color difference)
export function calculateDeltaE(color1, color2) {
  const lab1 = rgbToLab(color1.r, color1.g, color1.b);
  const lab2 = rgbToLab(color2.r, color2.g, color2.b);
  return calculateDeltaE2000(lab1, lab2);
}

// Mix colors using additive mixing (like light mixing)
export function mixColors(colorPercentages) {
  const { color1, color2, distractor, white, black } = colorPercentages;
  
  // Start with black base for additive mixing
  let mixedColor = { r: 0, g: 0, b: 0 };
  
  // Apply additive mixing for the two main colors
  if (color1.percentage > 0) {
    const factor = color1.percentage / 100;
    const colorRGB = color1.color;
    
    // Add the color components (additive mixing)
    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }
  
  if (color2.percentage > 0) {
    const factor = color2.percentage / 100;
    const colorRGB = color2.color;
    
    // Add the color components (additive mixing)
    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }
  
  // Apply distractor color (subtle effect)
  if (distractor.percentage > 0) {
    const factor = distractor.percentage / 100 * 0.2; // Reduced effect
    const colorRGB = distractor.color;
    
    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }
  
  // White lightens the color (additive)
  if (white > 0) {
    const whiteFactor = white / 100;
    const whiteAmount = 255 * whiteFactor;
    mixedColor.r = Math.min(255, mixedColor.r + whiteAmount);
    mixedColor.g = Math.min(255, mixedColor.g + whiteAmount);
    mixedColor.b = Math.min(255, mixedColor.b + whiteAmount);
  }
  
  // Black darkens the color (subtractive from the result)
  if (black > 0) {
    const blackFactor = black / 100;
    mixedColor.r *= (1 - blackFactor);
    mixedColor.g *= (1 - blackFactor);
    mixedColor.b *= (1 - blackFactor);
  }
  
  return {
    r: Math.round(Math.min(255, Math.max(0, mixedColor.r))),
    g: Math.round(Math.min(255, Math.max(0, mixedColor.g))),
    b: Math.round(Math.min(255, Math.max(0, mixedColor.b)))
  };
}

// Test function to verify color mixing (for debugging)
export function testColorMixing() {
  console.log("Testing color mixing...");
  
  // Test the specific target color from the screenshot
  const targetColor = { r: 24, g: 103, b: 155 }; // #18679b
  const { h, s, l } = rgbToHsl(targetColor.r, targetColor.g, targetColor.b);
  console.log("Target color #18679b:");
  console.log("RGB:", targetColor);
  console.log("HSL:", { h: Math.round(h), s: Math.round(s), l: Math.round(l) });
  console.log("Hue classification:", h >= 160 && h <= 200 ? "TEAL" : h >= 240 && h <= 300 ? "PURPLE" : "OTHER");
  
  // Test the magenta target color from the new screenshot
  const magentaTarget = { r: 187, g: 49, b: 136 }; // #bb3188
  const { h: h2, s: s2, l: l2 } = rgbToHsl(magentaTarget.r, magentaTarget.g, magentaTarget.b);
  console.log("Target color #bb3188 (magenta):");
  console.log("RGB:", magentaTarget);
  console.log("HSL:", { h: Math.round(h2), s: Math.round(s2), l: Math.round(l2) });
  console.log("Hue classification:", h2 >= 300 && h2 <= 360 ? "MAGENTA" : h2 >= 240 && h2 <= 300 ? "PURPLE" : "OTHER");
  
  // Test the blue target color from the latest screenshot
  const blueTarget = { r: 76, g: 117, b: 172 }; // #4c75ac
  const { h: h3, s: s3, l: l3 } = rgbToHsl(blueTarget.r, blueTarget.g, blueTarget.b);
  console.log("Target color #4c75ac (blue):");
  console.log("RGB:", blueTarget);
  console.log("HSL:", { h: Math.round(h3), s: Math.round(s3), l: Math.round(l3) });
  console.log("Hue classification:", h3 >= 210 && h3 <= 240 ? "BLUE" : h3 >= 240 && h3 <= 300 ? "PURPLE" : "OTHER");
  
  // Test 100% orange
  const orangeTest = mixColors({
    color1: { name: 'orange', color: BASE_COLORS.orange, percentage: 100 },
    color2: { name: 'yellow', color: BASE_COLORS.yellow, percentage: 0 },
    distractor: { name: 'blue', color: BASE_COLORS.blue, percentage: 0 },
    white: 0,
    black: 0
  });
  
  console.log("100% Orange result:", orangeTest);
  console.log("Expected orange RGB:", BASE_COLORS.orange);
  
  // Test 100% yellow
  const yellowTest = mixColors({
    color1: { name: 'yellow', color: BASE_COLORS.yellow, percentage: 100 },
    color2: { name: 'orange', color: BASE_COLORS.orange, percentage: 0 },
    distractor: { name: 'blue', color: BASE_COLORS.blue, percentage: 0 },
    white: 0,
    black: 0
  });
  
  console.log("100% Yellow result:", yellowTest);
  console.log("Expected yellow RGB:", BASE_COLORS.yellow);
  
  // Test teal mixing (blue + green)
  const tealTest = mixColors({
    color1: { name: 'blue', color: BASE_COLORS.blue, percentage: 50 },
    color2: { name: 'green', color: BASE_COLORS.green, percentage: 50 },
    distractor: { name: 'red', color: BASE_COLORS.red, percentage: 0 },
    white: 0,
    black: 0
  });
  
  console.log("50% Blue + 50% Green result:", tealTest);
  console.log("This should create a bright teal color");
  
  // Test with white to make it brighter
  const brightTealTest = mixColors({
    color1: { name: 'blue', color: BASE_COLORS.blue, percentage: 40 },
    color2: { name: 'green', color: BASE_COLORS.green, percentage: 40 },
    distractor: { name: 'red', color: BASE_COLORS.red, percentage: 0 },
    white: 20,
    black: 0
  });
  
  console.log("40% Blue + 40% Green + 20% White result:", brightTealTest);
  console.log("This should create an even brighter teal color");
}

// Convert RGB to hex string
export function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert hex string to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Generate a random target color
export function generateRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

// Calculate percentage match based on DeltaE
export function calculatePercentageMatch(deltaE) {
  // CIEDE2000 DeltaE values:
  // 0-1: Not perceptible by human eyes
  // 1-2: Perceptible through close observation
  // 2-10: Perceptible at a glance
  // 11+: More than just noticeable difference
  
  // For a 100% match, we want DeltaE < 1
  // For a 0% match, we consider DeltaE > 50
  const maxDeltaE = 50;
  const percentage = Math.max(0, 100 - (deltaE / maxDeltaE) * 100);
  return Math.round(percentage);
}

// Get feedback message based on color difference
export function getFeedbackMessage(deltaE, targetColor, mixedColor) {
  const percentage = calculatePercentageMatch(deltaE);
  
  // CIEDE2000 DeltaE thresholds:
  // 0-1: Not perceptible by human eyes
  // 1-2: Perceptible through close observation
  // 2-10: Perceptible at a glance
  // 11+: More than just noticeable difference
  
  if (deltaE < 1) {
    return "Perfect match! 🎉";
  } else if (deltaE < 2) {
    return "Excellent! Nearly perfect! 👏";
  } else if (deltaE < 5) {
    return "Very good! Very close! 👍";
  } else if (deltaE < 10) {
    return "Good job! Getting closer! 💪";
  } else if (deltaE < 20) {
    return "Not bad! Keep trying! 🎨";
  } else {
    return "Keep mixing! You can do it! 🎨";
  }
}

// Get specific color adjustment hints
export function getColorHints(targetColor, mixedColor, colorPercentages) {
  const hints = [];
  
  if (mixedColor.r < targetColor.r - 30) hints.push("Add more red");
  if (mixedColor.r > targetColor.r + 30) hints.push("Reduce red");
  
  if (mixedColor.g < targetColor.g - 30) hints.push("Add more green");
  if (mixedColor.g > targetColor.g + 30) hints.push("Reduce green");
  
  if (mixedColor.b < targetColor.b - 30) hints.push("Add more blue");
  if (mixedColor.b > targetColor.b + 30) hints.push("Reduce blue");
  
  if (targetColor.r + targetColor.g + targetColor.b > mixedColor.r + mixedColor.g + mixedColor.b + 100) {
    hints.push("Add more white");
  } else if (targetColor.r + targetColor.g + targetColor.b < mixedColor.r + mixedColor.g + mixedColor.b - 100) {
    hints.push("Add more black");
  }
  
  return hints.length > 0 ? hints : ["You're very close!"];
}

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate color palette for a target color
export function generateColorPalette(targetColor) {
  const { h, s, l } = rgbToHsl(targetColor.r, targetColor.g, targetColor.b);
  
  // Define available colors
  const availableColors = [
    { name: 'red', color: BASE_COLORS.red, label: 'Red' },
    { name: 'yellow', color: BASE_COLORS.yellow, label: 'Yellow' },
    { name: 'blue', color: BASE_COLORS.blue, label: 'Blue' },
    { name: 'green', color: BASE_COLORS.green, label: 'Green' },
    { name: 'purple', color: BASE_COLORS.purple, label: 'Purple' },
    { name: 'orange', color: BASE_COLORS.orange, label: 'Orange' }
  ];
  
  // For blue colors (high blue component, moderate red/green)
  if (h >= 210 && h <= 240) { // Blue range
    const blueColor = availableColors.find(c => c.name === 'blue');
    const greenColor = availableColors.find(c => c.name === 'green');
    const redColor = availableColors.find(c => c.name === 'red');
    
    const colors = shuffleArray([
      {
        name: blueColor.name,
        color: blueColor.color,
        label: blueColor.label,
        percentage: 0
      },
      {
        name: greenColor.name,
        color: greenColor.color,
        label: greenColor.label,
        percentage: 0
      },
      {
        name: redColor.name,
        color: redColor.color,
        label: redColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For magenta/fuchsia colors (high red, low green, medium blue)
  if (h >= 300 && h <= 360) { // Magenta range
    const redColor = availableColors.find(c => c.name === 'red');
    const blueColor = availableColors.find(c => c.name === 'blue');
    const greenColor = availableColors.find(c => c.name === 'green');
    
    const colors = shuffleArray([
      {
        name: redColor.name,
        color: redColor.color,
        label: redColor.label,
        percentage: 0
      },
      {
        name: blueColor.name,
        color: blueColor.color,
        label: blueColor.label,
        percentage: 0
      },
      {
        name: greenColor.name,
        color: greenColor.color,
        label: greenColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For teal/cyan/blue-green colors, we need a special approach
  // Teal is between blue and green in the color wheel
  if (h >= 150 && h <= 210) { // Expanded teal/cyan range
    // For teal, we want blue and green as primary colors
    const blueColor = availableColors.find(c => c.name === 'blue');
    const greenColor = availableColors.find(c => c.name === 'green');
    const redColor = availableColors.find(c => c.name === 'red');
    
    const colors = shuffleArray([
      {
        name: blueColor.name,
        color: blueColor.color,
        label: blueColor.label,
        percentage: 0
      },
      {
        name: greenColor.name,
        color: greenColor.color,
        label: greenColor.label,
        percentage: 0
      },
      {
        name: redColor.name,
        color: redColor.color,
        label: redColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For purple colors, we need red and blue
  if (h >= 240 && h <= 300) { // Purple range
    const redColor = availableColors.find(c => c.name === 'red');
    const blueColor = availableColors.find(c => c.name === 'blue');
    const yellowColor = availableColors.find(c => c.name === 'yellow');
    
    const colors = shuffleArray([
      {
        name: redColor.name,
        color: redColor.color,
        label: redColor.label,
        percentage: 0
      },
      {
        name: blueColor.name,
        color: blueColor.color,
        label: blueColor.label,
        percentage: 0
      },
      {
        name: yellowColor.name,
        color: yellowColor.color,
        label: yellowColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For red-orange colors
  if (h >= 0 && h <= 60) { // Red to orange range
    const redColor = availableColors.find(c => c.name === 'red');
    const orangeColor = availableColors.find(c => c.name === 'orange');
    const blueColor = availableColors.find(c => c.name === 'blue');
    
    const colors = shuffleArray([
      {
        name: redColor.name,
        color: redColor.color,
        label: redColor.label,
        percentage: 0
      },
      {
        name: orangeColor.name,
        color: orangeColor.color,
        label: orangeColor.label,
        percentage: 0
      },
      {
        name: blueColor.name,
        color: blueColor.color,
        label: blueColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For yellow-green colors
  if (h >= 60 && h <= 120) { // Yellow to green range
    const yellowColor = availableColors.find(c => c.name === 'yellow');
    const greenColor = availableColors.find(c => c.name === 'green');
    const purpleColor = availableColors.find(c => c.name === 'purple');
    
    const colors = shuffleArray([
      {
        name: yellowColor.name,
        color: yellowColor.color,
        label: yellowColor.label,
        percentage: 0
      },
      {
        name: greenColor.name,
        color: greenColor.color,
        label: greenColor.label,
        percentage: 0
      },
      {
        name: purpleColor.name,
        color: purpleColor.color,
        label: purpleColor.label,
        percentage: 0
      }
    ]);
    
    return {
      color1: colors[0],
      color2: colors[1],
      distractor: colors[2]
    };
  }
  
  // For other colors, use the distance-based approach
  const colorDistances = availableColors.map(color => ({
    ...color,
    distance: calculateDeltaE(targetColor, color.color)
  }));
  
  // Sort by distance and pick the 2 closest colors
  colorDistances.sort((a, b) => a.distance - b.distance);
  const primaryColors = colorDistances.slice(0, 2);
  
  // Pick a distractor color (farthest from target)
  const distractor = colorDistances[colorDistances.length - 1];
  
  const colors = shuffleArray([
    {
      name: primaryColors[0].name,
      color: primaryColors[0].color,
      label: primaryColors[0].label,
      percentage: 0
    },
    {
      name: primaryColors[1].name,
      color: primaryColors[1].color,
      label: primaryColors[1].label,
      percentage: 0
    },
    {
      name: distractor.name,
      color: distractor.color,
      label: distractor.label,
      percentage: 0
    }
  ]);
  
  return {
    color1: colors[0],
    color2: colors[1],
    distractor: colors[2]
  };
}

// Get color mixing tips based on the selected colors
export function getMixingTips(color1, color2) {
  const tips = [];
  
  if (color1.name === 'red' && color2.name === 'blue') {
    tips.push("Red + Blue = Purple");
  } else if (color1.name === 'red' && color2.name === 'yellow') {
    tips.push("Red + Yellow = Orange");
  } else if (color1.name === 'blue' && color2.name === 'yellow') {
    tips.push("Blue + Yellow = Green");
  } else if (color1.name === 'red' && color2.name === 'green') {
    tips.push("Red + Green = Brown");
  } else if (color1.name === 'blue' && color2.name === 'orange') {
    tips.push("Blue + Orange = Brown");
  } else {
    tips.push("Mix these colors to create new hues");
  }
  
  tips.push("Use white to lighten the color");
  tips.push("Use black to darken the color");
  tips.push("Start with small amounts and build up");
  
  return tips;
}

// Calculate optimal color mix for a target color
export function calculateOptimalMix(targetColor, colorPalette) {
  const { color1, color2 } = colorPalette;
  
  // Convert target to LAB for better optimization
  const targetLab = rgbToLab(targetColor.r, targetColor.g, targetColor.b);
  
  // Use a more sophisticated approach with iterative optimization
  let bestMix = null;
  let bestDeltaE = Infinity;
  
  // Try different combinations of the two primary colors with finer steps
  for (let c1 = 0; c1 <= 100; c1 += 1) {
    for (let c2 = 0; c2 <= 100; c2 += 1) {
      // Calculate the base mix with just the two colors
      const baseMix = mixColors({
        color1: { ...color1, percentage: c1 },
        color2: { ...color2, percentage: c2 },
        distractor: { ...colorPalette.distractor, percentage: 0 },
        white: 0,
        black: 0
      });
      
      // Calculate DeltaE for this base mix using LAB
      const baseDeltaE = calculateDeltaE(targetColor, baseMix);
      
      // Try adding white to lighten (more important with additive mixing)
      for (let white = 0; white <= 100; white += 1) {
        const lightMix = mixColors({
          color1: { ...color1, percentage: c1 },
          color2: { ...color2, percentage: c2 },
          distractor: { ...colorPalette.distractor, percentage: 0 },
          white: white,
          black: 0
        });
        
        const lightDeltaE = calculateDeltaE(targetColor, lightMix);
        
        if (lightDeltaE < bestDeltaE) {
          bestDeltaE = lightDeltaE;
          bestMix = {
            color1: { ...color1, percentage: c1 },
            color2: { ...color2, percentage: c2 },
            distractor: { ...colorPalette.distractor, percentage: 0 },
            white: white,
            black: 0
          };
        }
      }
      
      // Try adding black to darken (important for darker colors like #18679b)
      for (let black = 0; black <= 60; black += 1) {
        const darkMix = mixColors({
          color1: { ...color1, percentage: c1 },
          color2: { ...color2, percentage: c2 },
          distractor: { ...colorPalette.distractor, percentage: 0 },
          white: 0,
          black: black
        });
        
        const darkDeltaE = calculateDeltaE(targetColor, darkMix);
        
        if (darkDeltaE < bestDeltaE) {
          bestDeltaE = darkDeltaE;
          bestMix = {
            color1: { ...color1, percentage: c1 },
            color2: { ...color2, percentage: c2 },
            distractor: { ...colorPalette.distractor, percentage: 0 },
            white: 0,
            black: black
          };
        }
      }
      
      // Also check the base mix without white/black
      if (baseDeltaE < bestDeltaE) {
        bestDeltaE = baseDeltaE;
        bestMix = {
          color1: { ...color1, percentage: c1 },
          color2: { ...color2, percentage: c2 },
          distractor: { ...colorPalette.distractor, percentage: 0 },
          white: 0,
          black: 0
        };
      }
    }
  }
  
  // Fine-tune the best result with smaller increments
  if (bestMix) {
    const fineTuneRange = 10;
    const fineTuneStep = 1;
    
    for (let c1 = Math.max(0, bestMix.color1.percentage - fineTuneRange); 
         c1 <= Math.min(100, bestMix.color1.percentage + fineTuneRange); 
         c1 += fineTuneStep) {
      for (let c2 = Math.max(0, bestMix.color2.percentage - fineTuneRange); 
           c2 <= Math.min(100, bestMix.color2.percentage + fineTuneRange); 
           c2 += fineTuneStep) {
        
        const fineMix = mixColors({
          color1: { ...color1, percentage: c1 },
          color2: { ...color2, percentage: c2 },
          distractor: { ...colorPalette.distractor, percentage: 0 },
          white: bestMix.white,
          black: bestMix.black
        });
        
        const fineDeltaE = calculateDeltaE(targetColor, fineMix);
        
        if (fineDeltaE < bestDeltaE) {
          bestDeltaE = fineDeltaE;
          bestMix = {
            color1: { ...color1, percentage: c1 },
            color2: { ...color2, percentage: c2 },
            distractor: { ...colorPalette.distractor, percentage: 0 },
            white: bestMix.white,
            black: bestMix.black
          };
        }
      }
    }
    
    // Fine-tune white/black as well
    for (let white = Math.max(0, bestMix.white - fineTuneRange); 
         white <= Math.min(100, bestMix.white + fineTuneRange); 
         white += fineTuneStep) {
      for (let black = Math.max(0, bestMix.black - fineTuneRange); 
           black <= Math.min(100, bestMix.black + fineTuneRange); 
           black += fineTuneStep) {
        
        const fineMix = mixColors({
          color1: { ...color1, percentage: bestMix.color1.percentage },
          color2: { ...color2, percentage: bestMix.color2.percentage },
          distractor: { ...colorPalette.distractor, percentage: 0 },
          white: white,
          black: black
        });
        
        const fineDeltaE = calculateDeltaE(targetColor, fineMix);
        
        if (fineDeltaE < bestDeltaE) {
          bestDeltaE = fineDeltaE;
          bestMix = {
            color1: { ...color1, percentage: bestMix.color1.percentage },
            color2: { ...color2, percentage: bestMix.color2.percentage },
            distractor: { ...colorPalette.distractor, percentage: 0 },
            white: white,
            black: black
          };
        }
      }
    }
  }
  
  // If no good mix found, fall back to a simple approximation
  if (!bestMix) {
    // Simple fallback based on RGB values for additive mixing
    const targetSum = targetColor.r + targetColor.g + targetColor.b;
    
    // Calculate percentages based on RGB ratios
    let color1Percent = 0;
    let color2Percent = 0;
    
    if (color1.name === 'blue') {
      color1Percent = Math.min(100, (targetColor.b / 255) * 100);
    } else if (color1.name === 'green') {
      color1Percent = Math.min(100, (targetColor.g / 255) * 100);
    } else if (color1.name === 'red') {
      color1Percent = Math.min(100, (targetColor.r / 255) * 100);
    } else if (color1.name === 'yellow') {
      color1Percent = Math.min(100, ((targetColor.r + targetColor.g) / 510) * 100);
    } else if (color1.name === 'purple') {
      color1Percent = Math.min(100, ((targetColor.r + targetColor.b) / 510) * 100);
    } else if (color1.name === 'orange') {
      color1Percent = Math.min(100, ((targetColor.r * 0.7 + targetColor.g * 0.3) / 255) * 100);
    }
    
    if (color2.name === 'blue') {
      color2Percent = Math.min(100, (targetColor.b / 255) * 100);
    } else if (color2.name === 'green') {
      color2Percent = Math.min(100, (targetColor.g / 255) * 100);
    } else if (color2.name === 'red') {
      color2Percent = Math.min(100, (targetColor.r / 255) * 100);
    } else if (color2.name === 'yellow') {
      color2Percent = Math.min(100, ((targetColor.r + targetColor.g) / 510) * 100);
    } else if (color2.name === 'purple') {
      color2Percent = Math.min(100, ((targetColor.r + targetColor.b) / 510) * 100);
    } else if (color2.name === 'orange') {
      color2Percent = Math.min(100, ((targetColor.r * 0.7 + targetColor.g * 0.3) / 255) * 100);
    }
    
    bestMix = {
      color1: { ...color1, percentage: Math.round(color1Percent) },
      color2: { ...color2, percentage: Math.round(color2Percent) },
      distractor: { ...colorPalette.distractor, percentage: 0 },
      white: 0,
      black: 0
    };
  }
  
  return bestMix;
}
