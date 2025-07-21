# CLAUDE.md - Social Media Kit Project Context

## 📋 Project Overview
**Social Media Kit Híbrido** for @samanthacrianza - Professional dashboard for parenting advisor with hybrid data system.

## 🚀 Recent Fixes Applied
### Fixed JavaScript Errors (2024-01-XX):
1. **Chart.js loading issue**: Changed from `chart.min.js` to `chart.umd.js` for browser compatibility
2. **CORS preflight errors**: Removed problematic headers (`Upgrade-Insecure-Requests`, `DNT`, `Connection`, etc.) from scraping requests
3. **Request optimization**: Simplified fetch headers to avoid CORS blocks

## 🛠️ Key Technical Stack
- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Charts**: Chart.js 4.4.0
- **Data Management**: Hybrid system (web scraping + manual data)
- **Deployment**: Netlify/Vercel ready
- **Dependencies**: chart.js, date-fns

## 📁 Project Structure
```
social-media-kit/
├── index.html              # Main dashboard
├── assets/
│   ├── css/                 # Styles (main.css, dashboard.css)
│   ├── js/                  # Core JavaScript modules
│   │   ├── scraping-engine.js   # Ethical web scraping
│   │   ├── data-manager.js      # Hybrid data management
│   │   ├── dashboard.js         # UI logic and charts
│   │   └── analytics.js         # Metrics calculations
│   └── data/
│       ├── manual-data.json     # Curated manual data
│       └── cache-config.json    # Cache configuration
├── utils/                   # Utility modules
├── config/                  # Configuration files
├── docs/                    # Documentation
└── build.js                 # Build script (Node.js)
```

## 🔄 Development Commands
```bash
# Development server
npm run dev                  # Python server on port 8000
python -m http.server 8000   # Alternative server

# Build and deploy
npm run build               # Build for production
npm run deploy              # Deploy to Netlify
```

## 📊 Core Features
1. **Hybrid Data System**: Combines ethical web scraping with manual data curation
2. **Real-time Dashboard**: Live metrics for Instagram/TikTok with Chart.js visualizations
3. **Professional Analytics**: Engagement rates, growth charts, top content analysis
4. **Responsive Design**: Modern glassmorphism UI optimized for all devices

## 🎯 Target Audience
- **Primary**: Samantha (@samanthacrianza) - Parenting advisor and infant educator
- **Niche**: Respectful parenting, first-time mothers, infant education
- **Platforms**: Instagram (46.2K followers), TikTok (78.4K followers)

## ⚠️ Important Notes
1. **Ethical Scraping**: Rate-limited to 2-3 seconds between requests, respects robots.txt
2. **CORS Handling**: Uses proxy services for cross-origin requests
3. **Fallback System**: Automatically falls back to manual data when scraping fails
4. **Data Sources**: Instagram & TikTok public data only

## 🐛 Common Issues & Solutions
1. **Chart not defined**: Ensure chart.umd.js loads before dashboard initialization
2. **CORS errors**: Check if proxy services are working, fallback to manual data
3. **Data not loading**: Verify manual-data.json syntax and network connectivity

## 🌐 Deployment URLs
- **GitHub Repository**: https://github.com/supermanoul/social-media-kit
- **Live Production**: https://social-media-1oupavtc9-manuels-projects-8f82680a.vercel.app
- **Vercel Dashboard**: https://vercel.com/manuels-projects-8f82680a/social-media-kit

## 🔮 Next Steps
- [x] Test application in browser
- [x] Verify all JavaScript modules load correctly
- [x] Check chart rendering and data visualization
- [x] Test responsive design on mobile devices
- [x] Deploy to GitHub and configure hosting
- [x] Deploy to Vercel for production hosting

## 📝 Development Notes
- Project created and fixed by Claude Code
- All ethical scraping practices implemented
- Modern ES6+ JavaScript without frameworks
- CSS3 with advanced visual effects
- Ready for production deployment

---
*Last updated: 2024-01-XX by Claude Code*