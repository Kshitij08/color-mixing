# 🎨 Color Mixing Challenge

A React-based web application that challenges users to mix base colors to match target colors, simulating real-world painting techniques.

## ✨ Features

- **Interactive Color Mixing**: Use sliders to mix Red, Yellow, Blue, White, and Black
- **Real-time Preview**: See your mixed color update instantly as you adjust sliders
- **Subtractive Color Mixing**: Simulates real paint mixing behavior
- **Color Comparison**: Get detailed feedback with DeltaE calculations and percentage match
- **Smart Hints**: Receive helpful suggestions to improve your mix
- **History Tracking**: View your last 3 mixing attempts with results
- **New Challenges**: Generate random target colors for endless practice
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the app in action!

## 🎯 How to Play

1. **Study the Target**: Look at the target color on the left side
2. **Mix Colors**: Use the sliders to adjust the percentage of each base color
3. **Watch the Preview**: Your mixed color updates in real-time on the right
4. **Click "Mix Colors!"**: Submit your attempt and see how well you matched
5. **Get Feedback**: Review your percentage match, DeltaE score, and helpful hints
6. **Try Again**: Use the feedback to improve your mix, or start a new challenge

## 🎨 Color Mixing Tips

- **Red + Blue = Purple**
- **Red + Yellow = Orange** 
- **Blue + Yellow = Green**
- **White lightens colors**
- **Black darkens colors**
- **Start with small amounts and build up gradually**

## 🛠️ Technical Details

### Built With
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Canvas API** - For color previews and calculations
- **Custom Color Algorithms** - Subtractive mixing simulation

### Key Components
- `App.js` - Main application component
- `ColorSlider.js` - Interactive slider for color adjustment
- `ColorSwatch.js` - Color preview display
- `ResultDisplay.js` - Results and feedback display
- `HistoryPanel.js` - Mixing history tracking
- `colorUtils.js` - Color mixing and comparison algorithms

### Color Mixing Algorithm
The app uses a subtractive color mixing algorithm that simulates real paint behavior:
- Colors absorb their complementary wavelengths
- White lightens by adding to all RGB channels
- Black darkens by reducing all RGB channels
- DeltaE calculation provides accurate color difference measurement

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 Customization

You can easily customize the app by:
- Modifying the color mixing algorithm in `colorUtils.js`
- Adjusting the UI styling with Tailwind classes
- Adding new base colors to the mixing palette
- Changing the difficulty by adjusting the DeltaE thresholds

## 🚀 Deployment

To build for production:
```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment to any static hosting service.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Improving the color mixing algorithms
- Enhancing the UI/UX

---

**Happy Color Mixing! 🎨✨**
