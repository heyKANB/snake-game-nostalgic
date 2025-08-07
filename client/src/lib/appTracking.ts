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
    // Web platform - no tracking permission needed
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
    // Web platform - no tracking permission needed
    return 'authorized';
  }

  static async checkAndRequestPermission(): Promise<boolean> {
    const status = await this.getStatus();
    
    if (status === 'notDetermined') {
      const newStatus = await this.requestPermission();
      return newStatus === 'authorized';
    }
    
    return status === 'authorized';
  }
}