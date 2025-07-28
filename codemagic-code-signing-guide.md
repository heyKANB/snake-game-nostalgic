# Codemagic Automatic Code Signing Setup Guide

## Overview
This guide explains how to enable automatic code signing in Codemagic for both iOS and Android builds of the Snake game.

## iOS Automatic Code Signing

### Prerequisites
1. **Apple Developer Account** ($99/year)
2. **App Store Connect API Key** (created and uploaded to Codemagic)
3. **Bundle ID registered** in Apple Developer portal: `com.snakegame.nostalgic`

### Configuration Status
✅ **Automatic Code Signing Enabled** in `codemagic.yaml`:
```yaml
ios_signing:
  distribution_type: app_store
  bundle_identifier: com.snakegame.nostalgic
  # Automatic signing via App Store Connect integration
  # Provisioning profiles are managed automatically by Codemagic
```

### How It Works
1. **Certificate Generation**: Codemagic automatically creates iOS Distribution certificates
2. **Provisioning Profile**: Auto-generates App Store provisioning profiles
3. **Signing**: Uses Xcode's automatic code signing during build
4. **Renewal**: Certificates are automatically renewed before expiration

### Setup Steps
1. **Connect App Store Connect Integration**:
   - Go to Codemagic → Teams → Integrations
   - Add "App Store Connect API key"
   - Upload your `.p8` API key file
   - Enter Key ID and Issuer ID

2. **Register Bundle ID in Apple Developer**:
   - Apple Developer → Certificates, Identifiers & Profiles
   - Identifiers → + → App IDs
   - Bundle ID: `com.snakegame.nostalgic`
   - Description: Snake Game Nostalgic

3. **Create App in App Store Connect**:
   - App Store Connect → My Apps → +
   - Select the registered Bundle ID
   - Fill in app metadata

### Verification
After setup, your build will:
- ✅ Automatically find/create signing certificates
- ✅ Generate provisioning profiles
- ✅ Sign the app successfully
- ✅ Upload to TestFlight

## Android Automatic Code Signing

### Prerequisites
1. **Google Play Console Account** ($25 one-time fee)
2. **Android Keystore** (uploaded to Codemagic)
3. **Google Play API credentials**

### Configuration Status
✅ **Automatic Android Signing Enabled** in `codemagic.yaml`:
```yaml
android_signing:
  - keystore_reference  # References uploaded keystore
```

### How It Works
1. **Keystore Management**: Codemagic securely stores your Android keystore
2. **Automatic Signing**: Build process automatically signs APK/AAB files
3. **Google Play Upload**: Signed files are automatically uploaded to Play Console

### Setup Steps
1. **Create Android Keystore**:
   ```bash
   keytool -genkey -v -keystore snake-game-release.keystore \
     -alias snake-game -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Upload Keystore to Codemagic**:
   - Codemagic → Your App → Code signing
   - Upload keystore file
   - Enter keystore password and key alias
   - Reference name: `keystore_reference`

3. **Configure Google Play Integration**:
   - Codemagic → Teams → Integrations
   - Add Google Play integration
   - Upload service account JSON key

## Security Benefits

### iOS Automatic Signing
- **Certificate Security**: Apple manages certificate lifecycle
- **Profile Updates**: Automatic provisioning profile renewal
- **Device Management**: Handles device registration automatically
- **Revocation Protection**: Invalid certificates are automatically replaced

### Android Automatic Signing
- **Keystore Protection**: Encrypted storage in Codemagic vault
- **Access Control**: Role-based access to signing materials
- **Audit Trail**: Complete signing history and logs
- **Backup Safety**: Automatic keystore backups

## Troubleshooting

### iOS Issues
1. **"No matching profiles"**: Ensure Bundle ID is registered in Apple Developer
2. **"Invalid certificate"**: Check App Store Connect API key permissions
3. **"Code signing failed"**: Verify automatic code signing is enabled in Xcode project

### Android Issues
1. **"Keystore not found"**: Verify keystore reference name matches upload
2. **"Invalid key alias"**: Check alias name and password in Codemagic settings
3. **"Signing failed"**: Ensure keystore format is correct (JKS/PKCS12)

## Build Process Flow

### iOS Build with Automatic Signing
1. Clone repository
2. Install dependencies (npm, CocoaPods)
3. Build React app (`npm run build`)
4. Sync Capacitor (`npx cap sync ios`)
5. **Configure automatic code signing** (`xcode-project use-profiles`)
6. Build iOS app with Xcode
7. **Automatic certificate/profile resolution**
8. Sign IPA file
9. Upload to TestFlight

### Android Build with Automatic Signing
1. Clone repository
2. Install dependencies
3. Build React app
4. Sync Capacitor (`npx cap sync android`)
5. Configure local.properties
6. Build Android release (`./gradlew bundleRelease`)
7. **Automatic APK/AAB signing with keystore**
8. Upload to Google Play Console

## Monitoring & Maintenance

### Automatic Monitoring
- **Certificate Expiration**: Codemagic tracks expiration dates
- **Build Status**: Email notifications for signing failures
- **Security Alerts**: Notifications for suspicious signing activity

### Manual Checks (Monthly)
- Verify certificates are valid in Apple Developer
- Check Google Play Console for signing issues
- Review Codemagic build logs for signing warnings
- Update API keys before expiration

## Environment Variables Reference

### iOS (Auto-managed)
```yaml
# These are automatically handled by Codemagic
# APP_STORE_CONNECT_ISSUER_ID: (from integration)
# APP_STORE_CONNECT_KEY_IDENTIFIER: (from integration)
# APP_STORE_CONNECT_PRIVATE_KEY: (from integration)
```

### Android (Configure in Codemagic)
```yaml
# Automatically resolved from keystore upload
# ANDROID_KEYSTORE: (encrypted in Codemagic vault)
# ANDROID_KEYSTORE_PASSWORD: (encrypted)
# ANDROID_KEY_ALIAS: (encrypted)
# ANDROID_KEY_PASSWORD: (encrypted)
```

## Next Steps

1. **Complete Apple Developer Setup**: Follow `apple-developer-setup.md`
2. **Create Android Keystore**: Generate and upload signing keystore
3. **Test Build**: Trigger a build to verify automatic signing
4. **Monitor Results**: Check build logs for successful signing
5. **Deploy to Stores**: Enable store publishing once signing works

## Support Resources

- **Codemagic Documentation**: https://docs.codemagic.io/yaml-code-signing/
- **Apple Code Signing**: https://developer.apple.com/support/code-signing/
- **Android App Signing**: https://developer.android.com/studio/publish/app-signing
- **Troubleshooting Guide**: `codemagic-troubleshooting.md`

Your Snake game now has professional automatic code signing configured for both iOS and Android platforms!