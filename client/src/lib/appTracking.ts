import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AppTrackingPlugin {
  requestPermission(): Promise<{ status: string }>;
  getStatus(): Promise<{ status: string }>;
}

// Use registerPlugin for proper Capacitor plugin registration
const AppTrackingPluginInstance = registerPlugin<AppTrackingPlugin>('AppTracking');

export class AppTracking {
  static async requestPermission(): Promise<string> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await AppTrackingPluginInstance.requestPermission();
        return result?.status || 'denied';
      } catch (error) {
        console.log('App Tracking permission request failed:', error);
        return 'denied';
      }
    }
    // Web platform - simulate user choice for testing
    return 'authorized';
  }

  static async getStatus(): Promise<string> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await AppTrackingPluginInstance.getStatus();
        return result?.status || 'notDetermined';
      } catch (error) {
        console.log('App Tracking status check failed:', error);
        return 'notDetermined';
      }
    }
    // Web platform - check if we've asked before
    try {
      const hasAskedBefore = localStorage.getItem('att_permission_asked');
      if (!hasAskedBefore) {
        return 'notDetermined';
      }
      const permission = localStorage.getItem('att_permission_granted');
      return permission === 'true' ? 'authorized' : 'denied';
    } catch (error) {
      console.log('ATT: localStorage access failed, defaulting to notDetermined:', error);
      return 'notDetermined';
    }
  }

  static async checkAndRequestPermission(): Promise<boolean> {
    console.log('🔍 ATT: Starting permission check and request flow');
    
    if (Capacitor.isNativePlatform()) {
      // On native iOS, permission should already be requested by plugin.load()
      // Just get the current status
      const status = await this.getStatus();
      console.log('🔍 ATT: Current native status:', status);
      
      // If still notDetermined on native, something went wrong - request again
      if (status === 'notDetermined') {
        console.log('🔍 ATT: Native permission still not determined, requesting now...');
        const newStatus = await this.requestPermission();
        console.log('🔍 ATT: Native permission request result:', newStatus);
        return newStatus === 'authorized';
      }
      
      return status === 'authorized';
    } else {
      // Web platform logic
      const status = await this.getStatus();
      console.log('🔍 ATT: Current web status:', status);
      
      if (status === 'notDetermined') {
        console.log('🔍 ATT: Web permission not determined, requesting permission...');
        const newStatus = await this.requestPermission();
        console.log('🔍 ATT: Web permission request result:', newStatus);
        
        // Store result for web platform
        try {
          localStorage.setItem('att_permission_asked', 'true');
          localStorage.setItem('att_permission_granted', (newStatus === 'authorized').toString());
        } catch (error) {
          console.log('ATT: localStorage write failed:', error);
        }
        
        return newStatus === 'authorized';
      }
      
      console.log('🔍 ATT: Web permission already determined:', status);
      return status === 'authorized';
    }
  }
}