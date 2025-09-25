import { Capacitor, registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface StoreKitPlugin {
  getProducts(options: { productIds: string[] }): Promise<{ products: Product[] }>;
  purchaseProduct(options: { productId: string }): Promise<PurchaseResult>;
  restorePurchases(): Promise<{ restoredPurchases: PurchaseResult[] }>;
  canMakePayments(): Promise<{ canMakePayments: boolean }>;
  addListener(eventName: string, listenerFunc: (result: PurchaseResult) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
  removeAllListeners(): Promise<void>;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  priceLocale: string;
}

export interface PurchaseResult {
  productId: string;
  transactionId?: string;
  status: 'purchased' | 'failed' | 'restored';
  error?: string;
}

// Use registerPlugin for proper Capacitor plugin registration
const StoreKitPluginInstance = registerPlugin<StoreKitPlugin>('StoreKitPlugin');

export class StoreKit {
  static async getProducts(productIds: string[]): Promise<Product[]> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await StoreKitPluginInstance.getProducts({ productIds });
        return result.products || [];
      } catch (error) {
        console.log('Failed to get products:', error);
        return [];
      }
    }
    // Web platform - return mock products for testing
    return [
      {
        productId: 'ExtraLives',
        title: 'Extra Lives Pack',
        description: '3 Extra Lives to continue playing',
        price: '$0.99',
        priceLocale: 'en_US'
      }
    ];
  }

  static async purchaseProduct(productId: string): Promise<PurchaseResult> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await StoreKitPluginInstance.purchaseProduct({ productId });
        return result;
      } catch (error) {
        console.log('Purchase failed:', error);
        return {
          productId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Purchase failed'
        };
      }
    }
    // Web platform - simulate purchase for testing
    console.log('Web platform: Simulating purchase for', productId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          productId,
          transactionId: Date.now().toString(),
          status: 'purchased'
        });
      }, 1000);
    });
  }

  static async canMakePayments(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await StoreKitPluginInstance.canMakePayments();
        return result.canMakePayments;
      } catch (error) {
        console.log('Failed to check payment capability:', error);
        return false;
      }
    }
    // Web platform - always return true for testing
    return true;
  }

  static async restorePurchases(): Promise<PurchaseResult[]> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await StoreKitPluginInstance.restorePurchases();
        return result.restoredPurchases || [];
      } catch (error) {
        console.log('Failed to restore purchases:', error);
        return [];
      }
    }
    // Web platform - return empty array
    return [];
  }

  // Listen to purchase events
  static addPurchaseListener(callback: (result: PurchaseResult) => void) {
    if (Capacitor.isNativePlatform()) {
      StoreKitPluginInstance.addListener('purchaseComplete', callback);
      StoreKitPluginInstance.addListener('purchaseFailed', callback);
      StoreKitPluginInstance.addListener('purchaseRestored', callback);
    }
  }

  static removePurchaseListeners() {
    if (Capacitor.isNativePlatform()) {
      StoreKitPluginInstance.removeAllListeners();
    }
  }
}