class EthicalScrapingEngine {
    constructor() {
        this.config = null;
        this.rateLimiters = new Map();
        this.cache = new Map();
        this.init();
    }

    async init() {
        try {
            const response = await fetch('./assets/data/cache-config.json');
            this.config = await response.json();
            console.log('✅ Scraping engine initialized');
        } catch (error) {
            console.warn('⚠️ Config not loaded, using defaults');
            this.setDefaultConfig();
        }
    }

    setDefaultConfig() {
        this.config = {
            rateLimiting: {
                instagram: { requestDelay: 2000, maxRetries: 3 },
                tiktok: { requestDelay: 3000, maxRetries: 3 }
            },
            scrapingConfig: {
                corsProxy: "https://api.allorigins.win/get?url=",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                respectRobotsTxt: true,
                fallbackToManual: true
            },
            cacheSettings: {
                defaultExpiry: 3600000
            }
        };
    }

    async respectRateLimit(domain) {
        const now = Date.now();
        const lastRequest = this.rateLimiters.get(domain) || 0;
        const delay = this.config.rateLimiting[domain]?.requestDelay || 2000;
        const timeSinceLastRequest = now - lastRequest;

        if (timeSinceLastRequest < delay) {
            const waitTime = delay - timeSinceLastRequest;
            console.log(`⏳ Rate limiting ${domain}: waiting ${waitTime}ms`);
            await this.sleep(waitTime);
        }

        this.rateLimiters.set(domain, Date.now());
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getCacheKey(platform, username, type) {
        return `${platform}_${username}_${type}`;
    }

    isCacheValid(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const expiry = this.config.cacheSettings.defaultExpiry;
        return (Date.now() - cached.timestamp) < expiry;
    }

    setCache(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    getCache(cacheKey) {
        // Try memory cache first
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        // Try localStorage
        try {
            const cached = localStorage.getItem(`cache_${cacheKey}`);
            if (cached) {
                const parsedCache = JSON.parse(cached);
                const expiry = this.config.cacheSettings.defaultExpiry;
                
                if ((Date.now() - parsedCache.timestamp) < expiry) {
                    this.cache.set(cacheKey, parsedCache);
                    return parsedCache.data;
                }
            }
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
        }

        return null;
    }

    async makeRequest(url, options = {}) {
        const fullUrl = this.config.scrapingConfig.corsProxy + encodeURIComponent(url);
        
        const requestOptions = {
            method: 'GET',
            headers: {
                'User-Agent': this.config.scrapingConfig.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            ...options
        };

        try {
            const response = await fetch(fullUrl, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.contents || data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    async getInstagramProfile(username) {
        console.log(`🔍 Scraping Instagram profile: ${username}`);
        
        const cacheKey = this.getCacheKey('instagram', username, 'profile');
        const cached = this.getCache(cacheKey);
        
        if (cached) {
            console.log('📦 Using cached Instagram data');
            return cached;
        }

        await this.respectRateLimit('instagram');

        try {
            const url = `https://www.instagram.com/${username}/`;
            const html = await this.makeRequest(url);
            
            const profileData = this.extractInstagramData(html, username);
            this.setCache(cacheKey, profileData);
            
            console.log('✅ Instagram data scraped successfully');
            return profileData;
            
        } catch (error) {
            console.error('❌ Instagram scraping failed:', error);
            return this.getFallbackInstagramData(username);
        }
    }

    extractInstagramData(html, username) {
        try {
            // Try to extract from meta tags
            const metaFollowers = this.extractMetaContent(html, 'og:description') || '';
            const followersMatch = metaFollowers.match(/(\d+(?:,\d+)*)\s*Followers/i);
            const followers = followersMatch ? parseInt(followersMatch[1].replace(/,/g, '')) : 0;

            // Try to extract from JSON-LD
            const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
            let jsonData = {};
            
            if (jsonLdMatch) {
                try {
                    jsonData = JSON.parse(jsonLdMatch[1]);
                } catch (e) {
                    console.warn('Could not parse JSON-LD');
                }
            }

            // Extract basic profile info
            const nameMatch = html.match(/<title[^>]*>([^<]+)/);
            const name = nameMatch ? nameMatch[1].replace(' (@' + username + ') • Instagram photos and videos', '') : username;

            return {
                username,
                name,
                followers: followers || 0,
                isVerified: html.includes('verified') || html.includes('blue-tick'),
                profileUrl: `https://www.instagram.com/${username}/`,
                scraped: true,
                scrapedAt: new Date().toISOString(),
                source: 'live_scraping'
            };

        } catch (error) {
            console.error('Error extracting Instagram data:', error);
            throw error;
        }
    }

    async getTikTokProfile(username) {
        console.log(`🔍 Scraping TikTok profile: ${username}`);
        
        const cacheKey = this.getCacheKey('tiktok', username, 'profile');
        const cached = this.getCache(cacheKey);
        
        if (cached) {
            console.log('📦 Using cached TikTok data');
            return cached;
        }

        await this.respectRateLimit('tiktok');

        try {
            const url = `https://www.tiktok.com/@${username}`;
            const html = await this.makeRequest(url);
            
            const profileData = this.extractTikTokData(html, username);
            this.setCache(cacheKey, profileData);
            
            console.log('✅ TikTok data scraped successfully');
            return profileData;
            
        } catch (error) {
            console.error('❌ TikTok scraping failed:', error);
            return this.getFallbackTikTokData(username);
        }
    }

    extractTikTokData(html, username) {
        try {
            // Try to extract from SIGI_STATE
            const sigiMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)<\/script>/);
            let sigiData = {};
            
            if (sigiMatch) {
                try {
                    sigiData = JSON.parse(sigiMatch[1]);
                } catch (e) {
                    console.warn('Could not parse SIGI_STATE');
                }
            }

            // Extract from meta tags as fallback
            const metaDescription = this.extractMetaContent(html, 'description') || '';
            const followersMatch = metaDescription.match(/(\d+(?:\.\d+)?[KMB]?)\s*Followers/i);
            
            let followers = 0;
            if (followersMatch) {
                followers = this.parseNumberWithSuffix(followersMatch[1]);
            }

            const nameMatch = html.match(/<title[^>]*>([^|]+)/);
            const name = nameMatch ? nameMatch[1].trim() : username;

            return {
                username,
                name,
                followers: followers || 0,
                isVerified: html.includes('verified') || html.includes('tick'),
                profileUrl: `https://www.tiktok.com/@${username}`,
                scraped: true,
                scrapedAt: new Date().toISOString(),
                source: 'live_scraping'
            };

        } catch (error) {
            console.error('Error extracting TikTok data:', error);
            throw error;
        }
    }

    extractMetaContent(html, property) {
        const regex = new RegExp(`<meta[^>]*(?:property="${property}"|name="${property}")(?:[^>]*content="([^"]*)")?[^>]*>`, 'i');
        const match = html.match(regex);
        return match ? match[1] : null;
    }

    parseNumberWithSuffix(str) {
        const num = parseFloat(str.replace(/[^\d.]/g, ''));
        const suffix = str.toUpperCase();
        
        if (suffix.includes('K')) return Math.round(num * 1000);
        if (suffix.includes('M')) return Math.round(num * 1000000);
        if (suffix.includes('B')) return Math.round(num * 1000000000);
        
        return Math.round(num);
    }

    getFallbackInstagramData(username) {
        console.log('📋 Using fallback Instagram data');
        return {
            username,
            name: 'Profile Name',
            followers: 0,
            isVerified: false,
            profileUrl: `https://www.instagram.com/${username}/`,
            scraped: false,
            scrapedAt: new Date().toISOString(),
            source: 'fallback',
            error: 'Scraping failed, manual data needed'
        };
    }

    getFallbackTikTokData(username) {
        console.log('📋 Using fallback TikTok data');
        return {
            username,
            name: 'Profile Name',
            followers: 0,
            isVerified: false,
            profileUrl: `https://www.tiktok.com/@${username}`,
            scraped: false,
            scrapedAt: new Date().toISOString(),
            source: 'fallback',
            error: 'Scraping failed, manual data needed'
        };
    }

    async checkRobotsTxt(domain) {
        if (!this.config.scrapingConfig.respectRobotsTxt) {
            return true;
        }

        try {
            const robotsUrl = `https://${domain}/robots.txt`;
            const robotsTxt = await this.makeRequest(robotsUrl);
            
            // Basic robots.txt checking (simplified)
            const disallowRules = robotsTxt.match(/Disallow:\s*(.+)/gi) || [];
            const userAgentSection = robotsTxt.includes('User-agent: *');
            
            // If robots.txt disallows root path for all user agents, respect it
            if (userAgentSection && disallowRules.some(rule => rule.includes('Disallow: /'))) {
                console.log(`🤖 Robots.txt disallows scraping for ${domain}`);
                return false;
            }
            
            return true;
        } catch (error) {
            console.warn('Could not check robots.txt:', error);
            return true; // Assume allowed if can't check
        }
    }

    async scrapeProfile(platform, username) {
        console.log(`🎯 Starting ${platform} scraping for ${username}`);
        
        try {
            // Check robots.txt
            const domain = platform === 'instagram' ? 'instagram.com' : 'tiktok.com';
            const robotsAllowed = await this.checkRobotsTxt(domain);
            
            if (!robotsAllowed) {
                console.log(`⛔ Robots.txt blocks scraping for ${domain}`);
                return platform === 'instagram' 
                    ? this.getFallbackInstagramData(username)
                    : this.getFallbackTikTokData(username);
            }

            // Proceed with scraping
            if (platform === 'instagram') {
                return await this.getInstagramProfile(username);
            } else if (platform === 'tiktok') {
                return await this.getTikTokProfile(username);
            }
            
        } catch (error) {
            console.error(`❌ ${platform} scraping error:`, error);
            return platform === 'instagram' 
                ? this.getFallbackInstagramData(username)
                : this.getFallbackTikTokData(username);
        }
    }

    clearCache() {
        this.cache.clear();
        
        // Clear localStorage cache
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('🧹 Cache cleared');
    }

    getScrapingStatus() {
        return {
            initialized: !!this.config,
            cacheSize: this.cache.size,
            rateLimiters: Array.from(this.rateLimiters.entries()),
            lastActivity: new Date().toISOString()
        };
    }
}

// Export for use in other modules
window.ScrapingEngine = EthicalScrapingEngine;