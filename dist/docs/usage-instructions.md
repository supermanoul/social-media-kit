# 📚 Usage Instructions - Social Media Kit

## 🎯 Dashboard Overview

### Main Components

#### 📊 **Header Section**
- **Profile Image**: Shows influencer photo with verification badge
- **Bio Information**: Name, description, social handles
- **Update Button**: Manual refresh of live data
- **Status Indicator**: Shows data quality (Manual/Live/Error)

#### 📈 **Main Metrics Cards**
- **Total Followers**: Combined Instagram + TikTok followers
- **Engagement Rate**: Weighted average across platforms
- **Monthly Reach**: Estimated reach based on engagement
- **Average Views**: Estimated views per post/video

#### 📊 **Charts Section**
- **Growth Chart**: 6-month follower growth trend
- **Platform Distribution**: Pie chart of follower split
- **Engagement by Content**: Performance by content type

#### 🏆 **Top Content**
- **Best Posts/Videos**: Top 5 performing content pieces
- **Performance Metrics**: Likes, comments, views, shares
- **Platform Indicators**: Instagram/TikTok badges

## 🔄 Data Management

### Manual Data Updates

#### Step 1: Edit Data File
Open `assets/data/manual-data.json` in any text editor.

#### Step 2: Update Key Metrics
```json
{
  "instagram": {
    "followers": 46200,           // ← Update this
    "engagementRate": 7.8,        // ← Update this  
    "averageLikes": 1250,         // ← Update this
    "averageComments": 95         // ← Update this
  },
  "tiktok": {
    "followers": 78400,           // ← Update this
    "averageViews": 45200,        // ← Update this
    "averageLikes": 2100,         // ← Update this
    "averageComments": 185        // ← Update this
  }
}
```

#### Step 3: Update Top Content
```json
{
  "instagram": {
    "topPosts": [
      {
        "title": "Your best post title",     // ← Update
        "likes": 25400,                      // ← Update
        "comments": 1200,                    // ← Update
        "engagement": 8.9,                   // ← Calculate: (likes+comments)/followers*100
        "date": "2024-12-15",                // ← Update date
        "hashtags": ["#hashtag1", "#hashtag2"] // ← Update hashtags
      }
      // ... add up to 5 posts
    ]
  },
  "tiktok": {
    "topVideos": [
      {
        "title": "Your best video title",    // ← Update
        "views": 189200,                     // ← Update
        "likes": 8400,                       // ← Update 
        "comments": 456,                     // ← Update
        "shares": 234,                       // ← Update
        "date": "2024-12-12",                // ← Update date
        "duration": "1:23"                   // ← Update duration
      }
      // ... add up to 5 videos
    ]
  }
}
```

#### Step 4: Save & Refresh
1. Save the JSON file
2. Refresh the browser page
3. Or click "Actualizar" button

### Live Data Updates

#### Automatic Updates
- System attempts live updates every hour
- Falls back to manual data if scraping fails
- Respects rate limits and platform policies

#### Manual Live Update
1. Click **"Actualizar"** button
2. Wait for "Actualizando..." status
3. Check console for success/error messages
4. Review updated metrics

#### Understanding Data Sources
- 🟢 **Live**: Data from recent scraping
- 🔵 **Manual**: Curated manual data
- 🟡 **Hybrid**: Mix of live and manual
- 🔴 **Error**: Fallback to manual due to scraping failure

## 📊 Metrics Explained

### Follower Metrics

#### **Total Followers**
Sum of Instagram + TikTok followers
```
Total = Instagram Followers + TikTok Followers
```

#### **Growth Rate**
Monthly percentage change in followers
```
Growth % = (Current - Previous) / Previous × 100
```

#### **Platform Distribution**
Percentage split between platforms
```
Instagram % = (IG Followers / Total) × 100
TikTok % = (TT Followers / Total) × 100
```

### Engagement Metrics

#### **Weighted Engagement Rate**
Platform-weighted average engagement
```
Weighted ER = (IG_ER × IG_Weight) + (TT_ER × TT_Weight)
Where: Weight = Platform Followers / Total Followers
```

#### **Average Views**
Estimated views per content piece
```
Avg Views = (IG_Likes × 15 + TT_Views) / 2
```

#### **Monthly Reach**
Estimated monthly audience reach
```
Monthly Reach = Total Followers × ER × Posts/Month × Reach Multiplier
```

### Content Performance

#### **Content Score**
Engagement-weighted performance score
```
Score = Likes + (Comments × 5) + (Shares × 8)
```

#### **Performance Rating**
- 🔥 **Viral**: 10%+ of followers engaged
- ⭐ **Excellent**: 5-10% engagement  
- 👍 **Very Good**: 3-5% engagement
- ✅ **Good**: 1-3% engagement
- 📊 **Average**: 0.5-1% engagement
- 📉 **Below Average**: <0.5% engagement

## 🎯 Analytics Features

### Demographics Analysis
View in **Analytics** section:
- **Gender Split**: Male vs Female audience
- **Age Groups**: Distribution by age ranges
- **Top Locations**: Geographic audience breakdown
- **Interests**: Audience interest categories

