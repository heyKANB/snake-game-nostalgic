# App Store Metadata

## App Information
- **App Name**: Snake Game - Nostalgic
- **Developer**: Hunter Games by HeyKANB
- **Contact Email**: kathrynbrown@heykanb.com
- **Bundle ID**: com.snakegame.nostalgic
- **Apple ID**: 6749170406
- **Version**: 1.0.0
- **Build**: 1

## App Store Connect Configuration

### Required for Submission
- [ ] App Store Connect account access
- [x] Screenshots (5.5" and 6.5" iPhone) - Generated via screenshot tool
- [ ] App icon (1024x1024px)
- [ ] App description
- [ ] Keywords
- [x] Privacy policy URL - Available at `/privacy` route (deployed with app)
- [ ] Support URL

### Current Status
- ✅ Bundle ID registered
- ✅ Apple ID assigned
- ✅ Codemagic build pipeline configured
- ⏳ Waiting for successful archive creation

### Next Steps
1. Resolve iOS archive creation issues
2. ✅ Generate required App Store screenshots (use generate-screenshots.html)
3. ✅ Privacy policy created (privacy-policy.html)
4. Prepare app metadata and descriptions
5. Submit for App Store review

### Generated Assets
- **Privacy Policy**: Integrated into server at `/privacy` route
- **Screenshot Generator**: `generate-screenshots.html` (interactive tool)
- **Privacy Policy URL**: Will be `https://your-deployed-app.replit.app/privacy`
- **Deployment Guide**: `deploy-privacy-guide.md` explains Jekyll issue resolution

## Build Configuration
- **Development Team**: Set via Codemagic provisioning
- **Code Signing**: Automatic (managed by Codemagic)
- **Distribution**: App Store
- **Architecture**: arm64 (iOS devices)

## Monetization
- **AdSense Integration**: Active
- **Banner Ads**: ca-app-pub-8626828126160251/5048803159
- **Interstitial Ads**: ca-app-pub-8626828126160251/6485506895