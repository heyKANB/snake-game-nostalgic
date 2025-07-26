# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website
1. Go to https://github.com
2. Click "New repository" (green button)
3. Repository settings:
   - **Name**: `snake-game-nostalgic`
   - **Description**: `Classic Snake game with retro graphics and mobile controls`
   - **Visibility**: Public (recommended for free Codemagic builds)
   - **Initialize**: ✅ Add README, ✅ Add .gitignore (Node), ✅ Add license (MIT)
4. Click "Create repository"

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create snake-game-nostalgic --public --description "Classic Snake game with retro graphics and mobile controls" --gitignore Node --license MIT
```

## Step 2: Prepare Your Local Files

Your project files are ready to upload. Here's what will be included:

### Essential Files Already Created:
- ✅ `README.md` - Project documentation
- ✅ `codemagic.yaml` - CI/CD configuration for iOS/Android builds
- ✅ `capacitor.config.ts` - Mobile app configuration
- ✅ All game source code in `/client` and `/server`
- ✅ iOS and Android native projects
- ✅ PWA files (manifest.json, service worker)

## Step 3: Upload to GitHub

### Option A: Using Git Commands
```bash
# Initialize git (if not already done)
git init

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/snake-game-nostalgic.git

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Complete Snake game with mobile support"

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Desktop
1. Download GitHub Desktop
2. Clone your new repository
3. Copy all project files to the cloned folder
4. Commit and push changes

### Option C: Upload via GitHub Website
1. On your repository page, click "uploading an existing file"
2. Drag and drop all project files
3. Commit changes

## Step 4: Verify Upload

Check that these key files are visible in your GitHub repository:
- [ ] `README.md`
- [ ] `codemagic.yaml`
- [ ] `capacitor.config.ts`
- [ ] `client/` folder with React app
- [ ] `server/` folder with Express server
- [ ] `ios/` folder with Xcode project
- [ ] `android/` folder with Android project
- [ ] `package.json`

## Step 5: Ready for Codemagic

Once uploaded to GitHub:
1. Your repository URL will be: `https://github.com/YOUR_USERNAME/snake-game-nostalgic`
2. This URL is what you'll connect to Codemagic
3. Codemagic will automatically detect the Capacitor project
4. The `codemagic.yaml` file will configure the build process

## Common Issues & Solutions

**Large Files**: If upload fails due to large files:
- iOS/Android folders might be too large
- Solution: Add build folders to .gitignore and regenerate them

**Permission Issues**: If push fails:
- Check you're logged into correct GitHub account
- Verify repository permissions
- Use personal access token if needed

## Next Steps After GitHub Setup

1. Connect repository to Codemagic
2. Configure Apple Developer credentials
3. Trigger first build
4. Submit to App Store

Your Snake game will be ready for worldwide distribution!