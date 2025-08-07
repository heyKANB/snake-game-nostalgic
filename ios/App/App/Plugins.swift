import Capacitor
import Foundation

@objc public class Plugins: NSObject {
    @objc public static func load(_ bridge: CAPBridge) {
        bridge.registerPluginInstance(AppTrackingPlugin())
    }
}