# Pinata IPFS Setup Guide

This guide will help you set up Pinata for IPFS storage in the DeCo platform.

## Why Pinata?

Pinata provides reliable IPFS pinning services, ensuring your startup application metadata is permanently stored and accessible on the decentralized web.

## Setup Steps

### 1. Create a Pinata Account

1. Go to [https://app.pinata.cloud/register](https://app.pinata.cloud/register)
2. Sign up for a free account
3. Verify your email address

### 2. Generate API Key (JWT Token)

1. Log in to your Pinata account
2. Navigate to **API Keys** page: [https://app.pinata.cloud/developers/api-keys](https://app.pinata.cloud/developers/api-keys)
3. Click the **"New Key"** button
4. Configure your API key:
   - **Key Name**: `DeCo Platform` (or any name you prefer)
   - **Permissions**: Enable the following:
     - ✅ `pinFileToIPFS`
     - ✅ `pinJSONToIPFS`
     - ✅ `unpin` (optional)
   - **Max Uses**: Leave unlimited or set a limit
5. Click **"Create Key"**
6. **IMPORTANT**: Copy the JWT token immediately - you won't be able to see it again!

### 3. Configure Your Environment

1. Open `frontend/.env` file
2. Replace `your_pinata_jwt_here` with your actual JWT token:

```env
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_token_here
```

3. Save the file
4. Restart your development server:

```bash
cd frontend
npm run dev
```

## Testing Your Setup

1. Connect your Freighter wallet
2. Navigate to the Founder view
3. Fill out the application form
4. Click "Submit Application"
5. If successful, you'll see: "Application submitted successfully! Metadata stored on IPFS."

## Troubleshooting

### Error: "Pinata authentication failed"

**Cause**: Your JWT token has expired or is invalid.

**Solution**:
1. Go to [Pinata API Keys](https://app.pinata.cloud/developers/api-keys)
2. Revoke the old key
3. Create a new key following the steps above
4. Update your `.env` file with the new JWT token
5. Restart your dev server

### Error: "Network error"

**Cause**: Internet connection issue or Pinata service is down.

**Solution**:
1. Check your internet connection
2. Visit [Pinata Status](https://status.pinata.cloud/) to check service status
3. Try again in a few minutes

### Error: "Pinata access forbidden"

**Cause**: Your API key doesn't have the required permissions.

**Solution**:
1. Go to your [API Keys](https://app.pinata.cloud/developers/api-keys)
2. Check that `pinJSONToIPFS` permission is enabled
3. If not, create a new key with proper permissions

## Free Tier Limits

Pinata's free tier includes:
- **1 GB** of storage
- **100 GB** bandwidth per month
- Unlimited pins

This is more than enough for testing and small-scale deployments.

## Production Considerations

For production deployment:

1. **Use a dedicated API key** for production (separate from development)
2. **Set up rate limiting** in your application
3. **Monitor usage** in Pinata dashboard
4. **Consider upgrading** to a paid plan for higher limits
5. **Implement caching** to reduce API calls

## Security Best Practices

1. ✅ **Never commit** `.env` file to Git
2. ✅ **Use environment variables** in production (Vercel, Netlify, etc.)
3. ✅ **Rotate keys regularly** (every 3-6 months)
4. ✅ **Set max uses** if possible to limit exposure
5. ✅ **Monitor API usage** in Pinata dashboard

## Alternative: Using API Keys Instead of JWT

If you prefer using API Key + Secret instead of JWT:

1. In Pinata dashboard, create an API key
2. Copy both the **API Key** and **API Secret**
3. Update your `.env`:

```env
# Comment out JWT
# VITE_PINATA_JWT=...

# Use API keys instead
VITE_PINATA_API_KEY=your_api_key_here
VITE_PINATA_SECRET_KEY=your_secret_key_here
```

**Note**: JWT is recommended as it's more secure and easier to manage.

## Need Help?

- **Pinata Documentation**: [https://docs.pinata.cloud/](https://docs.pinata.cloud/)
- **Pinata Support**: [https://pinata.cloud/support](https://pinata.cloud/support)
- **DeCo GitHub Issues**: [https://github.com/neelpote/deco-stellar-accelerator/issues](https://github.com/neelpote/deco-stellar-accelerator/issues)
