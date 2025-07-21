// Scraping Configuration
// This file contains settings for ethical web scraping

const SCRAPING_CONFIG = {
    // Rate limiting settings (milliseconds)
    rateLimits: {
        instagram: {
            requestDelay: 2000,        // Minimum 2 seconds between requests
            maxRetries: 3,             // Maximum retry attempts
            backoffMultiplier: 2,      // Exponential backoff multiplier
            dailyLimit: 200,           // Conservative daily request limit
            burstLimit: 5,             // Maximum requests in burst
            burstWindow: 60000         // Burst window in milliseconds (1 minute)
        },
        tiktok: {
            requestDelay: 3000,        // Minimum 3 seconds between requests
            maxRetries: 3,             // Maximum retry attempts
            backoffMultiplier: 2,      // Exponential backoff multiplier
            dailyLimit: 150,           // Conservative daily request limit
            burstLimit: 3,             // Maximum requests in burst
            burstWindow: 60000         // Burst window in milliseconds (1 minute)
        }
    },

    // Network settings
    network: {
        timeout: 10000,               // Request timeout (10 seconds)
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        acceptLanguage: 'en-US,en;q=0.9,es;q=0.8',
        acceptEncoding: 'gzip, deflate, br',
        connection: 'keep-alive',
        upgradeInsecureRequests: 1
    },

    // CORS proxy settings
    corsProxies: [
        {
            url: 'https://api.allorigins.win/get?url=',
            name: 'AllOrigins',
            responseField: 'contents',
            rateLimit: 1000,           // 1 second between requests
            priority: 1
        },
        {
            url: 'https://cors-anywhere.herokuapp.com/',
            name: 'CORS Anywhere',
            responseField: null,
            rateLimit: 2000,           // 2 seconds between requests
            priority: 2
        },
        {
            url: 'https://thingproxy.freeboard.io/fetch/',
            name: 'ThingProxy',
            responseField: null,
            rateLimit: 1500,           // 1.5 seconds between requests
            priority: 3
        }
    ],

    // Cache settings
    cache: {
        defaultExpiry: 3600000,       // 1 hour default cache
        maxEntries: 100,              // Maximum cache entries
        cleanupInterval: 1800000,     // 30 minutes cleanup interval
        
        // Platform-specific cache durations
        platforms: {
            instagram: {
                profile: 7200000,     // 2 hours
                posts: 3600000,       // 1 hour
                stories: 900000,      // 15 minutes
                engagement: 1800000   // 30 minutes
            },
            tiktok: {
                profile: 7200000,     // 2 hours
                videos: 3600000,      // 1 hour
                engagement: 1800000   // 30 minutes
            }
        }
    },

    // Extraction patterns
    patterns: {
        instagram: {
            // Meta tag patterns
            followersMeta: /(\d+(?:,\d+)*)\s*Followers/i,
            followingMeta: /(\d+(?:,\d+)*)\s*Following/i,
            postsMeta: /(\d+(?:,\d+)*)\s*Posts/i,
            
            // JSON-LD patterns
            jsonLdScript: /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s,
            
            // Page title patterns
            titlePattern: /<title[^>]*>([^<]+)/,
            
            // Verification patterns
            verifiedPattern: /verified|blue.?tick|official/i,
            
            // Bio extraction
            bioPattern: /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
        },
        
        tiktok: {
            // SIGI_STATE extraction
            sigiPattern: /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)<\/script>/,
            
            // Meta tag patterns
            followersMeta: /(\d+(?:\.\d+)?[KMB]?)\s*Followers/i,
            likesMeta: /(\d+(?:\.\d+)?[KMB]?)\s*Likes/i,
            
            // Page title patterns
            titlePattern: /<title[^>]*>([^|]+)/,
            
            // Verification patterns
            verifiedPattern: /verified|official|tick/i,
            
            // Description patterns
            descPattern: /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
        }
    },

    // Ethical guidelines
    ethics: {
        respectRobotsTxt: true,        // Always check and respect robots.txt
        respectMetaTags: true,         // Respect meta robots tags
        honorCacheHeaders: true,       // Follow cache-control headers
        publicDataOnly: true,          // Only access public data
        noPersonalInfo: true,          // Never collect personal information
        rateLimitCompliance: true,     // Strictly follow rate limits
        fallbackToManual: true,        // Use manual data when scraping fails
        transparentOperation: true     // Log all scraping activities
    },

    // Error handling
    errorHandling: {
        maxConsecutiveErrors: 5,       // Stop after 5 consecutive errors
        errorCooldown: 1800000,        // 30 minutes cooldown after errors
        logErrors: true,               // Log all errors for debugging
        fallbackBehavior: 'manual',    // Fallback to manual data
        retryStrategies: {
            networkError: true,        // Retry on network errors
            serverError: true,         // Retry on 5xx errors
            rateLimitError: false,     // Don't retry rate limit errors
            authError: false           // Don't retry auth errors
        }
    },

    // Data validation
    validation: {
        minFollowers: 0,               // Minimum followers for validity
        maxFollowers: 100000000,       // Maximum followers (100M)
        minEngagement: 0,              // Minimum engagement rate
        maxEngagement: 50,             // Maximum engagement rate (50%)
        requiredFields: [              // Required fields for valid data
            'username',
            'followers'
        ],
        dataTypes: {                   // Expected data types
            followers: 'number',
            following: 'number',
            posts: 'number',
            engagement: 'number',
            verified: 'boolean'
        }
    },

    // Monitoring and logging
    monitoring: {
        logLevel: 'info',              // Log level: debug, info, warn, error
        metricsCollection: true,       // Collect performance metrics
        trackSuccess: true,            // Track successful requests
        trackFailures: true,           // Track failed requests
        trackPerformance: true,        // Track response times
        
        // Metrics to collect
        metrics: [
            'requests_total',
            'requests_successful', 
            'requests_failed',
            'response_time_avg',
            'cache_hits',
            'cache_misses',
            'rate_limit_hits'
        ]
    },

    // Security settings
    security: {
        sanitizeInput: true,           // Sanitize all inputs
        validateUrls: true,            // Validate URLs before requests
        checkSslCerts: true,           // Verify SSL certificates
        preventRedirectLoops: true,    // Prevent infinite redirects
        maxRedirects: 3,               // Maximum allowed redirects
        blacklistedDomains: [],        // Domains to never scrape
        whitelistedDomains: [          // Only scrape these domains
            'instagram.com',
            'www.instagram.com',
            'tiktok.com',
            'www.tiktok.com'
        ]
    }
};

