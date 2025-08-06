# Replit.md

## Overview

This is a nostalgic Snake game application built with React/TypeScript on the frontend and Express.js on the backend. The application features a classic Snake game implementation with retro green-on-black graphics, modern UI components, audio support, and state management using Zustand. The game is fully optimized for mobile devices with touch controls and Progressive Web App (PWA) capabilities, making it ready for App Store deployment. The project is configured as a full-stack application with a PostgreSQL database using Drizzle ORM, though the current implementation uses in-memory storage.

**Latest Update (2025-08-06)**: Version 1.6.0 - Successfully resolved iOS build compilation and implemented hybrid icon approach for App Store Connect validation
- FIXED: Optimized all component positioning for better screen adaptation across devices
- FIXED: Game canvas now properly scales on mobile with responsive sizing (max 320px on mobile)
- FIXED: Touch controls enlarged to 56x56px (h-14 w-14) with better spacing and padding
- FIXED: Menu elements properly centered with adequate breathing room between components
- FIXED: Score display optimized with responsive typography and proper mobile sizing
- FIXED: App container uses full viewport height instead of forcing flex center alignment
- FIXED: Daily and weekly leaderboards now reset properly with separate database tracking
- FIXED: Users can achieve daily/weekly high scores without beating lifetime best
- FIXED: Smart score submission logic only adds to daily/weekly if it beats current period best
- Updated iOS app version to 1.6.0 (build 7) and Android version 1.6.0 (build 7) with Hunter Games app icon
- FIXED: CFBundleVersion and CURRENT_PROJECT_VERSION set to 7 (higher than previous build 6) to resolve Codemagic build errors
- UPDATED: Android versionCode 7 and versionName "1.6.0" to match iOS version consistency
- FIXED: Completely removed iOS Assets.xcassets directory to resolve persistent CompileAssetCatalogVariant build errors
- FIXED: Created proper iOS asset catalog (Assets.xcassets) with complete AppIcon.appiconset for App Store Connect
- FIXED: Added all required icon sizes (20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024) with proper Contents.json
- FIXED: Updated Info.plist to use CFBundleIconName pointing to AppIcon asset catalog instead of individual files
- FIXED: Resolved YAML parsing errors in Codemagic configuration by simplifying JSON file creation approach
- FIXED: Eliminated heredoc blocks and multi-line echo commands that caused YAML conflicts during build parsing
- MAJOR BREAKTHROUGH: iOS build now compiles successfully and reaches App Store Connect upload stage
- FIXED: Implemented hybrid icon approach with both individual files and asset catalog to satisfy App Store Connect requirements  
- FIXED: Added CFBundleIconName key pointing to AppIcon asset catalog while maintaining individual icon file references
- UPDATED: App icon set to Hunter Games retro snake logo with proper PNG format for iOS/Android/Web platforms
- BREAKTHROUGH: Build compiles successfully and reaches App Store Connect upload validation stage
- FINAL SOLUTION: Complete icon configuration with populated asset catalog to satisfy CFBundleIconName requirement
- COMPREHENSIVE APPROACH: Asset catalog with actual icon files (120, 152, 167, 1024) + individual icon files for complete coverage
- VALIDATED CONFIGURATION: Asset catalog structure with proper icon files that compiles successfully and provides required App Store metadata
- UPDATED: App icon set to Hunter Games retro snake logo with proper PNG format for iOS/Android/Web platforms
- FIXED: Touch controls positioned 90px from bottom to avoid overlapping Google AdSense banner ads
- FIXED: Score submission modal now appears for ANY score > 0 (not just high scores) for complete leaderboard tracking
- FIXED: Modal title changed from "New High Score!" to "Submit Your Score!" for consistency
- CRITICAL FIX: Added production API URL configuration for App Store deployed apps to connect to backend server
- ENHANCED: Added comprehensive error logging and Capacitor detection for mobile app debugging
- ENHANCED: Created centralized API configuration system with environment-based URL routing
- Added Game Center entitlement (com.apple.developer.game-center) to iOS app configuration
- Enhanced touch controls with improved event handling and responsiveness 
- Implemented proper ad timing: interstitial ads appear every other game over (2nd, 4th, 6th, etc.)
- Built full leaderboard system with daily/weekly/all-time rankings using PostgreSQL
- Added leaderboard API endpoints for score submission and retrieval  
- Created name input modal for score submissions (appears after any game over with score > 0)
- Added leaderboard buttons to both desktop menu and mobile touch controls
- Database schema includes player name, score, theme, and timestamp for comprehensive tracking
- Mobile UX improvements: centered and enlarged touch controls (h-12 w-12 buttons) for better usability
- Fixed React hook errors by adding explicit React imports and using Zustand 4.5.7
**Previous Update (2025-01-29)**: Fixed critical React hook compatibility issue and restored complete Google AdSense integration. App ID: ca-app-pub-8626828126160251~4239118513
**Developer**: Hunter Games by HeyKANB (kathrynbrown@heykanb.com)
- Banner Ad Unit: ca-app-pub-8626828126160251/5048803159 (320x50 bottom placement)
- Interstitial Ad Unit: ca-app-pub-8626828126160251/6485506895 (full-screen game over)

