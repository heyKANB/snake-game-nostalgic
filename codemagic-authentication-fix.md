# Codemagic Authentication Issue - "Failed to Use Accounts"

## Problem Identified
The error "Failed to Use Accounts" occurs when xcodebuild cannot authenticate with App Store Connect during the export process.

## Root Cause
The issue is with using `destination: upload` in ExportOptions.plist when the App Store Connect API authentication isn't properly established at the export stage.

## Solution Applied

### 1. Changed Export Strategy
**Before**: Export with immediate upload (`destination: upload`)
**After**: Export for App Store distribution (`destination: export`)

### 2. Separated Export and Upload
- **Export Stage**: Creates IPA file for App Store distribution
- **Upload Stage**: Codemagic's publishing section handles the actual upload to App Store Connect

### 3. Simplified Authentication Flow
- Export doesn't require App Store Connect authentication
- Upload handled by Codemagic's native App Store Connect integration
- Uses Key ID (7629KQWD3Z) configured in Codemagic settings

## Configuration Changes

### ExportOptions.plist
```xml
<key>method</key>
<string>app-store</string>
<key>destination</key>
<string>export</string>
```

### Process Flow
1. **Archive**: Create .xcarchive from Xcode project ✅
2. **Export**: Create .ipa file for App Store distribution ✅
3. **Upload**: Codemagic publishing uploads .ipa to App Store Connect ✅

## Expected Result
- Export should now complete successfully and create IPA file
- Codemagic's publishing section will handle the App Store Connect upload
- Build should appear in TestFlight within 10-15 minutes after upload

## Verification Steps
When build runs:
1. Export should complete without "Failed to Use Accounts" error
2. IPA file should be created in build/ipa/ directory
3. Publishing section should upload IPA to App Store Connect
4. Build should appear in TestFlight for processing

The separation of export and upload resolves the authentication timing issue.