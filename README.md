# Snake Game - Nostalgic Retro Snake

A classic Snake game with retro green-on-black graphics, optimized for mobile devices and ready for App Store deployment.

## Features

- 🐍 Classic Snake gameplay with nostalgic retro graphics
- 📱 Mobile-optimized with touch controls
- 🎮 Desktop keyboard controls (WASD/Arrow keys)
- 🔊 Sound effects for game events
- 📊 High score tracking with localStorage
- 💾 Progressive Web App (PWA) - installable on mobile
- 🎨 CRT-style visual effects for authentic retro feel

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: Zustand
- **Mobile**: Capacitor for iOS/Android builds
- **Canvas**: HTML5 Canvas for game rendering

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Mobile App Development

This project is configured for mobile app deployment:

- **iOS**: Built with Capacitor, ready for Xcode/App Store
- **Android**: Built with Capacitor, ready for Android Studio/Play Store
- **PWA**: Installable directly from web browsers

### Building Mobile Apps

```bash
# Build web assets
npm run build

# Sync with mobile platforms
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

## Deployment

### Web Deployment
The app is configured for deployment on Replit with automatic build and serve.

### App Store Deployment
- iOS and Android packages are pre-configured
- Codemagic CI/CD setup included for cloud builds
- Bundle ID: `com.snakegame.nostalgic`

## Project Structure

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Game logic and stores
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express server
├── ios/                   # iOS Capacitor project
├── android/               # Android Capacitor project
├── codemagic.yaml        # CI/CD configuration
└── capacitor.config.ts   # Capacitor configuration
```

## Game Controls

- **Desktop**: Arrow keys or WASD to move, Space to start/restart
- **Mobile**: Touch controls with D-pad layout, touch buttons for actions

## Browser Compatibility

- Chrome/Edge: Full support
- Safari: Full support including PWA installation
- Firefox: Full support
- Mobile browsers: Optimized experience with touch controls

## License

MIT License - Feel free to use and modify for your projects.