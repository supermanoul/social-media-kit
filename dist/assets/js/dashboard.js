class Dashboard {
    constructor() {
        this.dataManager = null;
        this.analytics = null;
        this.charts = {};
        this.isInitialized = false;
        this.autoUpdateInterval = null;
        this.loadingSteps = [
            'Inicializando motor de scraping...',
            'Cargando datos manuales...',
            'Configurando sistema híbrido...',
            'Preparando visualizaciones...',
            'Calculando métricas...',
            'Finalizando dashboard...'
        ];
        this.currentStep = 0;
    }

    async init() {
        try {
            console.log('🚀 Initializing Dashboard...');
            this.showLoadingStep('Inicializando sistema híbrido...');

            // Initialize analytics calculator
            this.analytics = new AnalyticsCalculator();
            this.showLoadingStep('Configurando calculadora analítica...');

            // Initialize data manager
            this.dataManager = new HybridDataManager();
            this.showLoadingStep('Inicializando gestión de datos...');

            // Wait for data manager to be ready
            await this.waitForDataManager();
            this.showLoadingStep('Preparando visualizaciones...');

            // Setup event listeners
            this.setupEventListeners();
            this.showLoadingStep('Configurando interacciones...');

            // Initial data load and render
            await this.loadAndRenderData();
            this.showLoadingStep('Cargando datos iniciales...');

            // Setup auto-update
            this.setupAutoUpdate();
            this.showLoadingStep('Configurando actualización automática...');

            this.isInitialized = true;
            console.log('✅ Dashboard initialized successfully');
            
            // Hide loading screen and show dashboard
            this.hideLoadingScreen();
            this.showNotification('Dashboard cargado exitosamente', 'success');

        } catch (error) {
            console.error('❌ Failed to initialize dashboard:', error);
            this.showLoadingError('Error al inicializar el dashboard');
            window.errorHandler?.handleUIError('dashboard', error, { phase: 'initialization' });
        }
    }

    showLoadingStep(step) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement) {
            statusElement.textContent = step;
        }
        this.currentStep++;
    }

    showLoadingError(message) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.color = '#ef5350';
        }
    }

    async waitForDataManager() {
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!this.dataManager.isInitialized() && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.dataManager.isInitialized()) {
            throw new Error('Data Manager failed to initialize');
        }
    }

    setupEventListeners() {
        // Update button
        const updateBtn = document.getElementById('updateBtn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.handleUpdate());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareData());
        }

        // Data manager callbacks
        if (this.dataManager) {
            this.dataManager.onUpdate((event, data) => {
                this.handleDataUpdate(event, data);
            });
        }

        // Window resize for chart responsiveness
        window.addEventListener('resize', () => {
            this.debounce(() => this.resizeCharts(), 300)();
        });
    }

    async loadAndRenderData() {
        try {
            const data = this.dataManager.getData();
            const metrics = this.dataManager.getMetrics();
            
            if (!data || !metrics) {
                throw new Error('No data available to render');
            }

            // Render all sections
            this.renderProfile(data);
            this.renderMainMetrics(metrics);
            this.renderCharts(data, metrics);
            this.renderTopContent(metrics.topContent || []);
            this.renderAnalytics(data);
            this.renderPricing(data.pricing || {});
            this.renderCollaborations(data.brandCollaborations || []);
            this.renderAchievements(data.achievements || []);
            this.renderFooter(data);

            console.log('✅ Dashboard rendered successfully');

        } catch (error) {
            console.error('❌ Failed to render dashboard:', error);
            this.showNotification('Error al cargar los datos', 'error');
            window.errorHandler?.handleUIError('dashboard', error, { phase: 'rendering' });
        }
    }

    renderProfile(data) {
        const profile = data.profile || {};
        
        // Profile image
        const profileImage = document.getElementById('profileImage');
        if (profileImage && profile.profileImage) {
            profileImage.src = profile.profileImage;
            profileImage.alt = profile.name || 'Profile';
        }

        // Profile name
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = profile.name || 'Nombre no disponible';
        }

        // Profile bio
        const profileBio = document.getElementById('profileBio');
        if (profileBio) {
            profileBio.textContent = profile.bio || 'Bio no disponible';
        }

        // Social handles
        const instagramHandle = document.getElementById('instagramHandle');
        if (instagramHandle) {
            instagramHandle.textContent = `@${data.instagram?.handle || 'handle'}`;
        }

        const tiktokHandle = document.getElementById('tiktokHandle');
        if (tiktokHandle) {
            tiktokHandle.textContent = `@${data.tiktok?.handle || 'handle'}`;
        }

        // Verified badges
        const verifiedBadge = document.getElementById('verifiedBadge');
        if (verifiedBadge) {
            const isVerified = data.instagram?.verified || data.tiktok?.verified;
            verifiedBadge.style.display = isVerified ? 'flex' : 'none';
        }
    }

    renderMainMetrics(metrics) {
        // Total followers
        const totalFollowers = document.getElementById('totalFollowers');
        if (totalFollowers) {
            totalFollowers.textContent = this.formatNumber(metrics.totalFollowers);
            this.animateNumber(totalFollowers, metrics.totalFollowers);
        }

        // Engagement rate
        const engagementRate = document.getElementById('engagementRate');
        if (engagementRate) {
            engagementRate.textContent = `${metrics.totalEngagement.toFixed(1)}%`;
        }

        // Monthly reach
        const monthlyReach = document.getElementById('monthlyReach');
        if (monthlyReach) {
            monthlyReach.textContent = this.formatNumber(metrics.growth?.monthlyReach || 0);
        }

        // Average views
        const avgViews = document.getElementById('avgViews');
        if (avgViews) {
            avgViews.textContent = this.formatNumber(this.analytics.calculateAverageViews(this.dataManager.getData()));
        }

        // Growth indicators
        this.updateGrowthIndicators(metrics);
    }

    updateGrowthIndicators(metrics) {
        const growth = metrics.growth || {};
        
        const totalFollowersChange = document.getElementById('totalFollowersChange');
        if (totalFollowersChange) {
            const rate = growth.monthlyGrowthRate || 0;
            totalFollowersChange.textContent = `${rate > 0 ? '+' : ''}${rate}%`;
            totalFollowersChange.className = `metric-change ${rate > 0 ? '' : rate < 0 ? 'negative' : 'neutral'}`;
        }
    }

    renderCharts(data, metrics) {
        // Growth Chart
        this.createGrowthChart(data);
        
        // Platform Distribution Chart
        this.createPlatformChart(metrics);
        
        // Engagement Breakdown Chart
        this.createEngagementChart(data);
    }

    createGrowthChart(data) {
        const ctx = document.getElementById('growthChart');
        if (!ctx) return;

        // Prepare data from both platforms
        const instagramGrowth = data.instagram?.monthlyGrowth || [];
        const tiktokGrowth = data.tiktok?.monthlyGrowth || [];
        
        const labels = instagramGrowth.map(item => item.month);
        
        if (this.charts.growth) {
            this.charts.growth.destroy();
        }

        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Instagram',
                        data: instagramGrowth.map(item => item.followers),
                        borderColor: '#E4405F',
                        backgroundColor: 'rgba(228, 64, 95, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'TikTok',
                        data: tiktokGrowth.map(item => item.followers),
                        borderColor: '#000000',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2c3e50',
                        bodyColor: '#7f8c8d',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: value => this.formatNumber(value),
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createPlatformChart(metrics) {
        const ctx = document.getElementById('platformChart');
        if (!ctx) return;

        if (this.charts.platform) {
            this.charts.platform.destroy();
        }

        const instagramFollowers = metrics.platforms.instagram.followers;
        const tiktokFollowers = metrics.platforms.tiktok.followers;

        this.charts.platform = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Instagram', 'TikTok'],
                datasets: [{
                    data: [instagramFollowers, tiktokFollowers],
                    backgroundColor: [
                        '#E4405F',
                        '#000000'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2c3e50',
                        bodyColor: '#7f8c8d',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const percentage = ((context.parsed / metrics.totalFollowers) * 100).toFixed(1);
                                return `${context.label}: ${this.formatNumber(context.parsed)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        });
    }

    createEngagementChart(data) {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;

        if (this.charts.engagement) {
            this.charts.engagement.destroy();
        }

        // Sample engagement data by content type
        const contentTypes = [
            { type: 'Tips prácticos', engagement: 8.9, color: '#ff6b6b' },
            { type: 'Videos cortos', engagement: 9.2, color: '#4ecdc4' },
            { type: 'Testimonios', engagement: 7.6, color: '#45b7d1' },
            { type: 'Infografías', engagement: 6.8, color: '#ffa726' },
            { type: 'Carousels', engagement: 7.4, color: '#66bb6a' }
        ];

        this.charts.engagement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: contentTypes.map(item => item.type),
                datasets: [{
                    label: 'Engagement Rate (%)',
                    data: contentTypes.map(item => item.engagement),
                    backgroundColor: contentTypes.map(item => item.color + '40'),
                    borderColor: contentTypes.map(item => item.color),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2c3e50',
                        bodyColor: '#7f8c8d',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `${context.parsed.y}% engagement`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: value => `${value}%`,
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { 
                            font: { size: 11 },
                            maxRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    renderTopContent(topContent) {
        const container = document.getElementById('topContentGrid');
        if (!container) return;

        container.innerHTML = '';

        topContent.slice(0, 5).forEach(item => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'content-item';
            
            contentDiv.innerHTML = `
                <div class="content-header">
                    <span class="platform-badge ${item.platform}">${item.platform}</span>
                    <span class="content-date">${this.formatDate(item.date)}</span>
                </div>
                <h4 class="content-title">${item.title}</h4>
                <div class="content-stats">
                    <div class="stat-item">
                        <span>❤️</span>
                        <span class="stat-value">${this.formatNumber(item.likes || 0)}</span>
                    </div>
                    <div class="stat-item">
                        <span>💬</span>
                        <span class="stat-value">${this.formatNumber(item.comments || 0)}</span>
                    </div>
                    ${item.views ? `
                        <div class="stat-item">
                            <span>👁️</span>
                            <span class="stat-value">${this.formatNumber(item.views)}</span>
                        </div>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(contentDiv);
        });
    }

    renderAnalytics(data) {
        // Best Times
        this.renderBestTimes(data.instagram?.bestTimes || []);
        
        // Top Hashtags
        this.renderTopHashtags(data.instagram?.topHashtags || []);
        
        // Top Locations
        this.renderTopLocations(data.audience?.demographics?.locations || {});
    }

    renderBestTimes(bestTimes) {
        const container = document.getElementById('bestTimes');
        if (!container) return;

        container.innerHTML = bestTimes.map(time => 
            `<div class="time-slot">${time}</div>`
        ).join('');
    }

    renderTopHashtags(hashtags) {
        const container = document.getElementById('topHashtags');
        if (!container) return;

        container.innerHTML = hashtags.slice(0, 5).map(hashtag => `
            <div class="hashtag-item">
                <span class="hashtag-tag">${hashtag.tag}</span>
                <span class="hashtag-performance">${hashtag.performance}</span>
            </div>
        `).join('');
    }

    renderTopLocations(locations) {
        const container = document.getElementById('topLocations');
        if (!container) return;

        const locationEntries = Object.entries(locations)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        container.innerHTML = locationEntries.map(([country, percentage]) => `
            <div class="location-item">
                <span class="location-country">${country}</span>
                <span class="location-percentage">${percentage}%</span>
            </div>
        `).join('');
    }

    renderPricing(pricing) {
        // Pricing is already handled in HTML
        console.log('Pricing rendered from static data');
    }

    renderCollaborations(collaborations) {
        const container = document.getElementById('brandCollaborations');
        if (!container) return;

        container.innerHTML = collaborations.map(collab => `
            <div class="collaboration-item">
                <div class="collaboration-info">
                    <h5>${collab.brand}</h5>
                    <span class="collaboration-type">${collab.type} - ${collab.duration}</span>
                </div>
                <span class="collaboration-status ${collab.status.toLowerCase()}">${collab.status}</span>
            </div>
        `).join('');
    }

    renderAchievements(achievements) {
        const container = document.getElementById('achievementsList');
        if (!container) return;

        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <h5>${achievement.title}</h5>
                    <span class="achievement-source">${achievement.source}</span>
                </div>
            </div>
        `).join('');
    }

    renderFooter(data) {
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            const updateTime = this.dataManager.getLastUpdated();
            lastUpdated.textContent = updateTime ? this.formatDate(updateTime) : 'Nunca';
        }
    }

    async handleUpdate() {
        const updateBtn = document.getElementById('updateBtn');
        if (!updateBtn) return;

        try {
            // Update button state
            updateBtn.classList.add('updating');
            updateBtn.disabled = true;
            updateBtn.querySelector('.update-text').textContent = 'Actualizando...';

            // Update status indicator
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.classList.remove('active', 'error');
                statusIndicator.classList.add('updating');
            }

            this.showNotification('Iniciando actualización de datos...', 'info');

            // Trigger data update
            const success = await this.dataManager.updateWithLiveData();

            if (success) {
                // Reload and render updated data
                await this.loadAndRenderData();
                this.showNotification('Datos actualizados correctamente', 'success');
                
                if (statusIndicator) {
                    statusIndicator.classList.remove('updating', 'error');
                    statusIndicator.classList.add('active');
                }
            } else {
                throw new Error('Update failed');
            }

        } catch (error) {
            console.error('Update failed:', error);
            this.showNotification('Error al actualizar datos. Usando datos de respaldo.', 'warning');
            
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.classList.remove('updating', 'active');
                statusIndicator.classList.add('error');
            }
        } finally {
            // Reset button state
            if (updateBtn) {
                updateBtn.classList.remove('updating');
                updateBtn.disabled = false;
                updateBtn.querySelector('.update-text').textContent = 'Actualizar';
            }
        }
    }

    handleDataUpdate(event, data) {
        switch (event) {
            case 'update_started':
                this.showNotification('Actualizando datos...', 'info');
                break;
            case 'update_completed':
                this.loadAndRenderData();
                break;
            case 'update_failed':
                this.showNotification('Error en actualización automática', 'warning');
                break;
        }
    }

    setupAutoUpdate() {
        // Update every hour
        this.autoUpdateInterval = setInterval(() => {
            console.log('🔄 Auto-updating data...');
            this.dataManager.updateWithLiveData();
        }, 60 * 60 * 1000);
    }

    exportData() {
        try {
            const exportData = this.dataManager.exportData();
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Create and download file
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `samantha-social-kit-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Datos exportados correctamente', 'success');
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Error al exportar datos', 'error');
        }
    }

    shareData() {
        if (navigator.share) {
            navigator.share({
                title: 'Social Media Kit - Samantha Crianza',
                text: 'Kit de medios sociales profesional para colaboraciones',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Remove on click
        notification.addEventListener('click', () => {
            notification.remove();
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loadingScreen && dashboard) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                dashboard.style.display = 'block';
                dashboard.style.opacity = '0';
                setTimeout(() => {
                    dashboard.style.opacity = '1';
                }, 50);
            }, 300);
        }
    }

    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Utility methods
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    }

    animateNumber(element, targetValue, duration = 1500) {
        const startValue = 0;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = this.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    destroy() {
        // Cleanup
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        this.isInitialized = false;
        
        console.log('🧹 Dashboard destroyed');
    }
}

// Export for use in other modules
window.Dashboard = Dashboard;