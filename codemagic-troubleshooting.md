# Codemagic Bundle ID Error - Quick Fix

## The Error You're Seeing
```
No matching profiles for bundle identifier "com.snakegame.nostalgic" and distribution type "app_store"
```

## What This Means
Apple doesn't recognize your app yet. You need to register it first.

## Quick 3-Step Fix:

### Step 1: Register App with Apple (5 minutes)
1. Go to https://developer.apple.com/account
2. Sign in with Apple Developer account ($99/year required)
3. Go to "Certificates, Identifiers & Profiles"
4. Click "Identifiers" → "+" → "App IDs"
5. Enter:
   - Description: "Snake Game Nostalgic"
   - Bundle ID: `com.snakegame.nostalgic` (exact match)
6. Click "Register"

### Step 2: Create App in App Store Connect (5 minutes)
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Enter:
   - Name: "Snake Game Nostalgic"
   - Bundle ID: Select `com.snakegame.nostalgic`
   - SKU: `snake-game-nostalgic`
4. Click "Create"

### Step 3: Connect Apple Account to Codemagic (5 minutes)
1. In App Store Connect → "Users and Access" → "Keys"
2. Generate new API key → Download .p8 file
3. In Codemagic → "Teams" → "Integrations"
4. Add "App Store Connect API key" → Upload .p8 file

## Then Retry Build
Once these 3 steps are complete:
1. Trigger new build in Codemagic
2. Codemagic will automatically create certificates
3. Build will succeed and upload to TestFlight

## Alternative: Use Development Build First
If you want to test quickly without App Store setup:

Change in `codemagic.yaml`:
```yaml
distribution_type: development  # Instead of app_store
```

This creates a development build you can test on your device without App Store registration.

## Timeline
- Apple Developer account approval: 24-48 hours
- Bundle ID registration: Immediate
- First successful build: 15 minutes after setup

The error happens because Apple needs to know your app exists before Codemagic can create certificates for it.