// Platform-specific configurations
const PLATFORM_CONFIGS = {
    instagram: {
        baseUrl: 'https://www.instagram.com',
        profilePath: '/{username}/',
        publicDataOnly: true,
        requiresAuth: false,
        dataSources: [
            'meta_tags',
            'json_ld',
            'page_content'
        ],
        fallbackBehavior: 'manual_data'
    },
    
    tiktok: {
        baseUrl: 'https://www.tiktok.com',
        profilePath: '/@{username}',
        publicDataOnly: true,
        requiresAuth: false,
        dataSources: [
            'sigi_state',
            'meta_tags',
            'page_content'
        ],
        fallbackBehavior: 'manual_data'
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        SCRAPING_CONFIG,
        PLATFORM_CONFIGS
    };
} else {
    // Browser environment
    window.SCRAPING_CONFIG = SCRAPING_CONFIG;
    window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
}

// Configuration validation function
function validateConfig(config) {
    const required = ['rateLimits', 'network', 'cache', 'ethics'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required config sections: ${missing.join(', ')}`);
    }
    
    // Validate rate limits
    if (config.rateLimits.instagram.requestDelay < 2000) {
        console.warn('⚠️ Instagram rate limit too aggressive, should be >= 2000ms');
    }
    
    if (config.rateLimits.tiktok.requestDelay < 3000) {
        console.warn('⚠️ TikTok rate limit too aggressive, should be >= 3000ms');
    }
    
    return true;
}

// Auto-validate configuration
try {
    validateConfig(SCRAPING_CONFIG);
    console.log('✅ Scraping configuration validated successfully');
} catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
}