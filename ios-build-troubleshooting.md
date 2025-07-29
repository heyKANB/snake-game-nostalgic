# iOS Build Troubleshooting - Exit Code 65

## Current Issue: "Build ipa for distribution script exited with status code 65"

### What Exit Code 65 Means

Exit code 65 from Xcode typically indicates:
1. **Code Signing Issues**: Missing certificates, provisioning profiles, or team ID mismatches
2. **Build Configuration Problems**: Invalid project settings or missing dependencies
3. **Archive/Export Failures**: Issues creating the .ipa file

### Common Causes and Solutions

#### 1. Code Signing Configuration
**Problem**: Automatic code signing not working properly
**Solution**: Enhanced build command with explicit settings

```yaml
- name: Build ipa for distribution
  script: |
    xcode-project build-ipa \
      --workspace "$XCODE_WORKSPACE" \
      --scheme "$XCODE_SCHEME" \
      --archive-flags="-destination 'generic/platform=iOS' \
                      -allowProvisioningUpdates \
                      CODE_SIGN_IDENTITY='iPhone Distribution' \
                      PROVISIONING_PROFILE_SPECIFIER='ios provisioning profile'"
```

#### 2. Missing Team ID
**Problem**: Xcode can't determine the correct development team
**Solution**: Add TEAM_ID environment variable

```yaml
environment:
  vars:
    TEAM_ID: "XXXXXXXXXX"  # Your 10-character Apple Developer Team ID
```

#### 3. Bundle Identifier Mismatch
**Problem**: Bundle ID doesn't match provisioning profile
**Solution**: Ensure consistency across:
- `capacitor.config.ts`: `appId: 'com.snakegame.nostalgic'`
- Codemagic vars: `BUNDLE_ID: "com.snakegame.nostalgic"`
- Apple Developer portal: App ID registration
- Provisioning profile: Associated with correct App ID

#### 4. Xcode Project Configuration
**Problem**: Project file has incorrect settings
**Solution**: Verify project.pbxproj has correct:
- PRODUCT_BUNDLE_IDENTIFIER
- CODE_SIGN_STYLE = Automatic
- DEVELOPMENT_TEAM

### Debugging Steps for Codemagic

Add this debug script before the build:

```yaml
- name: Debug iOS Build Configuration
  script: |
    echo "=== Xcode Version ==="
    xcodebuild -version
    
    echo "=== Available Schemes ==="
    xcodebuild -list -workspace "$XCODE_WORKSPACE"
    
    echo "=== Provisioning Profiles ==="
    security find-identity -v -p codesigning
    
    echo "=== Project Configuration ==="
    xcodebuild -workspace "$XCODE_WORKSPACE" -scheme "$XCODE_SCHEME" -showBuildSettings | grep -E "(BUNDLE_ID|CODE_SIGN|TEAM|PROVISIONING)"
    
    echo "=== Capacitor Config ==="
    cat capacitor.config.ts
```

### Alternative Build Approach

If standard build fails, try gradual approach:

```yaml
- name: Clean and Build iOS
  script: |
    cd ios/App
    
    # Clean build folder
    xcodebuild clean -workspace App.xcworkspace -scheme App
    
    # Build archive
    xcodebuild archive \
      -workspace App.xcworkspace \
      -scheme App \
      -destination "generic/platform=iOS" \
      -archivePath build/App.xcarchive \
      -allowProvisioningUpdates
    
    # Export IPA
    xcodebuild -exportArchive \
      -archivePath build/App.xcarchive \
      -exportPath build/ipa \
      -exportOptionsPlist exportOptions.plist
```

### Required Files Check

Ensure these files exist:
- ✅ `ios/App/App.xcworkspace`
- ✅ `ios/App/App.xcodeproj/project.pbxproj`
- ✅ `ios/App/App/Info.plist`
- ❓ `ios/App/exportOptions.plist` (auto-generated)

### Manual Verification Steps

Test locally to debug:

```bash
# 1. Check workspace opens
cd ios/App
open App.xcworkspace

# 2. Verify scheme builds
xcodebuild -workspace App.xcworkspace -scheme App -destination "generic/platform=iOS" build

# 3. Test archive creation
xcodebuild -workspace App.xcworkspace -scheme App -destination "generic/platform=iOS" archive
```

### Common Configuration Issues

#### Bundle ID Mismatch
```typescript
// capacitor.config.ts - ensure this matches
appId: 'com.snakegame.nostalgic'
```

#### Info.plist Issues
```xml
<!-- Ensure these are properly set -->
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>

<key>CFBundleDisplayName</key>
<string>Snake Game - Nostalgic</string>
```

#### Project Settings
```
PRODUCT_BUNDLE_IDENTIFIER = com.snakegame.nostalgic
CODE_SIGN_STYLE = Automatic
DEVELOPMENT_TEAM = [Your Team ID]
```

### Expected Resolution

When fixed, the build should:
1. ✅ Successfully create an archive
2. ✅ Export .ipa file to artifacts
3. ✅ Complete with exit code 0
4. ✅ Proceed to App Store Connect upload

### Next Steps

1. **Update Configuration**: Apply the enhanced build settings
2. **Run Debug Build**: Add debugging script to identify specific issues
3. **Check Logs**: Review full Xcode build output in Codemagic
4. **Iterate**: Adjust settings based on specific error messages

This comprehensive approach should resolve the exit code 65 issue and get your iOS build working.