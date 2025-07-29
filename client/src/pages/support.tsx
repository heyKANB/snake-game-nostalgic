import { Link } from "wouter";

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Snake Game - Support
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-lg">
                <strong>Developer:</strong> Hunter Games by HeyKANB<br/>
                <strong>Email:</strong> <a href="mailto:kathrynbrown@heykanb.com" className="text-blue-600 hover:text-blue-800">kathrynbrown@heykanb.com</a><br/>
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  How do I play the game?
                </h3>
                <p className="text-gray-600">
                  Use arrow keys or WASD to control the snake. On mobile devices, use the on-screen controls. 
                  Eat food to grow longer and avoid hitting walls or yourself.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  How do I change themes?
                </h3>
                <p className="text-gray-600">
                  Tap the theme button on the main menu to switch between Retro Classic and Modern UI themes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  How do I turn off sound?
                </h3>
                <p className="text-gray-600">
                  Use the audio toggle button in the game interface to mute or unmute sound effects.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Is my high score saved?
                </h3>
                <p className="text-gray-600">
                  Yes, your high score is automatically saved locally on your device.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  The game isn't working properly
                </h3>
                <p className="text-gray-600">
                  Try refreshing the app or restarting it. If problems persist, contact us at the email above 
                  with details about your device and the issue you're experiencing.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
              Report a Bug
            </h2>
            <p className="text-gray-600 mb-4">
              If you encounter any issues, please email us with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
              <li>Description of the problem</li>
              <li>Device type and operating system version</li>
              <li>Steps to reproduce the issue</li>
              <li>Screenshots if applicable</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Privacy & Data
            </h2>
            <p className="text-gray-600 mb-4">
              This game respects your privacy. We only collect minimal data necessary for game functionality.
              For full details, see our <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Version Information
            </h2>
            <p className="text-gray-600">
              <strong>Current Version:</strong> 1.0.0<br/>
              <strong>Last Updated:</strong> January 2025
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              ← Back to Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}