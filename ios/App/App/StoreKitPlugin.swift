import Foundation
import Capacitor
import StoreKit

@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    
    private var productsRequest: SKProductsRequest?
    private var availableProducts: [SKProduct] = []
    private var pendingCall: CAPPluginCall?
    
    override public func load() {
        super.load()
        // Add this plugin as payment transaction observer
        SKPaymentQueue.default().add(self)
        print("StoreKitPlugin loaded and added as payment transaction observer")
    }
    
    deinit {
        // Remove observer when plugin is deallocated
        SKPaymentQueue.default().remove(self)
    }
    
    @objc func getProducts(_ call: CAPPluginCall) {
        guard let productIds = call.getArray("productIds", String.self) else {
            call.reject("Missing required parameter: productIds")
            return
        }
        
        let productIdentifiers = Set(productIds)
        productsRequest = SKProductsRequest(productIdentifiers: productIdentifiers)
        productsRequest?.delegate = self
        productsRequest?.start()
        
        self.pendingCall = call
    }
    
    @objc func purchaseProduct(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Missing required parameter: productId")
            return
        }
        
        // Check if payments are allowed
        guard SKPaymentQueue.canMakePayments() else {
            call.reject("Payments are not allowed on this device")
            return
        }
        
        // Find the product in available products
        guard let product = availableProducts.first(where: { $0.productIdentifier == productId }) else {
            call.reject("Product not found: \(productId)")
            return
        }
        
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
        
        self.pendingCall = call
    }
    
    @objc func restorePurchases(_ call: CAPPluginCall) {
        SKPaymentQueue.default().restoreCompletedTransactions()
        self.pendingCall = call
    }
    
    @objc func canMakePayments(_ call: CAPPluginCall) {
        let canMake = SKPaymentQueue.canMakePayments()
        call.resolve(["canMakePayments": canMake])
    }
    
    // MARK: - SKProductsRequestDelegate
    
    public func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        availableProducts = response.products
        
        let products = response.products.map { product in
            return [
                "productId": product.productIdentifier,
                "title": product.localizedTitle,
                "description": product.localizedDescription,
                "price": product.price.stringValue,
                "priceLocale": product.priceLocale.identifier
            ]
        }
        
        pendingCall?.resolve(["products": products])
        pendingCall = nil
    }
    
    public func request(_ request: SKRequest, didFailWithError error: Error) {
        pendingCall?.reject("Failed to load products: \(error.localizedDescription)")
        pendingCall = nil
    }
    
    // MARK: - SKPaymentTransactionObserver
    
    public func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                handlePurchasedTransaction(transaction)
            case .failed:
                handleFailedTransaction(transaction)
            case .restored:
                handleRestoredTransaction(transaction)
            case .deferred, .purchasing:
                // Transaction is in progress
                break
            @unknown default:
                break
            }
        }
    }
    
    private func handlePurchasedTransaction(_ transaction: SKPaymentTransaction) {
        // Finish the transaction
        SKPaymentQueue.default().finishTransaction(transaction)
        
        let result = [
            "productId": transaction.payment.productIdentifier,
            "transactionId": transaction.transactionIdentifier ?? "",
            "status": "purchased"
        ]
        
        // Notify JavaScript layer
        notifyListeners("purchaseComplete", data: result)
        
        // Resolve pending call if exists
        pendingCall?.resolve(result)
        pendingCall = nil
    }
    
    private func handleFailedTransaction(_ transaction: SKPaymentTransaction) {
        // Finish the transaction
        SKPaymentQueue.default().finishTransaction(transaction)
        
        let error = transaction.error as NSError?
        let errorMessage = error?.localizedDescription ?? "Unknown error"
        
        let result = [
            "productId": transaction.payment.productIdentifier,
            "status": "failed",
            "error": errorMessage
        ]
        
        // Notify JavaScript layer
        notifyListeners("purchaseFailed", data: result)
        
        // Reject pending call if exists
        pendingCall?.reject("Purchase failed: \(errorMessage)")
        pendingCall = nil
    }
    
    private func handleRestoredTransaction(_ transaction: SKPaymentTransaction) {
        // Finish the transaction
        SKPaymentQueue.default().finishTransaction(transaction)
        
        let result = [
            "productId": transaction.payment.productIdentifier,
            "transactionId": transaction.transactionIdentifier ?? "",
            "status": "restored"
        ]
        
        // Notify JavaScript layer
        notifyListeners("purchaseRestored", data: result)
        
        // Resolve pending call if exists (for restore purchases call)
        pendingCall?.resolve(["restoredPurchases": [result]])
        pendingCall = nil
    }
}