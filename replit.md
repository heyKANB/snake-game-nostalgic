# Replit.md

## Overview

This is a nostalgic Snake game application built with React/TypeScript on the frontend and Express.js on the backend. The application features a classic Snake game implementation with retro green-on-black graphics, modern UI components, audio support, and state management using Zustand. The game is fully optimized for mobile devices with touch controls and Progressive Web App (PWA) capabilities, making it ready for App Store deployment. The project is configured as a full-stack application with a PostgreSQL database using Drizzle ORM, though the current implementation uses in-memory storage.

**Latest Update (2025-01-29)**: Complete Google AdSense integration added with banner and interstitial ads for monetization. App ID: ca-app-pub-8626828126160251~4239118513
**Developer**: Hunter Games by HeyKANB (kathrynbrown@heykanb.com)
- Banner Ad Unit: ca-app-pub-8626828126160251/5048803159 (320x50 bottom placement)
- Interstitial Ad Unit: ca-app-pub-8626828126160251/6485506895 (full-screen game over)

**Theme System Update (2025-01-26)**: Added complete theme/skin selection system with Retro Classic and Modern UI options
- Dynamic color schemes with real-time switching
- Visual effects (glow, gradients, rounded corners, scanlines)
- Persistent user preference storage
- Mobile-optimized theme selector interface

**Code Signing Update (2025-01-29)**: Resolved iOS build failures in Codemagic deployment pipeline
- Fixed missing shared Xcode scheme preventing archive creation
- **Critical Fix**: Resolved missing Capacitor files (config.xml, public directory, capacitor.config.json)
- Implemented manual file copy fallback when Capacitor sync fails
- Enhanced build process with comprehensive error handling and fallbacks
- **Apple ID**: 6749170406 (registered for App Store Connect)
- **Team ID**: TYRA6QN5W5 (Apple Developer Team)
- **App Store Connect Integration**: "Apple Connect App Mgr" with Key ID 7629KQWD3Z
- **Privacy Policy**: Integrated at `/privacy` route - resolves Jekyll deployment issues
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