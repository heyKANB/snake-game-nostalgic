import Foundation
import Capacitor
import AppTrackingTransparency
import AdSupport

@objc(AppTrackingPlugin)
public class AppTrackingPlugin: CAPPlugin {
    
    // Plugin loads but ATT request is now handled by AppDelegate.applicationDidBecomeActive
    override public func load() {
        super.load()
        print("AppTrackingPlugin loaded - ATT request will be handled by AppDelegate")
    }
    
    @objc func requestPermission(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if #available(iOS 14, *) {
                let currentStatus = ATTrackingManager.trackingAuthorizationStatus
                
                // If already determined, return current status without showing dialog again
                if currentStatus != .notDetermined {
                    var result: String
                    switch currentStatus {
                    case .authorized:
                        result = "authorized"
                    case .denied:
                        result = "denied"
                    case .restricted:
                        result = "restricted"
                    case .notDetermined:
                        result = "notDetermined"
                    @unknown default:
                        result = "unknown"
                    }
                    call.resolve(["status": result])
                    return
                }
                
                // Request permission if still notDetermined
                ATTrackingManager.requestTrackingAuthorization { status in
                    var result: String
                    switch status {
                    case .authorized:
                        result = "authorized"
                    case .denied:
                        result = "denied"
                    case .restricted:
                        result = "restricted"
                    case .notDetermined:
                        result = "notDetermined"
                    @unknown default:
                        result = "unknown"
                    }
                    call.resolve(["status": result])
                }
            } else {
                // iOS 13 and below - always authorized
                call.resolve(["status": "authorized"])
            }
        }
    }
    
    @objc func getStatus(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            let status = ATTrackingManager.trackingAuthorizationStatus
            var result: String
            switch status {
            case .authorized:
                result = "authorized"
            case .denied:
                result = "denied"
            case .restricted:
                result = "restricted"
            case .notDetermined:
                result = "notDetermined"
            @unknown default:
                result = "unknown"
            }
            call.resolve(["status": result])
        } else {
            // iOS 13 and below - always authorized
            call.resolve(["status": "authorized"])
        }
    }
}