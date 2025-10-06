# 🧪 Periodic Table Puzzle - Ghosgo

![Ghosgo Logo](https://img.shields.io/badge/Made%20by-Ghosgo-blue?style=for-the-badge&logo=atom)
![Version](https://img.shields.io/badge/Version-2.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

An interactive, educational periodic table puzzle game that challenges players to place chemical elements in their correct positions. Built with modern web technologies and featuring a sleek, responsive design.

## 🎮 Game Features

### 🎯 Core Gameplay
- **Memory Challenge**: Empty periodic table boxes with no hints - test your chemistry knowledge!
- **Progressive Difficulty**: Start with 10 elements, add 5 more each level
- **Drag & Drop Interface**: Intuitive controls for both desktop and mobile
- **Sound Effects**: Audio feedback for correct/wrong placements and celebrations
- **Visual Celebrations**: Fireworks and confetti effects on level completion

### 🎨 Visual Design
- **Modern Dark Theme**: Sleek, professional interface with glassmorphism effects
- **Ghosgo Branding**: Custom logo with animated orbital ring
- **Color-Coded Categories**: 9 different element types with distinct colors
- **Responsive Layout**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Smooth Animations**: Particle effects, hover states, and transitions

### 📱 Mobile Optimization
- **Touch-Friendly**: Native touch drag-and-drop for mobile devices
- **Responsive Grid**: Adapts periodic table size to screen dimensions
- **Optimized Controls**: Larger touch targets and improved spacing
- **Horizontal Scrolling**: Smooth navigation on small screens

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation
1. **Download** or clone this repository
2. **Open** `index.html` in your web browser
3. **Start playing** immediately!

```bash
# Clone the repository
git clone https://github.com/Coder-Madhvan/periodic-table-puzzle.git

# Navigate to the project directory
cd periodic-table-puzzle

# Open in browser
open index.html
```

## 🎲 How to Play

1. **Start the Game**: Click "🚀 Start Adventure" on the welcome screen
2. **Study the Elements**: Look at the draggable elements in the bottom panel
3. **Drag & Drop**: Move elements to their correct positions in the periodic table
4. **Listen for Feedback**: 
   - ✅ Ascending musical notes = Correct placement
   - ❌ Descending tone = Wrong placement
5. **Complete Levels**: Fill all positions to advance to the next level
6. **Celebrate**: Enjoy fireworks and confetti on level completion!

### 🎯 Game Controls
- **Start/Pause**: Control game flow
- **Shuffle**: Randomize element order
- **Hint**: Get help when stuck
- **Theme Toggle**: Switch between themes
- **Music Toggle**: Control background music

## 🏗️ Technical Architecture

### 📁 File Structure
```
periodic-table-puzzle/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── script.js           # Game logic and interactions
├── elements.js         # Periodic table data (118 elements)
├── README.md          # This documentation
└── sounds/            # Audio files (optional)
    ├── correct.mp3
    ├── wrong.mp3
    └── celebration.mp3
```

### 🛠️ Technologies Used
- **HTML5**: Semantic structure and drag-and-drop API
- **CSS3**: 
  - CSS Grid for periodic table layout
  - Flexbox for responsive components
  - CSS Variables for theming
  - Animations and transitions
  - Media queries for responsiveness
- **Vanilla JavaScript**:
  - DOM manipulation
  - Event handling (mouse & touch)
  - Web Audio API for sound effects
  - Local storage for game state
  - Canvas API for particle effects

### 🎨 Design System
- **Color Palette**: Dark theme with blue accent colors
- **Typography**: Segoe UI font family
- **Spacing**: 8px grid system
- **Animations**: Cubic-bezier easing functions
- **Responsive Breakpoints**: 768px (tablet), 480px (mobile)

## 🧪 Element Categories

The game includes all 118 chemical elements organized into 9 categories:

| Category | Color | Elements |
|----------|-------|----------|
| Alkali Metals | Red | Li, Na, K, Rb, Cs, Fr |
| Alkaline Earth | Orange | Be, Mg, Ca, Sr, Ba, Ra |
| Transition Metals | Yellow | Sc-Zn, Y-Cd, Hf-Hg, Rf-Cn |
| Post-Transition | Green | Al, Ga, In, Sn, Tl, Pb, Bi, Po |
| Metalloids | Blue | B, Si, Ge, As, Sb, Te |
| Nonmetals | Purple | H, C, N, O, P, S, Se |
| Noble Gases | Pink | He, Ne, Ar, Kr, Xe, Rn, Og |
| Lanthanides | Magenta | La-Lu |
| Actinides | Red-Orange | Ac-Lr |

## 🏆 Achievement System

Unlock badges by completing various challenges:
- 🎯 **First Element**: Place your first element correctly
- 🔥 **Combo Master**: Achieve a 5x combo streak
- ⚡ **Speed Demon**: Complete a level in under 2 minutes
- 💎 **Perfectionist**: Complete a level without mistakes

## 📱 Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | Full support |
| Edge | ✅ | ✅ | Full support |
| Opera | ✅ | ✅ | Full support |

## 🎯 Educational Value

This game helps students and chemistry enthusiasts:
- **Memorize** element positions in the periodic table
- **Understand** periodic trends and patterns
- **Learn** element symbols and atomic numbers
- **Practice** spatial reasoning and memory skills
- **Explore** chemical element categories

## 🔧 Customization

### Adding New Features
The codebase is modular and easy to extend:

```javascript
// Add new element categories in elements.js
const newElement = {
    number: 119,
    symbol: 'Xx',
    name: 'Example',
    category: 'new-category',
    row: 8,
    col: 1
};

// Add new sounds in script.js
function playCustomSound() {
    // Web Audio API implementation
}

// Add new animations in style.css
@keyframes customAnimation {
    /* CSS animation keyframes */
}
```

### Theming
Customize colors by modifying CSS variables in `style.css`:

```css
:root {
    --accent-primary: #your-color;
    --bg-primary: #your-background;
    /* Add more custom variables */
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 🐛 Bug Reports
Found a bug? Please open an issue with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Madhvan Vaghamshi**  
*Ghosgo*

- 🌐 Website: [ghosgo.com](https://ghosgo.com)
- 📧 Email: contact@ghosgo.com
- 💼 LinkedIn: [madhvan-vaghamshi](https://linkedin.com/in/madhvan-vaghamshi)

## 🙏 Acknowledgments

- **Periodic Table Data**: Based on IUPAC standards
- **Design Inspiration**: Modern chemistry education tools
- **Community**: Thanks to all testers and contributors

## 📊 Statistics

- **118 Elements**: Complete periodic table
- **9 Categories**: All major element groups
- **Responsive Design**: Works on all devices
- **Zero Dependencies**: Pure vanilla JavaScript
- **Educational**: Suitable for all ages

---

<div align="center">
  <strong>Made with ❤️ by Ghosgo - Madhvan Vaghamshi</strong><br>
  <em>© 2024 Ghosgo. All rights reserved.</em>
</div>
