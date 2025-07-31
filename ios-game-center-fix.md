# Game Center Capability Fix for Codemagic

## Issue
Codemagic build failing with:
```
error: Provisioning profile "CodeMagic" doesn't support the Game Center capability.
error: Provisioning profile "CodeMagic" doesn't include the com.apple.developer.game-center entitlement.
```

## Root Cause
The automatically generated provisioning profile in Codemagic doesn't include Game Center capability by default.

## Temporary Solution
1. **Removed Game Center entitlement** from `ios/App/App/App.entitlements` to allow build to proceed
2. App will build and deploy without Game Center functionality initially

## Next Steps for Full Game Center Support
1. **Update App Store Connect**: Ensure Game Center is enabled in app configuration
2. **Regenerate Provisioning Profile**: Create new profile with Game Center capability
3. **Update Codemagic Integration**: Configure with Game Center-enabled profile
4. **Re-enable Entitlement**: Restore Game Center entitlement after profile update

## Manual Steps Required
1. Go to Apple Developer Portal
2. Find the provisioning profile used by Codemagic (likely "CodeMagic")
3. Edit profile to include Game Center capability
4. Download and upload to Codemagic if needed
5. Re-enable Game Center entitlement in App.entitlements

## Alternative: Codemagic Automatic Provisioning
- Configure Codemagic to automatically generate profiles with required capabilities
- Update App Store Connect integration to include Game Center permissions
- Use Codemagic's managed code signing with capability detection

## Current Status
- ✅ Build will proceed without Game Center
- ❌ Game Center features disabled temporarily
- 🔄 Requires manual provisioning profile update for full functionality