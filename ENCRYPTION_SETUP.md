# Mail-Meow Encryption Setup

Mail-Meow now encrypts sensitive OAuth credentials (client_id, client_secret, refresh_token) using AES-GCM encryption.

## Setup Instructions

### 1. Generate Master Key

First, generate a master encryption key by calling the new endpoint:

```bash
curl -X POST https://your-worker-domain.workers.dev/api/crypto/generate-master-key
```

This will return a response like:

```json
{
  "master_key": "base64-encoded-key-here"
}
```

### 2. Configure Environment Variable

Add the master key to your Cloudflare Worker environment variables:

1. In your `wrangler.jsonc` file, add:

```json
{
  "vars": {
    "MASTER_KEY": "your-generated-master-key-here"
  }
}
```

Or set it as a secret (recommended for production):

```bash
wrangler secret put MASTER_KEY
```

### 3. Run Database Migration

Apply the new migration to update the OAuth table schema:

```bash
wrangler d1 migrations apply mail-meow-db
```

## How It Works

- **Encryption**: OAuth credentials are encrypted using AES-GCM with a 256-bit key
- **Salt Storage**: Each encrypted field uses a unique IV (initialization vector) stored in the `salt` field as JSON
- **Decryption**: Credentials are automatically decrypted when needed for email sending
- **Security**: The master key should be stored securely as a Cloudflare Worker secret

## API Changes

All existing OAuth endpoints continue to work the same way:

- `POST /api/{api_key}/oauth` - Bind OAuth (now encrypts credentials)
- `PUT /api/{api_key}/oauth` - Update OAuth (now encrypts credentials)
- `DELETE /api/{api_key}/oauth` - Delete OAuth
- `POST /api/{api_key}/email` - Send email (automatically decrypts credentials)

## Database Schema Changes

The `oauth` table now has these fields:

- `encrypted_client_id` - Encrypted client ID
- `encrypted_client_secret` - Encrypted client secret
- `encrypted_refresh_token` - Encrypted refresh token
- `salt` - JSON containing IVs for each encrypted field

The old plaintext fields (`client_id`, `client_secret`, `refresh_token`) have been removed.
