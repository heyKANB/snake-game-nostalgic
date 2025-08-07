import Foundation
import Capacitor
import AppTrackingTransparency
import AdSupport

@objc(AppTrackingPlugin)
public class AppTrackingPlugin: CAPPlugin {
    
    @objc func requestPermission(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if #available(iOS 14, *) {
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