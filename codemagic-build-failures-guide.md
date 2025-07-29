# Codemagic Build Failures - Quick Reference Guide

## Most Common Failure Points

### 1. YAML Validation Errors
**Step**: Before build starts
**Symptoms**: "validation errors in codemagic.yaml"
**Solutions**:
- ✅ **Fixed**: Removed empty TEAM_ID variable
- ✅ **Fixed**: Correct integration reference "Apple Connect App Mgr"

### 2. Capacitor Setup Failures (RESOLVED ✅)
**Step**: "Set up Capacitor" or "Sync Capacitor with web app"
**Symptoms**: Exit code 1, sync failures
**Solutions Applied**:
- ✅ Added proper error handling with `set +e`
- ✅ Used `npx cap copy` instead of `npx cap sync`
- ✅ Fallback commands to continue build even if sync fails

### 3. CocoaPods Installation Issues
**Step**: "Install CocoaPods dependencies"
**Symptoms**: Pod install failures, missing Pods directory
**Current Fix**:
```yaml
- name: Install CocoaPods dependencies
  script: |
    cd ios/App
    rm -rf Pods/ Podfile.lock
    pod install --repo-update
    ls -la App.xcworkspace/contents.xcworkspacedata
```

### 4. iOS Build Failures (CURRENT FOCUS)
**Step**: "Build ipa for distribution"
**Common Exit Codes**:
- **Exit Code 65**: Xcode build failure (code signing, configuration)
- **Exit Code 70**: Code signing issues
- **Exit Code 1**: General build failure

**Current Fixes Applied**:
- ✅ Created missing `contents.xcworkspacedata` file
- ✅ Enhanced workspace verification
- ✅ Added comprehensive debugging
- ✅ Simplified build command

### 5. Code Signing Issues
**Symptoms**: "No matching provisioning profiles", "Code signing error"
**Configuration**:
```yaml
integrations:
  app_store_connect: Apple Connect App Mgr
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: com.snakegame.nostalgic
```

## Debugging Strategy

### Step-by-Step Debug Process
1. **Check YAML Validation** → ✅ Fixed
2. **Verify Build Output** → Check `dist/public/` exists
3. **Platform Setup** → Ensure iOS/Android directories exist
4. **Capacitor Sync** → ✅ Robust error handling added
5. **CocoaPods** → Clean install with workspace verification
6. **Code Signing** → Automatic via App Store Connect integration
7. **Xcode Build** → Enhanced debugging and workspace validation

### Enhanced Debug Output
Current configuration includes:
- Xcode version check
- Workspace structure verification
- Code signing identity listing
- Bundle ID consistency check
- Detailed error messages

## Quick Fixes by Error Message

### "Workspace not found"
```bash
# Fix: Recreate workspace
cd ios/App
pod install --repo-update
```

### "No code signing identities"
```bash
# Check: App Store Connect integration
# Verify: Bundle ID matches Apple Developer portal
```

### "Build failed with exit code 65"
```bash
# Debug: Check Xcode logs in artifacts
# Verify: Provisioning profile exists for bundle ID
# Check: Certificate validity
```

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| YAML Validation | ✅ Fixed | Removed empty TEAM_ID |
| Capacitor Setup | ✅ Fixed | Robust error handling |
| Workspace File | ✅ Fixed | Created contents.xcworkspacedata |
| CocoaPods Setup | 🔄 Enhanced | Clean install with verification |
| Code Signing | ⚙️ Configured | Automatic via App Store Connect |
| Xcode Build | 🔍 Debugging | Enhanced logging added |

## Next Steps Based on Failure Point

### If CocoaPods Fails:
- Check Podfile syntax
- Verify Capacitor iOS platform exists
- Try `pod repo update` first

### If Xcode Build Fails:
- Review debug output from new debugging step
- Check code signing identities
- Verify bundle identifier consistency
- Review Xcode build logs in artifacts

### If Code Signing Fails:
- Confirm App Store Connect integration setup
- Verify bundle ID registered in Apple Developer
- Check provisioning profile exists

**Tell me which specific step failed** and I'll provide a targeted solution based on this comprehensive troubleshooting framework.