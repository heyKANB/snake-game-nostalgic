import { create } from 'zustand';
import { StoreKit, type PurchaseResult } from '../storeKit';

export const EXTRA_LIVES_PRODUCT_ID = 'ExtraLives';
export const EXTRA_LIVES_APPLE_ID = '6753017741';
export const LIVES_PER_PURCHASE = 3;

interface ExtraLivesState {
  extraLives: number;
  isPurchasing: boolean;
  canMakePayments: boolean;
  productPrice: string;
  
  // Actions
  setExtraLives: (lives: number) => void;
  useExtraLife: () => boolean;
  purchaseExtraLives: () => Promise<boolean>;
  initializeStore: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

export const useExtraLives = create<ExtraLivesState>((set, get) => ({
  extraLives: parseInt(localStorage.getItem('snakeExtraLives') || '0'),
  isPurchasing: false,
  canMakePayments: false,
  productPrice: '$0.99',

  setExtraLives: (lives: number) => {
    // Only allow setting to 0 for resets, otherwise prevent external manipulation
    if (lives === 0) {
      localStorage.setItem('snakeExtraLives', '0');
      set({ extraLives: 0 });
    } else {
      console.warn('⚠️ External setExtraLives call blocked - use purchase system');
    }
  },

  useExtraLife: () => {
    const { extraLives } = get();
    
    // Validate current state against localStorage to detect tampering
    const storedLives = parseInt(localStorage.getItem('snakeExtraLives') || '0');
    if (storedLives !== extraLives) {
      console.warn('⚠️ Extra lives tampering detected - resetting to stored value');
      set({ extraLives: storedLives });
      return storedLives > 0;
    }
    
    if (extraLives > 0) {
      const newLives = extraLives - 1;
      localStorage.setItem('snakeExtraLives', newLives.toString());
      set({ extraLives: newLives });
      console.log(`✅ Used extra life. Remaining: ${newLives}`);
      return true;
    }
    
    console.log('❌ No extra lives available');
    return false;
  },

  purchaseExtraLives: async () => {
    const { isPurchasing } = get();
    if (isPurchasing) return false;

    set({ isPurchasing: true });
    
    try {
      console.log('Attempting to purchase extra lives...');
      const result = await StoreKit.purchaseProduct(EXTRA_LIVES_PRODUCT_ID);
      
      // IMPORTANT: Don't add lives here - let the listener handle it to avoid double crediting
      if (result.status === 'purchased') {
        console.log('Purchase initiated successfully, awaiting transaction confirmation...');
        // Lives will be added by the listener when transaction is confirmed
        return true;
      } else {
        console.log('Purchase failed:', result.error);
        set({ isPurchasing: false });
        return false;
      }
    } catch (error) {
      console.log('Purchase error:', error);
      set({ isPurchasing: false });
      return false;
    }
    // Don't set isPurchasing to false here - let listener handle it
  },

  initializeStore: async () => {
    try {
      // Check if payments are available
      const canMake = await StoreKit.canMakePayments();
      set({ canMakePayments: canMake });
      
      if (canMake) {
        // Get product information
        const products = await StoreKit.getProducts([EXTRA_LIVES_PRODUCT_ID]);
        const extraLivesProduct = products.find(p => p.productId === EXTRA_LIVES_PRODUCT_ID);
        
        if (extraLivesProduct) {
          set({ productPrice: extraLivesProduct.price });
          console.log('Extra Lives product loaded:', extraLivesProduct);
        }
      }

      // Set up purchase event listeners
      StoreKit.addPurchaseListener((result: PurchaseResult) => {
        console.log('Purchase event received:', result);
        
        if (result.productId === EXTRA_LIVES_PRODUCT_ID) {
          if (result.status === 'purchased') {
            // Verify this is a legitimate purchase (in production, validate receipt)
            if (result.transactionId) {
              // Add lives only through listener to prevent double crediting
              const { extraLives } = get();
              const newLives = extraLives + LIVES_PER_PURCHASE;
              
              // For now, use localStorage but with validation
              const currentStoredLives = parseInt(localStorage.getItem('snakeExtraLives') || '0');
              if (currentStoredLives === extraLives) {
                localStorage.setItem('snakeExtraLives', newLives.toString());
                set({ extraLives: newLives, isPurchasing: false });
                console.log(`✅ Purchase confirmed! Added ${LIVES_PER_PURCHASE} lives. Total: ${newLives}`);
              } else {
                console.warn('⚠️ localStorage tamper detected, not crediting lives');
                set({ isPurchasing: false });
              }
            } else {
              console.warn('⚠️ No transaction ID provided, purchase may be fraudulent');
              set({ isPurchasing: false });
            }
          } else if (result.status === 'failed') {
            console.log('❌ Purchase failed');
            set({ isPurchasing: false });
          } else if (result.status === 'restored') {
            console.log('♻️ Purchase restored (consumables typically not restored)');
            set({ isPurchasing: false });
          }
        }
      });
    } catch (error) {
      console.log('Failed to initialize extra lives store:', error);
      set({ canMakePayments: false });
    }
  },

  restorePurchases: async () => {
    try {
      console.log('Restoring purchases...');
      const restoredPurchases = await StoreKit.restorePurchases();
      
      const extraLivesRestored = restoredPurchases.filter(
        p => p.productId === EXTRA_LIVES_PRODUCT_ID && p.status === 'restored'
      );
      
      if (extraLivesRestored.length > 0) {
        // For consumable products like extra lives, we typically don't restore
        // But we can track how many were purchased previously
        console.log(`Found ${extraLivesRestored.length} restored extra lives purchases`);
      }
    } catch (error) {
      console.log('Failed to restore purchases:', error);
    }
  }
}));