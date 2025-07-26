# Codemagic iOS Build & Submission Guide

## Overview
Codemagic is a cloud-based CI/CD service that can build iOS apps without requiring a Mac or Xcode locally.

## Step-by-Step Setup Process

### 1. Prerequisites
- Apple Developer Account ($99/year)
- Your Snake game code repository (GitHub, GitLab, or Bitbucket)
- Code signing certificates from Apple

### 2. Set Up Codemagic Account
1. Go to https://codemagic.io/
2. Sign up with your GitHub/GitLab/Bitbucket account
3. Free tier includes 500 build minutes/month (sufficient for initial testing)

### 3. Connect Your Repository
1. In Codemagic dashboard, click "Add application"
2. Select your repository platform (GitHub recommended)
3. Choose your Snake game repository
4. Codemagic will scan and detect it's a Capacitor project

### 4. Configure iOS Build Settings
```yaml
# This goes in codemagic.yaml in your project root
workflows:
  ios-workflow:
    name: iOS Snake Game Build
    max_build_duration: 60
    environment:
      groups:
        - app_store_credentials
      vars:
        BUNDLE_ID: "com.snakegame.nostalgic"
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      xcode: latest
      cocoapods: default
    scripts:
      - name: Install dependencies
        script: |
          npm install
          npx cap sync ios
      - name: Set up code signing
        script: |
          keychain initialize
          app-store-connect fetch-signing-files $BUNDLE_ID --type IOS_APP_STORE --create
          keychain add-certificates
          xcode-project use-profiles
      - name: Build iOS app
        script: |
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        submit_to_app_store: false
```

### 5. Apple Developer Setup in Codemagic
1. In Codemagic, go to "Teams" → "Integrations"
2. Add "App Store Connect API key"
3. Upload your App Store Connect API key (download from Apple Developer portal)
4. This allows Codemagic to upload builds automatically

### 6. Code Signing Setup
Codemagic can automatically manage your certificates:
1. Enable "Automatic code signing" in build settings
2. Or manually upload certificates if you prefer control

### 7. Trigger Build
1. Push your code to repository
2. Codemagic automatically detects the push
3. Build starts in cloud (takes 10-15 minutes)
4. Download IPA file or auto-submit to TestFlight

## Alternative: Manual Codemagic Setup

### If you prefer UI configuration:
1. In Codemagic dashboard, select your app
2. Go to "Build" section
3. Choose "iOS" as target platform
4. Select build configuration:
   - Build format: IPA
   - Xcode version: Latest stable
   - CocoaPods version: Latest
5. Add environment variables:
   - `BUNDLE_ID`: com.snakegame.nostalgic
6. Enable "Distribute to App Store Connect"

## Cost Breakdown
- **Free tier**: 500 minutes/month (3-5 iOS builds)
- **Paid plans**: Start at $20/month for more builds
- **Per-build cost**: ~$0.095/minute (iOS builds take 10-15 minutes)

## Expected Timeline
1. Setup: 30-60 minutes
2. First build: 15-20 minutes
3. Apple review: 1-7 days
4. Live on App Store: Within 24 hours of approval

## Benefits of Codemagic
- No Mac required
- Automatic code signing
- Direct TestFlight/App Store submission
- Supports Capacitor projects out of the box
- Free tier sufficient for initial launches

## Next Steps After Setup
1. Test build completes successfully
2. Submit to TestFlight for internal testing
3. Once satisfied, submit for App Store review
4. Monitor submission status in App Store Connect

Would you like me to help create the codemagic.yaml configuration file for your project?