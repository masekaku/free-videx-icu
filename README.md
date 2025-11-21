# Video Player Next.js

Situs video player full-screen optimized untuk social media traffic dan Adsterra monetization.

## 🛡️ Security Features
- **Protected Video Data**: JSON tidak bisa diakses langsung (404)
- **VPN Detection**: Blokir koneksi VPN/Proxy  
- **Cloudflare Geo-Block**: Country filtering via WAF
- **Secure APIs**: Data hanya via authorized routes

## 🌐 Supported Video Hosting
- ✅ **Google Cloud Storage** (commondatastorage.googleapis.com)
- ✅ **Bunny CDN** (vz-*.b-cdn.net) 
- ✅ **Vimeo** (vimeo.com)
- ✅ **YouTube** (youtube.com)
- ✅ **Self-hosted** (cdn.domain-anda.com)
- ✅ **SEMUA hosting providers** - No restrictions!

## 🚀 Quick Deployment

### Cloudflare Pages (Recommended)
```bash
npm install
npm run build:cloudflare
# Upload 'out' folder ke Cloudflare Pages