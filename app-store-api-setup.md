# App Store API Setup Guide

## Issue: Leaderboard Not Working in App Store Build

When your Snake game is deployed to the App Store, the mobile app cannot connect to `localhost` or relative URLs because there's no local server running. The app needs to connect to your deployed backend server.

## Solution

### Step 1: Deploy Your Backend Server

Your backend server needs to be deployed and accessible from the internet. Options:

1. **Replit Deployment** (Recommended):
   - Go to your Replit project
   - Click the "Deploy" button
   - Your server will be available at: `https://your-project-name.your-username.replit.app`

2. **Other hosting options**: Heroku, Vercel, Railway, etc.

### Step 2: Update API Configuration

Once your backend is deployed, update the API configuration:

1. Open `client/src/lib/config.ts`
2. Replace `'https://your-production-server.replit.app'` with your actual deployed server URL

Example:
```typescript
// Replace this line:
return 'https://your-production-server.replit.app';

// With your actual Replit deployment URL:
return 'https://snake-game-nostalgic.your-username.replit.app';
```

### Step 3: Rebuild and Deploy

1. Update the version number (already done: v1.3.0 build 4)
2. Run the Codemagic build with the updated configuration
3. The mobile app will now connect to your live backend server

## Testing

To verify the fix is working:

1. Check the browser console logs in Safari/Chrome on your phone
2. Look for these log messages:
   - "Submitting score to: https://your-server.replit.app/api/leaderboard"
   - "Environment info: { isCapacitor: true }"
   - "Score submission successful"

## Security Considerations

- Ensure your backend server has proper CORS configuration
- The database (Neon PostgreSQL) should be accessible from your deployed server
- Consider adding rate limiting to prevent abuse

## Current Status

✅ API configuration system added
✅ Error logging and debugging enhanced  
✅ Capacitor detection for mobile apps
⚠️ **ACTION REQUIRED**: Update production server URL in config.ts
⚠️ **ACTION REQUIRED**: Deploy backend server to Replit or other hosting

Once you update the server URL and redeploy, the leaderboard will work in the App Store version.