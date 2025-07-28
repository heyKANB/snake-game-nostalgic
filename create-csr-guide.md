# How to Create Certificate Signing Request (CSR) for Apple Developer

## Why You Need to Create CSR Yourself

A Certificate Signing Request (CSR) contains your public key and identifying information. The corresponding private key must remain on your machine for security. No one else can or should generate this for you.

## Method 1: Using Keychain Access (Mac - Recommended)

### Step 1: Open Keychain Access
1. Press `Cmd + Space` and search for "Keychain Access"
2. Open the application

### Step 2: Request Certificate
1. Go to **Keychain Access** menu → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**
2. Fill in the form:
   - **User Email Address**: Your Apple Developer account email
   - **Common Name**: Your name or company name
   - **CA Email Address**: Leave blank
   - **Request is**: Select "Saved to disk"
   - **Let me specify key pair information**: Check this box
3. Click **Continue**

### Step 3: Configure Key Settings
1. **Key Size**: 2048 bits
2. **Algorithm**: RSA
3. Click **Continue**

### Step 4: Save CSR File
1. Choose location to save (Desktop is fine)
2. Filename: `SnakeGameCertificateSigningRequest.certSigningRequest`
3. Click **Save**

## Method 2: Using Terminal (Mac/Linux)

```bash
# Create private key and CSR in one command
openssl req -new -newkey rsa:2048 -nodes -keyout snake_game_private.key -out snake_game_csr.csr

# When prompted, enter:
# Country Name: US (or your country code)
# State: Your state
# City: Your city
# Organization: Your name or company
# Organizational Unit: IT Department (or leave blank)
# Common Name: Your name
# Email: Your Apple Developer email
# Challenge password: (leave blank)
# Optional company name: (leave blank)
```

## Method 3: Using OpenSSL (Windows)

### Install OpenSSL
1. Download from: https://slproweb.com/products/Win32OpenSSL.html
2. Install the software

### Generate CSR
```cmd
# Open Command Prompt as Administrator
cd C:\OpenSSL-Win64\bin

# Create CSR
openssl req -new -newkey rsa:2048 -nodes -keyout snake_game_private.key -out snake_game_csr.csr
```

## What to Upload to Apple Developer

### File Details
- **File to upload**: The `.certSigningRequest` or `.csr` file
- **File size**: Usually 1-2 KB
- **Contains**: Your public key and identifying information
- **Does NOT contain**: Your private key (this stays on your machine)

### Upload Process
1. Go to Apple Developer Portal
2. **Certificates, Identifiers & Profiles** → **Certificates** → **+**
3. Select **iOS Distribution** (for App Store)
4. Click **Continue**
5. **Upload** your CSR file
6. Click **Continue**
7. **Download** the certificate when ready

## Important Security Notes

### Keep Private Key Safe
- The private key file (`.key`) must remain on your machine
- Never share or upload the private key anywhere
- Back it up securely (encrypted storage)

### Certificate Installation
1. Download the certificate from Apple Developer
2. Double-click to install in Keychain Access
3. The certificate will pair with your private key automatically

## For Codemagic Integration

### Option 1: Automatic (Recommended)
- Let Codemagic handle certificate generation
- Requires App Store Connect API key
- No manual CSR creation needed

### Option 2: Manual Upload
If you prefer manual control:
1. Create CSR (using steps above)
2. Generate certificate in Apple Developer
3. Export certificate + private key as `.p12`
4. Upload `.p12` to Codemagic

## Troubleshooting

### Common Issues
- **"Invalid CSR"**: Ensure 2048-bit RSA key
- **"CSR already used"**: Generate a new CSR
- **"Private key not found"**: Certificate and private key must be on same machine

### File Formats
- **CSR files**: `.certSigningRequest` or `.csr`
- **Certificate files**: `.cer` or `.crt`
- **Private key files**: `.key`
- **Combined files**: `.p12` or `.pfx`

## Quick Reference Commands

```bash
# Check CSR details
openssl req -text -noout -verify -in snake_game_csr.csr

# Check certificate details
openssl x509 -text -noout -in certificate.cer

# Create .p12 from certificate and private key
openssl pkcs12 -export -out certificate.p12 -inkey private.key -in certificate.cer
```

Follow these steps to create your CSR securely on your own machine, then upload it to Apple Developer Portal.