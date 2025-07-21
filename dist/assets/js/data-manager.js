class HybridDataManager {
    constructor() {
        this.scrapingEngine = null;
        this.manualData = null;
        this.hybridData = null;
        this.initialized = false;
        this.updateCallbacks = [];
        this.init();
    }

    async init() {
        try {
            // Initialize scraping engine
            this.scrapingEngine = new EthicalScrapingEngine();
            await this.waitForScrapingEngine();

            // Load manual data
            await this.loadManualData();
            
            // Create initial hybrid data
            this.hybridData = this.createHybridData();
            
            this.initialized = true;
            console.log('✅ Hybrid Data Manager initialized');
            
            // Notify callbacks
            this.notifyCallbacks('initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Data Manager:', error);
            this.initialized = false;
        }
    }

    async waitForScrapingEngine() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!this.scrapingEngine.config && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.scrapingEngine.config) {
            console.warn('⚠️ Scraping engine not fully initialized');
        }
    }

    async loadManualData() {
        try {
            const response = await fetch('./assets/data/manual-data.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.manualData = await response.json();
            console.log('📦 Manual data loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load manual data:', error);
            this.manualData = this.getDefaultManualData();
        }
    }

    getDefaultManualData() {
        return {
            profile: {
                name: "Samantha | Asesora Crianza",
                username: "samanthacrianza",
                bio: "Asesora en Crianza Respetuosa | Educadora Infantil",
                niche: "crianza-educacion-infantil"
            },
            instagram: {
                handle: "samanthacrianza",
                followers: 46200,
                engagementRate: 7.8
            },
            tiktok: {
                handle: "samanthacrianza", 
                followers: 78400,
                averageViews: 45200
            }
        };
    }

    createHybridData() {
        if (!this.manualData) {
            console.warn('⚠️ No manual data available for hybrid creation');
            return null;
        }

        // Base hybrid data on manual data
        const hybrid = JSON.parse(JSON.stringify(this.manualData));
        
        // Add metadata
        hybrid.metadata = {
            lastUpdated: new Date().toISOString(),
            dataQuality: {
                instagram: 'manual',
                tiktok: 'manual',
                overall: 'manual'
            },
            sources: {
                instagram: 'manual_data',
                tiktok: 'manual_data'
            },
            autoUpdateEnabled: true
        };

        return hybrid;
    }

    async updateWithLiveData() {
        if (!this.initialized) {
            console.warn('⚠️ Data Manager not initialized');
            return false;
        }

        console.log('🔄 Starting live data update...');
        this.notifyCallbacks('update_started');

        try {
            const instagram = this.manualData.instagram?.handle;
            const tiktok = this.manualData.tiktok?.handle;
            
            const results = await Promise.allSettled([
                instagram ? this.scrapingEngine.scrapeProfile('instagram', instagram) : null,
                tiktok ? this.scrapingEngine.scrapeProfile('tiktok', tiktok) : null
            ]);

            // Process Instagram data
            if (results[0] && results[0].status === 'fulfilled' && results[0].value) {
                this.mergeInstagramData(results[0].value);
            }

            // Process TikTok data  
            if (results[1] && results[1].status === 'fulfilled' && results[1].value) {
                this.mergeTikTokData(results[1].value);
            }

            // Update metadata
            this.updateMetadata();
            
            console.log('✅ Live data update completed');
            this.notifyCallbacks('update_completed', this.hybridData);
            
            return true;

        } catch (error) {
            console.error('❌ Live data update failed:', error);
            this.notifyCallbacks('update_failed', error);
            return false;
        }
    }

    mergeInstagramData(scrapedData) {
        if (!scrapedData || !this.hybridData.instagram) return;

        const instagram = this.hybridData.instagram;
        
        if (scrapedData.scraped && scrapedData.followers > 0) {
            // Use scraped followers if available and reasonable
            if (Math.abs(scrapedData.followers - instagram.followers) / instagram.followers < 0.5) {
                instagram.followers = scrapedData.followers;
                this.hybridData.metadata.sources.instagram = 'live_scraping';
                this.hybridData.metadata.dataQuality.instagram = 'live';
            } else {
                console.warn('⚠️ Scraped Instagram followers seem unrealistic, keeping manual data');
            }
        }

        // Update scraped metadata
        instagram.lastScraped = scrapedData.scrapedAt;
        instagram.scrapedSuccessfully = scrapedData.scraped;
        
        console.log(`📊 Instagram data merged: ${instagram.followers} followers`);
    }

    mergeTikTokData(scrapedData) {
        if (!scrapedData || !this.hybridData.tiktok) return;

        const tiktok = this.hybridData.tiktok;
        
        if (scrapedData.scraped && scrapedData.followers > 0) {
            // Use scraped followers if available and reasonable
            if (Math.abs(scrapedData.followers - tiktok.followers) / tiktok.followers < 0.5) {
                tiktok.followers = scrapedData.followers;
                this.hybridData.metadata.sources.tiktok = 'live_scraping';
                this.hybridData.metadata.dataQuality.tiktok = 'live';
            } else {
                console.warn('⚠️ Scraped TikTok followers seem unrealistic, keeping manual data');
            }
        }

        // Update scraped metadata
        tiktok.lastScraped = scrapedData.scrapedAt;
        tiktok.scrapedSuccessfully = scrapedData.scraped;
        
        console.log(`📊 TikTok data merged: ${tiktok.followers} followers`);
    }

    updateMetadata() {
        if (!this.hybridData.metadata) return;

        this.hybridData.metadata.lastUpdated = new Date().toISOString();
        
        // Calculate overall data quality
        const qualities = [
            this.hybridData.metadata.dataQuality.instagram,
            this.hybridData.metadata.dataQuality.tiktok
        ];
        
        if (qualities.every(q => q === 'live')) {
            this.hybridData.metadata.dataQuality.overall = 'live';
        } else if (qualities.some(q => q === 'live')) {
            this.hybridData.metadata.dataQuality.overall = 'hybrid';
        } else {
            this.hybridData.metadata.dataQuality.overall = 'manual';
        }
    }

    calculateMetrics() {
        if (!this.hybridData) return null;

        const instagram = this.hybridData.instagram || {};
        const tiktok = this.hybridData.tiktok || {};
        
        const metrics = {
            // Total metrics
            totalFollowers: (instagram.followers || 0) + (tiktok.followers || 0),
            totalEngagement: 0,
            
            // Platform breakdown
            platforms: {
                instagram: {
                    followers: instagram.followers || 0,
                    percentage: 0,
                    engagementRate: instagram.engagementRate || 0
                },
                tiktok: {
                    followers: tiktok.followers || 0,
                    percentage: 0,
                    averageViews: tiktok.averageViews || 0
                }
            },
            
            // Growth metrics
            growth: this.calculateGrowthMetrics(),
            
            // Content performance
            topContent: this.getTopContent(),
            
            // Audience insights
            audience: this.hybridData.audience || {},
            
            // Pricing estimates
            pricing: this.hybridData.pricing || {}
        };

        // Calculate percentages
        if (metrics.totalFollowers > 0) {
            metrics.platforms.instagram.percentage = 
                Math.round((metrics.platforms.instagram.followers / metrics.totalFollowers) * 100);
            metrics.platforms.tiktok.percentage = 
                Math.round((metrics.platforms.tiktok.followers / metrics.totalFollowers) * 100);
        }

        // Calculate weighted engagement
        const instagramWeight = metrics.platforms.instagram.percentage / 100;
        const tiktokWeight = metrics.platforms.tiktok.percentage / 100;
        const tiktokEngagement = tiktok.averageLikes ? (tiktok.averageLikes / tiktok.followers) * 100 : 3.5;
        
        metrics.totalEngagement = (instagram.engagementRate || 0) * instagramWeight + 
                                 tiktokEngagement * tiktokWeight;

        return metrics;
    }

    calculateGrowthMetrics() {
        const instagram = this.hybridData.instagram?.monthlyGrowth || [];
        const tiktok = this.hybridData.tiktok?.monthlyGrowth || [];
        
        if (instagram.length === 0 && tiktok.length === 0) {
            return { monthlyGrowthRate: 0, trend: 'stable' };
        }

        // Calculate Instagram growth
        let instagramGrowth = 0;
        if (instagram.length >= 2) {
            const latest = instagram[instagram.length - 1].followers;
            const previous = instagram[instagram.length - 2].followers;
            instagramGrowth = ((latest - previous) / previous) * 100;
        }

        // Calculate TikTok growth
        let tiktokGrowth = 0;
        if (tiktok.length >= 2) {
            const latest = tiktok[tiktok.length - 1].followers;
            const previous = tiktok[tiktok.length - 2].followers;
            tiktokGrowth = ((latest - previous) / previous) * 100;
        }

        const averageGrowth = (instagramGrowth + tiktokGrowth) / 2;
        
        return {
            monthlyGrowthRate: Math.round(averageGrowth * 100) / 100,
            instagram: Math.round(instagramGrowth * 100) / 100,
            tiktok: Math.round(tiktokGrowth * 100) / 100,
            trend: averageGrowth > 2 ? 'growing' : averageGrowth < -1 ? 'declining' : 'stable'
        };
    }

    getTopContent() {
        const instagramPosts = this.hybridData.instagram?.topPosts || [];
        const tiktokVideos = this.hybridData.tiktok?.topVideos || [];
        
        // Normalize and combine content
        const allContent = [
            ...instagramPosts.map(post => ({
                ...post,
                platform: 'instagram',
                url: `https://instagram.com/p/${post.id || ''}`
            })),
            ...tiktokVideos.map(video => ({
                ...video,
                platform: 'tiktok',
                url: `https://tiktok.com/@${this.hybridData.tiktok.handle}`
            }))
        ];

        // Sort by engagement or views
        return allContent
            .sort((a, b) => {
                const aScore = (a.likes || 0) + (a.views || 0) * 0.1;
                const bScore = (b.likes || 0) + (b.views || 0) * 0.1;
                return bScore - aScore;
            })
            .slice(0, 5);
    }

    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    }

    notifyCallbacks(event, data = null) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        });
    }

    getData() {
        return this.hybridData;
    }

    getMetrics() {
        return this.calculateMetrics();
    }

    isInitialized() {
        return this.initialized;
    }

    getDataQuality() {
        return this.hybridData?.metadata?.dataQuality || {
            instagram: 'unknown',
            tiktok: 'unknown', 
            overall: 'unknown'
        };
    }

    getLastUpdated() {
        return this.hybridData?.metadata?.lastUpdated || null;
    }

    // Manual data update methods
    updateManualData(platform, field, value) {
        if (!this.hybridData || !this.hybridData[platform]) {
            console.error(`Invalid platform: ${platform}`);
            return false;
        }

        try {
            this.hybridData[platform][field] = value;
            this.hybridData.metadata.dataQuality[platform] = 'manual';
            this.hybridData.metadata.sources[platform] = 'manual_override';
            this.updateMetadata();
            
            console.log(`✅ Updated ${platform}.${field} to ${value}`);
            this.notifyCallbacks('manual_update', { platform, field, value });
            return true;
            
        } catch (error) {
            console.error('Error updating manual data:', error);
            return false;
        }
    }

    exportData() {
        return {
            data: this.hybridData,
            metrics: this.calculateMetrics(),
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // Auto-update functionality
    startAutoUpdate(intervalMinutes = 60) {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }

        this.autoUpdateInterval = setInterval(async () => {
            console.log('⏰ Auto-updating data...');
            await this.updateWithLiveData();
        }, intervalMinutes * 60 * 1000);

        console.log(`🔄 Auto-update scheduled every ${intervalMinutes} minutes`);
    }

    stopAutoUpdate() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = null;
            console.log('⏹️ Auto-update stopped');
        }
    }
}

// Export for use in other modules
window.HybridDataManager = HybridDataManager;