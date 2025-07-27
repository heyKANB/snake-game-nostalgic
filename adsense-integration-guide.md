# Google AdSense Integration Guide for Snake Game

## Your AdSense Integration is Ready! ✅

I've prepared your Snake game with complete AdSense integration:

### What's Already Set Up:
- **Banner ads** at the bottom of game screen
- **Interstitial ads** that show after game over
- **Ad management store** with enable/disable functionality
- **Mobile-optimized** ad placements
- **Automatic ad loading** and display logic

## How to Add Your Real AdSense App ID

### Step 1: Replace Placeholder with Your App ID

**In `client/index.html`** - Replace both instances of `PLACEHOLDER`:
```html
<!-- Replace this line -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-PLACEHOLDER" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="ca-app-pub-PLACEHOLDER">

<!-- With your actual App ID -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_APP_ID" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="YOUR_ADSENSE_APP_ID">
```

**In `client/src/App.tsx`** - Replace the placeholder:
```javascript
// Replace this line
setAdSenseAppId('ca-app-pub-PLACEHOLDER');

// With your actual App ID
setAdSenseAppId('YOUR_ADSENSE_APP_ID');
```

**In `client/src/components/AdComponents.tsx`** - Replace placeholders in both ad components:
```javascript
// Replace these lines
data-ad-client="ca-app-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="1234567890"

// With your actual values from AdSense dashboard
data-ad-client="YOUR_ADSENSE_APP_ID" 
data-ad-slot="YOUR_BANNER_AD_SLOT_ID"
```

### Step 2: Get Your Ad Slot IDs from Google AdSense

1. Go to https://www.google.com/adsense/
2. Create ad units for your Snake game:
   - **Banner Ad**: 320x50 banner for bottom of screen
   - **Interstitial Ad**: Full-screen ad for game over
3. Copy the ad slot IDs and replace in `AdComponents.tsx`

## Ad Behavior in Your Game:

### Banner Ads:
- Display at bottom of game screen
- Always visible during gameplay
- Mobile-optimized 320x50 size
- Automatically loads when game starts

### Interstitial Ads:
- Show 1 second after game over
- Full-screen overlay with "Continue Game" button
- Auto-dismiss after 3 seconds
- Only displays when ads are enabled

### Ad Controls:
- Players can toggle ads on/off in game menu
- Ads are enabled by default
- Setting persists between game sessions

## Revenue Optimization:

### Ad Placement Strategy:
- **Banner**: Constant visibility = consistent impressions
- **Interstitial**: High engagement moment = better click rates
- **Non-intrusive**: Maintains game experience quality

### Expected Performance:
- Banner ads: High impression volume, lower CPM
- Interstitial ads: Lower volume, higher CPM
- Mobile traffic: Generally higher ad rates

## Testing Your Ads:

### Development Testing:
1. Use AdSense test ads during development
2. Add `data-adtest="on"` to ad units for testing
3. Remove test mode before app store submission

### Live Testing:
1. Deploy with real Ad IDs
2. Test on mobile devices
3. Verify ads load and display correctly
4. Check ad controls work properly

## App Store Compliance:

### iOS App Store:
- AdSense is approved advertising network
- Ensure ads don't interfere with gameplay
- Include ad disclosure in app description

### Google Play Store:
- Native Google ads = automatic compliance
- No additional approval needed
- Follow Play Store ad policies

Your Snake game is now ready to generate revenue through AdSense! The integration is complete and production-ready.