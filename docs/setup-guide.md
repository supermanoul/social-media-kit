# 📖 Setup Guide - Social Media Kit

## 🚀 Quick Start Guide

### Step 1: Download & Extract
1. Download all project files
2. Extract to a folder (e.g., `social-media-kit`)
3. Keep the folder structure intact

### Step 2: Local Development
```bash
# Option A: Python (Recommended)
cd social-media-kit
python -m http.server 8000

# Option B: Node.js
npm install
npm run dev

# Option C: VS Code Live Server
# Right-click index.html > "Open with Live Server"
```

### Step 3: Access Dashboard
Open browser and navigate to: `http://localhost:8000`

## 🌐 Production Deployment

### Netlify Deployment (Recommended)

#### Option A: Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Drag the project folder to Netlify deploy area
3. Your site is live!

#### Option B: Git Integration
1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Deploy settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.`
4. Enable auto-deploy on push

### Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: **Other**
4. Deploy!

### Traditional Web Hosting
1. Upload all files via FTP
2. Ensure `index.html` is in root directory
3. Configure HTTPS (recommended)

## ⚙️ Configuration

### Manual Data Updates

Edit `assets/data/manual-data.json`:

```json
{
  "profile": {
    "name": "Your Name Here",
    "username": "yourusername", 
    "bio": "Your bio here",
    "profileImage": "your-image-url"
  },
  "instagram": {
    "handle": "yourusername",
    "followers": 50000,
    "engagementRate": 6.5,
    "topPosts": [
      {
        "title": "Your post title",
        "likes": 2500,
        "comments": 150,
        "date": "2024-12-20"
      }
    ]
  }
}
```

### Scraping Configuration

Edit `assets/data/cache-config.json`:

```json
{
  "rateLimiting": {
    "instagram": {
      "requestDelay": 2000,  // 2 seconds
      "maxRetries": 3
    },
    "tiktok": {
      "requestDelay": 3000,  // 3 seconds  
      "maxRetries": 3
    }
  }
}
```

### Visual Customization

Edit `assets/css/main.css` color variables:

```css
:root {
  --primary-color: #ff6b6b;        /* Main brand color */
  --secondary-color: #4ecdc4;      /* Secondary color */
  --accent-color: #45b7d1;         /* Accent color */
  --warm-color: #ffa726;           /* Warm highlights */
}
```

## 🔧 Advanced Setup

### Custom Domain (Netlify)
1. Purchase domain from registrar
2. In Netlify: **Settings** > **Domain management**
3. Add custom domain
4. Update DNS records as instructed
5. Enable HTTPS

### Environment Variables
For sensitive data, use environment variables:

```javascript
// In your deployment platform
CORS_PROXY_URL=your-proxy-url
RATE_LIMIT_DELAY=2000
CACHE_EXPIRY=3600000
```

### Custom CORS Proxy
If using your own proxy server:

```javascript
// In cache-config.json
{
  "scrapingConfig": {
    "corsProxy": "https://your-proxy.com/api?url="
  }
}
```

## 🛡️ Security Best Practices

### Secure Headers
Update `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'"
```

### Rate Limiting
- Never set delays below 2000ms for Instagram
- Never set delays below 3000ms for TikTok
- Respect robots.txt files
- Use manual data as primary source

### Data Privacy
- Only collect public data
- No personal information storage
- GDPR compliant by design
- Clear data retention policies

## 📊 Analytics Setup

### Google Analytics (Optional)
Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
Enable in production:

```javascript
// Add to dashboard.js
if ('performance' in window) {
  window.addEventListener('load', () => {
    console.log('Page loaded in:', performance.now(), 'ms');
  });
}
```

## 🔍 Testing & Validation

### Manual Testing Checklist
- [ ] Dashboard loads without errors
- [ ] All metrics display correctly
- [ ] Charts render properly
- [ ] Update button works
- [ ] Mobile responsive design
- [ ] Export functionality
- [ ] Error handling works

### Browser Compatibility
Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance Benchmarks
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 4s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🚨 Troubleshooting

### Common Issues

#### "Dashboard won't load"
1. Check browser console for errors
2. Verify all files are uploaded
3. Check file permissions
4. Ensure HTTPS if required

#### "Charts not displaying"
1. Verify Chart.js CDN is accessible
2. Check if ad-blockers are interfering
3. Ensure proper script loading order

#### "Update button fails"
1. Normal behavior - system uses fallback data
2. Check rate limiting configuration
3. Verify CORS proxy availability
4. Update manual data instead

#### "Mobile layout broken"
1. Clear browser cache
2. Check CSS files loaded properly
3. Test in incognito mode
4. Verify viewport meta tag

### Debug Mode
Enable debug logging:

```javascript
// Add to main.css
:root {
  --debug-mode: 1;
}
```

Then check browser console for detailed logs.

### Getting Help
1. Check console errors first
2. Review this documentation
3. Test in different browsers
4. Create GitHub issue with details

## 📈 Optimization Tips

### Performance
- Enable CDN for assets
- Compress images (WebP format)
- Minify CSS/JS for production
- Enable browser caching

### SEO
- Add meta descriptions
- Include structured data
- Optimize image alt tags
- Create XML sitemap

### User Experience
- Test on real devices
- Optimize loading states
- Ensure accessibility compliance
- Add keyboard navigation

---

**Need more help?** Check our [Usage Instructions](usage-instructions.md) or [Maintenance Guide](maintenance.md).