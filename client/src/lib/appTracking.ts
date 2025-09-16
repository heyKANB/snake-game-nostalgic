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
    const status = await this.getStatus();
    console.log('🔍 ATT: Current status is:', status);
    
    if (status === 'notDetermined') {
      console.log('🔍 ATT: Permission not determined, requesting permission...');
      const newStatus = await this.requestPermission();
      console.log('🔍 ATT: Permission request result:', newStatus);
      
      // Store that we've asked and what the result was (for web platform)
      if (!Capacitor.isNativePlatform()) {
        try {
          localStorage.setItem('att_permission_asked', 'true');
          localStorage.setItem('att_permission_granted', (newStatus === 'authorized').toString());
        } catch (error) {
          console.log('ATT: localStorage write failed:', error);
        }
      }
      
      return newStatus === 'authorized';
    }
    
    console.log('🔍 ATT: Permission already determined:', status);
    return status === 'authorized';
  }
}