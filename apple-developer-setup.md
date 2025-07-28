# Apple Developer Setup for Snake Game

## The Problem
Codemagic error: "No matching profiles for bundle identifier 'com.snakegame.nostalgic'"

This means you need to register your app with Apple and create the necessary certificates.

## Step-by-Step Solution

### 1. Apple Developer Account
- Go to https://developer.apple.com
- Sign up for Apple Developer Program ($99/year)
- Complete enrollment (can take 24-48 hours for approval)

### 2. Register Your App Bundle ID
1. Log into Apple Developer portal
2. Go to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → "+" (Add new)
4. Select "App IDs" → Continue
5. App ID Configuration:
   - **Description**: Snake Game Nostalgic
   - **Bundle ID**: `com.snakegame.nostalgic` (exactly this)
   - **Capabilities**: Check any you need (none required for basic game)
6. Click "Continue" → "Register"

### 3. Create App Store Connect Record
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. App Information:
   - **Platform**: iOS
   - **Name**: Snake Game Nostalgic
   - **Primary Language**: English
   - **Bundle ID**: Select `com.snakegame.nostalgic`
   - **SKU**: snake-game-nostalgic (unique identifier)
4. Click "Create"

### 4. Generate App Store Connect API Key
1. In App Store Connect, go to "Users and Access"
2. Click "Keys" tab → "+" (Generate API Key)
3. Key Details:
   - **Name**: Codemagic Snake Game
   - **Access**: Developer (sufficient for builds)
4. Download the `.p8` file (keep it safe!)
5. Note the Key ID and Issuer ID

### 5. Configure Codemagic with Apple Credentials
1. In Codemagic dashboard, go to "Teams" → "Integrations"
2. Add "App Store Connect API key"
3. Upload your `.p8` file
4. Enter Key ID and Issuer ID from step 4

### 6. Update Codemagic Build Configuration
The provisioning profiles will be automatically generated when you:
- Have registered the Bundle ID in Apple Developer
- Connected App Store Connect API key to Codemagic
- Trigger a new build

## Alternative: Manual Certificate Management

If automatic doesn't work, create certificates manually:

### Create Distribution Certificate
1. **First, create CSR on your machine** (see `create-csr-guide.md`)
2. Apple Developer → "Certificates, Identifiers & Profiles"
3. Certificates → "+" → "iOS Distribution"
4. Upload your Certificate Signing Request (CSR) file
5. Download the generated certificate
6. Double-click certificate to install in Keychain Access

### Create Provisioning Profile
1. Profiles → "+" → "App Store"
2. Select your App ID (`com.snakegame.nostalgic`)
3. Select your distribution certificate
4. Name: "ios provisioning profile" (matches Codemagic configuration)
5. Download profile

### Upload to Codemagic
1. Codemagic → Your app → "Build configuration"
2. Code signing → "Manual"
3. Upload certificate (.p12) and provisioning profile (.mobileprovision)

## Expected Timeline
- Apple Developer approval: 24-48 hours
- Bundle ID registration: Immediate
- First successful build: 15 minutes after setup

## Verification Steps
After setup, your Codemagic build should:
1. ✅ Find matching provisioning profile
2. ✅ Successfully sign the app
3. ✅ Upload to TestFlight
4. ✅ Be available for testing

The error will be resolved once Apple recognizes your Bundle ID and you have proper certificates configured.