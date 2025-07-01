# API Keys Setup Guide - Pharaoh Control Panel

This guide shows you how to obtain and configure all external API keys to unlock 100% functionality.

## 🔑 Required Keys for Full Functionality

### 1. GitHub Personal Access Token (Required for Deployment)
**What it enables:** Real Git repository access, deployment from GitHub repos, automatic framework detection

**How to get it:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)
   - `read:org` (optional, for organization repos)
4. Copy the token (starts with `ghp_` or `github_pat_`)

**How to add it:**
```bash
export GITHUB_TOKEN="your_github_token_here"
```

### 2. Stripe API Keys (Required for Payments)
**What it enables:** Subscription payments, billing management

**How to get them:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Publishable key" (starts with `pk_`)
3. Copy your "Secret key" (starts with `sk_`)

**How to add them:**
```bash
export STRIPE_SECRET_KEY="sk_test_..."
export VITE_STRIPE_PUBLIC_KEY="pk_test_..."
```

### 3. DigitalOcean API Token (Optional - for Server Provisioning)
**What it enables:** Automatic server creation, one-click deployment to new servers

**How to get it:**
1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Give it a name and select "Write" scope
4. Copy the token

**How to add it:**
```bash
export DIGITALOCEAN_TOKEN="dop_v1_..."
```

### 4. AWS Credentials (Optional - for Cloud Management)
**What it enables:** AWS infrastructure management, S3 deployment, EC2 server management

**How to get them:**
1. Go to https://console.aws.amazon.com/iam/home#/security_credentials
2. Create new access key
3. Download the credentials

**How to add them:**
```bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"
```

### 5. SMTP Settings (Optional - for Email Notifications)
**What it enables:** Email alerts, deployment notifications, system reports

**Example configurations:**

**Gmail:**
```bash
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-app-password"
```

**SendGrid:**
```bash
export SMTP_HOST="smtp.sendgrid.net"
export SMTP_PORT="587"
export SMTP_USER="apikey"
export SMTP_PASS="your-sendgrid-api-key"
```

## 🚀 Environment Setup Methods

### Method 1: Environment Variables (Recommended)
Add to your `.env` file or export directly:

```bash
# Core Deployment
export GITHUB_TOKEN="ghp_your_token_here"

# Payment Processing
export STRIPE_SECRET_KEY="sk_test_your_key"
export VITE_STRIPE_PUBLIC_KEY="pk_test_your_key"

# Server Provisioning (Optional)
export DIGITALOCEAN_TOKEN="dop_v1_your_token"
export AWS_ACCESS_KEY_ID="AKIA_your_key"
export AWS_SECRET_ACCESS_KEY="your_secret"

# Email Notifications (Optional)
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-app-password"
```

### Method 2: Replit Secrets
If using Replit, add these in the Secrets tab:
- `GITHUB_TOKEN`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLIC_KEY`
- `DIGITALOCEAN_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Method 3: Using the Settings Panel
1. Navigate to Settings in the control panel
2. Go to each category tab
3. Enter your API keys
4. Click "Test" to verify each connection
5. Save all keys

## 🧪 Testing Your Setup

After adding keys, test functionality:

1. **GitHub Integration:** Try deploying a repository
2. **Payment Processing:** Test subscription flow
3. **Server Management:** Connect to a server via SSH
4. **Email Notifications:** Send a test notification

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables in production
- Rotate keys regularly
- Use minimal required permissions
- Store keys securely in your deployment environment

## 📊 Functionality Matrix

| Feature | No Keys | GitHub | +Stripe | +Cloud | +Email |
|---------|---------|--------|---------|--------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Analysis | ✅ | ✅ | ✅ | ✅ | ✅ |
| File Upload Deploy | ✅ | ✅ | ✅ | ✅ | ✅ |
| Git Deploy | ❌ | ✅ | ✅ | ✅ | ✅ |
| Server Config | ✅ | ✅ | ✅ | ✅ | ✅ |
| Subscriptions | ❌ | ❌ | ✅ | ✅ | ✅ |
| Auto-Provisioning | ❌ | ❌ | ❌ | ✅ | ✅ |
| Email Alerts | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🎯 Quick Start (Minimal Setup)

For basic functionality, just add the GitHub token:

```bash
export GITHUB_TOKEN="ghp_your_github_token_here"
```

This enables:
- Real repository deployment
- Framework auto-detection
- Branch selection
- Build process automation

Restart your application after adding environment variables to see the changes take effect.