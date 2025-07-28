# Codemagic YAML Configuration Reference for iOS Signing

## Valid iOS Signing Parameters

Based on Codemagic documentation, these are the **only** valid fields for `ios_signing`:

### Automatic Signing (Recommended)
```yaml
ios_signing:
  distribution_type: app_store  # or ad_hoc, enterprise, development
  bundle_identifier: com.snakegame.nostalgic
```

### Manual Signing (Alternative)
```yaml
ios_signing:
  distribution_type: app_store
  bundle_identifier: com.snakegame.nostalgic
  certificate: $IOS_CERTIFICATE          # Environment variable reference
  certificate_password: $CERT_PASSWORD   # Environment variable reference
  provisioning_profile: $PROVISIONING_PROFILE  # Environment variable reference
```

## Invalid Fields That Cause Validation Errors

❌ **These fields do NOT exist in Codemagic:**
- `automatic_code_signing: true`
- `provisioning_profile: "profile name"`  # Direct string values not allowed
- `code_signing_style: automatic`
- `team_id: XXXXXXXXXX`

## How Automatic Signing Works

When you have:
1. ✅ App Store Connect integration configured
2. ✅ `distribution_type: app_store`
3. ✅ Valid `bundle_identifier`

Codemagic automatically:
- Generates iOS Distribution certificates
- Creates App Store provisioning profiles
- Manages certificate renewal
- Handles code signing during build

## Environment Variables for Manual Signing

If you need manual signing, upload certificates/profiles to Codemagic and reference them:

```yaml
environment:
  groups:
    - ios_certificates  # Group containing your uploaded certificates
  vars:
    BUNDLE_ID: "com.snakegame.nostalgic"
```

## Working Configuration for Snake Game

```yaml
workflows:
  ios-snake-game:
    name: iOS Snake Game Build & Deploy
    max_build_duration: 60
    instance_type: mac_mini_m1
    integrations:
      app_store_connect: codemagic  # This enables automatic signing
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.snakegame.nostalgic
      vars:
        BUNDLE_ID: "com.snakegame.nostalgic"
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      groups:
        - app_store_credentials
      node: v18.17.0
      xcode: latest
      cocoapods: default
```

## Key Points

1. **Integration is Key**: The `app_store_connect: codemagic` integration enables automatic signing
2. **Minimal Configuration**: Only `distribution_type` and `bundle_identifier` are needed
3. **No Profile Names**: You cannot specify provisioning profile names directly
4. **Environment Variables**: Manual signing requires referencing uploaded certificates via environment variables

## Common Validation Errors

- `extra fields not permitted` = You're using invalid field names
- `required field missing` = Missing `distribution_type` or `bundle_identifier`
- `invalid distribution_type` = Use: `app_store`, `ad_hoc`, `enterprise`, or `development`

Your current configuration should now pass validation.