### Content Insights
Track in **Top Content** section:
- **Best Performing Posts**: Highest engagement
- **Optimal Content Types**: What works best
- **Trending Hashtags**: Most effective tags
- **Peak Performance Times**: When to post

### Hashtag Strategy
Monitor in **Analytics** section:
- **Top Hashtags**: Most used tags
- **Performance Impact**: Reach/engagement boost
- **Hashtag Trends**: Rising and falling tags
- **Niche Alignment**: Relevance to audience

## 💰 Pricing & Collaborations

### Rate Card Management

#### Update Pricing
Edit `manual-data.json`:
```json
{
  "pricing": {
    "instagramPost": {"min": 450, "max": 750, "currency": "EUR"},
    "instagramStory": {"min": 200, "max": 350, "currency": "EUR"},
    "instagramReel": {"min": 600, "max": 950, "currency": "EUR"},
    "tiktokVideo": {"min": 600, "max": 900, "currency": "EUR"},
    "packageDeals": {
      "instagram3posts": {"price": 1800, "description": "3 posts + stories"},
      "crossPlatform": {"price": 2200, "description": "IG post + TikTok video"},
      "monthlyPartnership": {"price": 4500, "description": "Monthly package"}
    }
  }
}
```

#### Pricing Strategy Tips
- **Nano Influencers** (1K-10K): €15-25 per 1K followers
- **Micro Influencers** (10K-100K): €10-20 per 1K followers  
- **Mid-tier** (100K-500K): €5-15 per 1K followers
- **Engagement Premium**: +20-50% for high engagement
- **Niche Premium**: +20% for specialized niches like parenting

### Brand Collaboration Tracking

#### Add New Collaboration
```json
{
  "brandCollaborations": [
    {
      "brand": "Brand Name",
      "type": "Partnership|Sponsored Content|Product Review",
      "duration": "1 month|3 months|Ongoing",
      "status": "Activa|Completada|Pendiente"
    }
  ]
}
```

#### Collaboration Status
- 🟢 **Activa**: Currently running campaign
- ✅ **Completada**: Finished campaign
- ⏳ **Pendiente**: Upcoming campaign
- ❌ **Cancelada**: Cancelled campaign

## 📱 Mobile Optimization

### Mobile Features
- **Touch-friendly**: Large buttons and touch targets
- **Responsive Charts**: Optimized for small screens
- **Swipe Navigation**: Natural mobile gestures
- **Fast Loading**: Optimized images and assets

### Mobile-Specific Usage
- **Portrait Mode**: Optimized vertical layout
- **Landscape Mode**: Full-width charts
- **Touch Interactions**: Tap to expand details
- **Offline Mode**: Cached data available

## 🔧 Customization Options

### Visual Customization

#### Change Brand Colors
Edit `assets/css/main.css`:
```css
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
  --accent-color: #your-accent-color;
}
```

#### Update Profile Information
Edit `manual-data.json`:
```json
{
  "profile": {
    "name": "Your Display Name",
    "username": "yourusername", 
    "bio": "Your professional bio",
    "profileImage": "https://your-image-url.com/photo.jpg",
    "niche": "your-niche-category",
    "location": "Your Location",
    "languages": ["español", "english"]
  }
}
```

### Functional Customization

#### Auto-Update Frequency
Default: Every 60 minutes
```javascript
// In dashboard.js, modify:
this.dataManager.startAutoUpdate(60); // minutes
```

#### Rate Limiting
Adjust in `cache-config.json`:
```json
{
  "rateLimiting": {
    "instagram": {"requestDelay": 2000}, // minimum 2000ms
    "tiktok": {"requestDelay": 3000}     // minimum 3000ms
  }
}
```

## 📤 Export & Sharing

### Data Export
1. Click **"Exportar PDF"** button
2. Select format (JSON/PDF)
3. File downloads automatically
4. Use for media kits or presentations

### Sharing Features
1. Click **"Compartir"** button  
2. Native sharing (mobile) or copy link
3. Share dashboard URL directly
4. Perfect for brand outreach

### Export Data Format
```json
{
  "data": { /* All profile data */ },
  "metrics": { /* Calculated metrics */ },
  "exportedAt": "2024-12-20T10:30:00Z",
  "version": "1.0.0"
}
```

## 🔍 Monitoring & Analytics

### Performance Tracking
- **Load Times**: Monitor dashboard performance
- **Error Rates**: Track scraping success/failure
- **User Interactions**: Button clicks, exports
- **Data Quality**: Live vs manual data ratios

### Quality Indicators
- 🟢 **High Quality**: >80% live data
- 🟡 **Medium Quality**: 50-80% live data  
- 🔴 **Manual Only**: <50% live data
- ⚠️ **Issues**: Error states or stale data

### Success Metrics
- **Engagement Growth**: Month-over-month improvement
- **Follower Growth**: Sustainable growth rate
- **Brand Collaborations**: Successful partnerships
- **Content Performance**: Viral content frequency

---

**💡 Pro Tips**
- Update manual data weekly for accuracy
- Monitor engagement trends monthly
- Export data for brand pitches
- Use analytics for content strategy
- Track competitor performance for benchmarking