**Theme System Update (2025-01-30)**: Added complete theme/skin selection system with unlockable themes:
- Retro Classic (always available)
- Modern UI (unlocks at 100 points)  
- Halloween Spooky (unlocks at 200 points)
- Dynamic color schemes with real-time switching
- Visual effects (glow, gradients, rounded corners, scanlines)
- Persistent user preference storage
- Mobile-optimized theme selector interface

**Codemagic Build Update (2025-01-30)**: Fixed provisioning profile issues and simplified CocoaPods approach
- **Critical Fix**: Temporarily removed Game Center entitlement to resolve provisioning profile compatibility  
- **Critical Fix**: Simplified CocoaPods installation to avoid YAML parsing errors in codemagic.yaml
- Switched to Codemagic's native xcode-project build-ipa command for better compatibility
- Configured automatic code signing instead of manual to work with Codemagic provisioning
- Added proper deployment target (14.0), architecture settings (arm64), and Swift optimization
- **Next Step**: Update Codemagic provisioning profile to include Game Center capability
- Fixed missing shared Xcode scheme preventing archive creation
- **Previous Fix**: Resolved missing Capacitor files (config.xml, public directory, capacitor.config.json)
- Implemented manual file copy fallback when Capacitor sync fails
- Enhanced build process with comprehensive error handling and fallbacks
- **Apple ID**: 6749170406 (registered for App Store Connect)
- **Team ID**: TYRA6QN5W5 (Apple Developer Team)
- **App Store Connect Integration**: "Apple Connect App Mgr" with Key ID 7629KQWD3Z
- **Privacy Policy**: Integrated at `/privacy` route - resolves Jekyll deployment issues
- **Support Page**: Available at `/support` route for App Store Connect submission
- **Encryption Exemption**: Added ITSAppUsesNonExemptEncryption=false to Info.plist to skip encryption questions
- iOS automatic certificate and provisioning profile management ("ios provisioning profile")
- Android keystore integration with secure vault storage
- Professional deployment pipeline ready for App Store submission

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **Storage**: Currently using in-memory storage for user data
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Zustand for client-side state
- **Audio**: HTML5 Audio API for game sounds

## Key Components

### Frontend Architecture
- **Game Engine**: Custom Snake game logic with canvas rendering
- **Component Library**: Extensive Radix UI component collection in `client/src/components/ui/`
- **State Management**: Multiple Zustand stores for game state, audio, and general application state
- **Styling**: Tailwind CSS with custom theming and retro CRT effects

### Backend Architecture
- **Server**: Express.js with TypeScript, serving both API routes and static files
- **Database Layer**: Drizzle ORM configured for PostgreSQL with migration support
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Development Setup**: Vite integration for hot reload in development

### Game Implementation
- **Canvas Rendering**: Custom game canvas with theme-based styling and effects
- **Theme System**: Retro Classic (green CRT effects) and Modern UI (sleek blue design) options
- **Game Logic**: Snake movement, collision detection, food generation
- **Audio System**: Sound effects for game events with mute functionality
- **Controls**: Keyboard input handling (WASD, Arrow keys, Space) + Mobile touch controls
- **Mobile Optimization**: Responsive canvas sizing, touch controls with D-pad layout
- **PWA Features**: Service worker, web app manifest, installable on mobile devices

## Data Flow

### Game State Flow
1. Game starts in 'menu' state showing instructions
2. Player presses Space to transition to 'playing' state
3. Game loop runs continuously, updating snake position and checking for collisions
4. Score tracking and high score persistence to localStorage
5. Game over transitions to 'gameOver' state with restart option

### Audio Flow
1. Audio files loaded on app initialization
2. Zustand store manages audio state and mute functionality
3. Game events trigger audio playback through store actions
4. Mute state persists user preference

### Storage Flow
1. User operations go through IStorage interface
2. Currently implemented with MemStorage (in-memory)
3. Ready for PostgreSQL integration via existing Drizzle schema
4. User schema includes id, username, and password fields

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web framework
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire application

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with mobile-first responsive design
- **Radix UI**: Comprehensive component library for accessibility
- **Lucide React**: Icon library

### Mobile and PWA Features
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: App metadata for installation on mobile devices
- **Touch Controls**: Custom D-pad style touch controls for mobile gameplay
- **Responsive Design**: Mobile-optimized canvas sizing and UI scaling

### Database and ORM
- **Drizzle ORM**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL connection driver
- **Drizzle Kit**: Database migration and management tools

### State Management and Utilities
- **Zustand**: Lightweight state management
- **React Query**: Server state management (configured but not actively used)
- **date-fns**: Date manipulation utilities

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` directory using Vite
2. Backend builds to `dist` directory using esbuild
3. Single production command serves both frontend and backend

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run build`: Creates production build
- `npm run start`: Runs production server
- `npm run db:push`: Pushes database schema changes

### Environment Configuration
- Database URL required via `DATABASE_URL` environment variable
- Vite configuration includes GLSL shader support and asset handling
- Production setup serves static files from Express

### File Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

The application is designed to be easily deployable on platforms like Replit, with automatic database provisioning and environment variable management.