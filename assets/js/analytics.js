class AnalyticsCalculator {
    constructor() {
        this.nicheMultipliers = {
            'crianza-educacion-infantil': 1.2,
            'fitness': 1.1,
            'beauty': 1.3,
            'food': 1.0,
            'travel': 1.1,
            'lifestyle': 0.9,
            'tech': 1.0,
            'fashion': 1.2,
            'default': 1.0
        };
        
        this.engagementBenchmarks = {
            nano: { min: 1000, max: 10000, engagement: 7.2 },
            micro: { min: 10000, max: 100000, engagement: 4.7 },
            mid: { min: 100000, max: 500000, engagement: 2.4 },
            macro: { min: 500000, max: 1000000, engagement: 1.7 },
            mega: { min: 1000000, max: Infinity, engagement: 1.1 }
        };
    }

    calculateTotalFollowers(data) {
        if (!data) return 0;
        
        const instagram = data.instagram?.followers || 0;
        const tiktok = data.tiktok?.followers || 0;
        
        return instagram + tiktok;
    }

    calculateWeightedEngagement(data) {
        if (!data) return 0;
        
        const instagram = data.instagram || {};
        const tiktok = data.tiktok || {};
        
        const totalFollowers = this.calculateTotalFollowers(data);
        if (totalFollowers === 0) return 0;
        
        // Instagram engagement
        const instagramFollowers = instagram.followers || 0;
        const instagramEngagement = instagram.engagementRate || 0;
        const instagramWeight = instagramFollowers / totalFollowers;
        
        // TikTok engagement (calculate from likes/followers)
        let tiktokEngagement = 0;
        const tiktokFollowers = tiktok.followers || 0;
        const tiktokWeight = tiktokFollowers / totalFollowers;
        
        if (tiktokFollowers > 0 && tiktok.averageLikes) {
            tiktokEngagement = (tiktok.averageLikes / tiktokFollowers) * 100;
        } else {
            // Estimate based on average TikTok engagement
            tiktokEngagement = 3.5;
        }
        
        // Weighted average
        const weightedEngagement = (instagramEngagement * instagramWeight) + 
                                 (tiktokEngagement * tiktokWeight);
        
        return Math.round(weightedEngagement * 100) / 100;
    }

    calculateMonthlyReach(data) {
        if (!data) return 0;
        
        const totalFollowers = this.calculateTotalFollowers(data);
        const engagementRate = this.calculateWeightedEngagement(data);
        
        // Estimate reach based on followers and engagement
        // Reach = followers * engagement rate * average posts per month * reach multiplier
        const avgPostsPerMonth = 12; // Conservative estimate
        const reachMultiplier = 8; // Each engaged user potentially reaches 8 others
        
        const monthlyReach = Math.round(totalFollowers * (engagementRate / 100) * avgPostsPerMonth * reachMultiplier);
        
        return monthlyReach;
    }

    calculateAverageViews(data) {
        if (!data) return 0;
        
        const instagram = data.instagram || {};
        const tiktok = data.tiktok || {};
        
        let totalViews = 0;
        let platforms = 0;
        
        // Instagram views (estimate from likes)
        if (instagram.averageLikes) {
            const instagramViews = instagram.averageLikes * 15; // Typical view-to-like ratio
            totalViews += instagramViews;
            platforms++;
        }
        
        // TikTok views
        if (tiktok.averageViews) {
            totalViews += tiktok.averageViews;
            platforms++;
        }
        
        return platforms > 0 ? Math.round(totalViews / platforms) : 0;
    }

    calculateInfluencerScore(data) {
        if (!data) return 0;
        
        const totalFollowers = this.calculateTotalFollowers(data);
        const engagementRate = this.calculateWeightedEngagement(data);
        const niche = data.profile?.niche || 'default';
        
        // Base score from followers (logarithmic scale)
        const followerScore = Math.log10(Math.max(totalFollowers, 1)) * 20;
        
        // Engagement score
        const engagementScore = engagementRate * 10;
        
        // Niche multiplier
        const nicheMultiplier = this.nicheMultipliers[niche] || this.nicheMultipliers.default;
        
        // Consistency score (based on content quality indicators)
        const consistencyScore = this.calculateConsistencyScore(data);
        
        // Final score calculation
        const score = (followerScore + engagementScore + consistencyScore) * nicheMultiplier;
        
        return Math.min(Math.round(score), 100);
    }

    calculateConsistencyScore(data) {
        let score = 0;
        
        // Check for complete profile data
        if (data.profile?.bio) score += 5;
        if (data.profile?.location) score += 3;
        
        // Check for content consistency
        const instagram = data.instagram || {};
        const tiktok = data.tiktok || {};
        
        if (instagram.topPosts && instagram.topPosts.length >= 3) score += 8;
        if (tiktok.topVideos && tiktok.topVideos.length >= 3) score += 8;
        
        // Check for hashtag strategy
        if (instagram.topHashtags && instagram.topHashtags.length >= 3) score += 6;
        
        // Check for optimal posting times
        if (instagram.bestTimes && instagram.bestTimes.length > 0) score += 5;
        
        return Math.min(score, 25);
    }

    calculateGrowthRate(data) {
        if (!data) return { rate: 0, trend: 'stable' };
        
        const instagram = data.instagram?.monthlyGrowth || [];
        const tiktok = data.tiktok?.monthlyGrowth || [];
        
        let totalGrowth = 0;
        let platforms = 0;
        
        // Calculate Instagram growth
        if (instagram.length >= 2) {
            const latest = instagram[instagram.length - 1].followers;
            const previous = instagram[instagram.length - 2].followers;
            const instagramGrowth = ((latest - previous) / previous) * 100;
            totalGrowth += instagramGrowth;
            platforms++;
        }
        
        // Calculate TikTok growth
        if (tiktok.length >= 2) {
            const latest = tiktok[tiktok.length - 1].followers;
            const previous = tiktok[tiktok.length - 2].followers;
            const tiktokGrowth = ((latest - previous) / previous) * 100;
            totalGrowth += tiktokGrowth;
            platforms++;
        }
        
        const averageGrowth = platforms > 0 ? totalGrowth / platforms : 0;
        const roundedGrowth = Math.round(averageGrowth * 100) / 100;
        
        let trend = 'stable';
        if (roundedGrowth > 3) trend = 'growing';
        else if (roundedGrowth < -2) trend = 'declining';
        
        return { rate: roundedGrowth, trend };
    }

    estimateEarnings(data) {
        if (!data) return { min: 0, max: 0, currency: 'EUR' };
        
        const totalFollowers = this.calculateTotalFollowers(data);
        const engagementRate = this.calculateWeightedEngagement(data);
        const niche = data.profile?.niche || 'default';
        
        // Base rate calculation (per 1000 followers)
        let baseRate = 0;
        
        // Tier-based calculation
        if (totalFollowers >= 1000000) {
            baseRate = 8; // €8 per 1000 followers for mega influencers
        } else if (totalFollowers >= 500000) {
            baseRate = 12; // €12 per 1000 followers for macro influencers
        } else if (totalFollowers >= 100000) {
            baseRate = 15; // €15 per 1000 followers for mid-tier
        } else if (totalFollowers >= 10000) {
            baseRate = 18; // €18 per 1000 followers for micro influencers
        } else {
            baseRate = 22; // €22 per 1000 followers for nano influencers
        }
        
        // Apply engagement multiplier
        const engagementMultiplier = Math.max(0.5, Math.min(2.0, engagementRate / 3.5));
        
        // Apply niche multiplier
        const nicheMultiplier = this.nicheMultipliers[niche] || 1.0;
        
        // Calculate base earnings per post
        const baseEarnings = (totalFollowers / 1000) * baseRate * engagementMultiplier * nicheMultiplier;
        
        return {
            min: Math.round(baseEarnings * 0.7),
            max: Math.round(baseEarnings * 1.3),
            currency: 'EUR'
        };
    }

    getInfluencerTier(followers) {
        for (const [tier, data] of Object.entries(this.engagementBenchmarks)) {
            if (followers >= data.min && followers < data.max) {
                return tier;
            }
        }
        return 'nano';
    }

    getEngagementBenchmark(followers) {
        const tier = this.getInfluencerTier(followers);
        return this.engagementBenchmarks[tier].engagement;
    }

    analyzeEngagementQuality(data) {
        if (!data) return { quality: 'unknown', score: 0 };
        
        const totalFollowers = this.calculateTotalFollowers(data);
        const actualEngagement = this.calculateWeightedEngagement(data);
        const benchmarkEngagement = this.getEngagementBenchmark(totalFollowers);
        
        const ratio = actualEngagement / benchmarkEngagement;
        
        let quality, score;
        
        if (ratio >= 1.5) {
            quality = 'excellent';
            score = 90 + Math.min(10, (ratio - 1.5) * 20);
        } else if (ratio >= 1.2) {
            quality = 'very_good';
            score = 80 + ((ratio - 1.2) / 0.3) * 10;
        } else if (ratio >= 0.8) {
            quality = 'good';
            score = 60 + ((ratio - 0.8) / 0.4) * 20;
        } else if (ratio >= 0.5) {
            quality = 'average';
            score = 40 + ((ratio - 0.5) / 0.3) * 20;
        } else {
            quality = 'below_average';
            score = Math.max(0, ratio * 80);
        }
        
        return {
            quality,
            score: Math.round(score),
            ratio: Math.round(ratio * 100) / 100,
            benchmark: benchmarkEngagement
        };
    }

    calculateContentPerformance(data) {
        if (!data) return [];
        
        const instagram = data.instagram?.topPosts || [];
        const tiktok = data.tiktok?.topVideos || [];
        
        // Normalize content data
        const allContent = [];
        
        // Process Instagram posts
        instagram.forEach(post => {
            const engagementScore = (post.likes + post.comments * 5); // Comments weighted higher
            allContent.push({
                ...post,
                platform: 'instagram',
                engagementScore,
                performanceRating: this.rateContentPerformance(engagementScore, 'instagram', data.instagram.followers)
            });
        });
        
        // Process TikTok videos
        tiktok.forEach(video => {
            const engagementScore = (video.likes + video.comments * 3 + (video.shares || 0) * 8); // Shares weighted highest
            allContent.push({
                ...video,
                platform: 'tiktok',
                engagementScore,
                performanceRating: this.rateContentPerformance(engagementScore, 'tiktok', data.tiktok.followers)
            });
        });
        
        // Sort by performance
        return allContent.sort((a, b) => b.engagementScore - a.engagementScore);
    }

    rateContentPerformance(engagementScore, platform, followers) {
        const followerRatio = engagementScore / followers;
        
        if (followerRatio >= 0.1) return 'viral';
        if (followerRatio >= 0.05) return 'excellent';
        if (followerRatio >= 0.03) return 'very_good';
        if (followerRatio >= 0.01) return 'good';
        if (followerRatio >= 0.005) return 'average';
        return 'below_average';
    }

    calculateAudienceValue(data) {
        if (!data?.audience) return { value: 0, quality: 'unknown' };
        
        const demographics = data.audience.demographics;
        let score = 0;
        
        // Gender distribution score (higher for specific niches)
        const niche = data.profile?.niche || 'default';
        if (niche === 'crianza-educacion-infantil' && demographics.gender?.female > 80) {
            score += 25; // Perfect match for parenting niche
        }
        
        // Age distribution score
        const targetAge = demographics.ageGroups?.['25-34'] || 0;
        if (targetAge > 60) score += 25; // High concentration in target age
        
        // Location score
        const mainLocation = Math.max(...Object.values(demographics.locations || {}));
        if (mainLocation > 60) score += 20; // Good geographic concentration
        
        // Interest alignment score
        if (data.audience.interests) {
            const relevantInterests = data.audience.interests.filter(i => i.percentage > 50);
            score += Math.min(30, relevantInterests.length * 10);
        }
        
        let quality = 'average';
        if (score >= 80) quality = 'excellent';
        else if (score >= 60) quality = 'good';
        else if (score >= 40) quality = 'average';
        else quality = 'needs_improvement';
        
        return { value: score, quality };
    }

    generateInsights(data) {
        if (!data) return [];
        
        const insights = [];
        const totalFollowers = this.calculateTotalFollowers(data);
        const engagementRate = this.calculateWeightedEngagement(data);
        const growthData = this.calculateGrowthRate(data);
        const engagementAnalysis = this.analyzeEngagementQuality(data);
        const audienceValue = this.calculateAudienceValue(data);
        
        // Engagement insights
        if (engagementAnalysis.quality === 'excellent') {
            insights.push({
                type: 'positive',
                category: 'engagement',
                message: `Engagement rate excepcional del ${engagementRate}%, ${Math.round((engagementAnalysis.ratio - 1) * 100)}% por encima del promedio del sector.`,
                priority: 'high'
            });
        } else if (engagementAnalysis.quality === 'below_average') {
            insights.push({
                type: 'warning',
                category: 'engagement',
                message: `Engagement rate del ${engagementRate}% está por debajo del promedio. Considera mejorar la calidad del contenido.`,
                priority: 'medium'
            });
        }
        
        // Growth insights
        if (growthData.rate > 5) {
            insights.push({
                type: 'positive',
                category: 'growth',
                message: `Crecimiento mensual excelente del ${growthData.rate}%. Mantén la estrategia actual.`,
                priority: 'high'
            });
        } else if (growthData.rate < 0) {
            insights.push({
                type: 'warning',
                category: 'growth',
                message: `Pérdida de seguidores del ${Math.abs(growthData.rate)}%. Revisa la estrategia de contenido.`,
                priority: 'high'
            });
        }
        
        // Audience insights
        if (audienceValue.quality === 'excellent') {
            insights.push({
                type: 'positive',
                category: 'audience',
                message: 'Audiencia muy bien alineada con el nicho. Alta calidad demográfica.',
                priority: 'medium'
            });
        }
        
        // Platform balance insights
        const instagram = data.instagram?.followers || 0;
        const tiktok = data.tiktok?.followers || 0;
        const platformRatio = Math.max(instagram, tiktok) / Math.min(instagram, tiktok);
        
        if (platformRatio > 3) {
            const dominantPlatform = instagram > tiktok ? 'Instagram' : 'TikTok';
            const smallerPlatform = instagram > tiktok ? 'TikTok' : 'Instagram';
            insights.push({
                type: 'info',
                category: 'strategy',
                message: `Oportunidad de crecimiento en ${smallerPlatform}. ${dominantPlatform} domina con ${Math.round(platformRatio)}x más seguidores.`,
                priority: 'medium'
            });
        }
        
        return insights.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    calculateROI(data, campaignData = null) {
        if (!data) return { roi: 0, recommendations: [] };
        
        const earnings = this.estimateEarnings(data);
        const engagementRate = this.calculateWeightedEngagement(data);
        const totalFollowers = this.calculateTotalFollowers(data);
        
        // Base ROI calculation
        const avgEarnings = (earnings.min + earnings.max) / 2;
        const costPerThousand = (avgEarnings / totalFollowers) * 1000;
        
        // ROI metrics
        const roi = {
            costPerMille: Math.round(costPerThousand * 100) / 100,
            valueScore: this.calculateInfluencerScore(data),
            recommendedBudget: {
                min: Math.round(avgEarnings * 0.8),
                max: Math.round(avgEarnings * 1.2)
            }
        };
        
        const recommendations = [];
        
        if (engagementRate > 5) {
            recommendations.push('Alta engagement rate justifica premium pricing');
        }
        
        if (totalFollowers > 50000 && engagementRate > 3) {
            recommendations.push('Perfil ideal para campañas de awareness');
        }
        
        const niche = data.profile?.niche;
        if (niche === 'crianza-educacion-infantil') {
            recommendations.push('Nicho especializado con alta conversión para productos infantiles');
        }
        
        return { roi, recommendations };
    }
}

// Export for use in other modules
window.AnalyticsCalculator = AnalyticsCalculator;