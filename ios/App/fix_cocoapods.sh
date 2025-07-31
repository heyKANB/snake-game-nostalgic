#!/bin/bash

# Script to fix CocoaPods framework embedding issues
# This resolves the "Run script build phase will be run during every build" error

echo "🔧 Fixing CocoaPods build configuration..."

# Navigate to iOS App directory
cd "$(dirname "$0")"

# Clean previous installation
echo "Cleaning previous CocoaPods installation..."
pod deintegrate || echo "No previous integration to remove"
rm -f Podfile.lock
rm -rf Pods/

# Update the existing Podfile post_install hook
echo "Updating Podfile with enhanced post_install configuration..."
cp Podfile Podfile.backup

# Replace the existing post_install block with enhanced version
cat > Podfile << 'EOF'
require_relative '../../node_modules/@capacitor/ios/scripts/pods_helpers'

platform :ios, '14.0'
use_frameworks!

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
# Requires CocoaPods 1.6 or newer
install! 'cocoapods', :disable_input_output_paths => true

def capacitor_pods
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
end

target 'App' do
  capacitor_pods
  # Add your Pods here
end

# Enhanced post_install hook to fix build issues
post_install do |installer|
  assertDeploymentTarget(installer)
  
  # Fix CocoaPods framework embedding and archiving issues
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Set consistent deployment target
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '14.0'
      config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'
      config.build_settings['VALID_ARCHS'] = 'arm64'
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
      
      # Optimize for release builds to prevent archiving issues
      if config.name == 'Release'
        config.build_settings['SWIFT_OPTIMIZATION_LEVEL'] = '-O'
        config.build_settings['SWIFT_COMPILATION_MODE'] = 'wholemodule'
        config.build_settings['COMPILER_INDEX_STORE_ENABLE'] = 'NO'
      end
    end
    
    # Fix build phases that cause "run during every build" warnings
    target.build_phases.each do |phase|
      if phase.respond_to?(:name) && phase.name && phase.name.include?('Embed Pods Frameworks')
        # Add output file paths to prevent unnecessary rebuilds
        if phase.respond_to?(:output_file_list_paths=)
          phase.output_file_list_paths = [
            "${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}",
            "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}"
          ]
          puts "✅ Fixed build phase: #{phase.name}"
        end
      end
    end
  end
  
  puts "✅ CocoaPods post_install optimizations completed"
end
EOF

# Install CocoaPods with enhanced configuration
echo "Installing CocoaPods dependencies with enhanced configuration..."
pod install --repo-update --verbose

# Verify the installation
if [ -f "App.xcworkspace/contents.xcworkspacedata" ]; then
    echo "✅ CocoaPods workspace created successfully"
else
    echo "❌ Workspace creation failed, restoring backup"
    mv Podfile.backup Podfile
    pod install --repo-update
fi

echo "✅ CocoaPods configuration and build phase fixes completed!"