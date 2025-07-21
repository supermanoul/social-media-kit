class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.callbacks = [];
        this.init();
    }

    init() {
        // Global error handling
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });

        // Promise rejection handling
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise_rejection',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                reason: event.reason,
                timestamp: new Date().toISOString()
            });
        });

        console.log('🛡️ Error Handler initialized');
    }

    handleError(error) {
        // Add to error log
        this.errors.unshift({
            id: this.generateId(),
            ...error
        });

        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }

        // Log to console
        this.logError(error);

        // Notify callbacks
        this.notifyCallbacks('error', error);

        // Store in localStorage for persistence
        this.persistErrors();
    }

    logError(error) {
        const prefix = this.getErrorPrefix(error.type);
        console.error(`${prefix} ${error.message}`, error);
    }

    getErrorPrefix(type) {
        const prefixes = {
            javascript: '🔴 JS Error:',
            promise_rejection: '🟠 Promise Error:',
            network: '🌐 Network Error:',
            scraping: '🕷️ Scraping Error:',
            data: '📊 Data Error:',
            ui: '🖥️ UI Error:',
            generic: '⚠️ Error:'
        };
        
        return prefixes[type] || prefixes.generic;
    }

    // Specific error handling methods
    handleScrapingError(platform, error, context = {}) {
        this.handleError({
            type: 'scraping',
            platform,
            message: error.message || 'Scraping failed',
            context,
            originalError: error,
            timestamp: new Date().toISOString()
        });
    }

    handleNetworkError(url, error, context = {}) {
        this.handleError({
            type: 'network',
            url,
            message: error.message || 'Network request failed',
            status: error.status || 'unknown',
            context,
            timestamp: new Date().toISOString()
        });
    }

    handleDataError(operation, error, context = {}) {
        this.handleError({
            type: 'data',
            operation,
            message: error.message || 'Data operation failed',
            context,
            timestamp: new Date().toISOString()
        });
    }

    handleUIError(component, error, context = {}) {
        this.handleError({
            type: 'ui',
            component,
            message: error.message || 'UI component error',
            context,
            timestamp: new Date().toISOString()
        });
    }

    // Error recovery methods
    async attemptRecovery(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (!error) {
            console.warn('Error not found for recovery:', errorId);
            return false;
        }

        console.log('🔧 Attempting error recovery for:', error.type);

        try {
            switch (error.type) {
                case 'scraping':
                    return await this.recoverScraping(error);
                case 'network':
                    return await this.recoverNetwork(error);
                case 'data':
                    return await this.recoverData(error);
                default:
                    console.log('No specific recovery method for error type:', error.type);
                    return false;
            }
        } catch (recoveryError) {
            console.error('Recovery attempt failed:', recoveryError);
            return false;
        }
    }

    async recoverScraping(error) {
        if (window.dataManager) {
            console.log('🔄 Attempting to use fallback data for scraping error');
            // Trigger fallback to manual data
            return true;
        }
        return false;
    }

    async recoverNetwork(error) {
        console.log('🔄 Attempting network recovery');
        // Could implement retry logic here
        return false;
    }

    async recoverData(error) {
        console.log('🔄 Attempting data recovery');
        // Could implement data refresh here
        return false;
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getErrors(type = null, limit = 10) {
        let filteredErrors = type ? 
            this.errors.filter(e => e.type === type) : 
            this.errors;
        
        return filteredErrors.slice(0, limit);
    }

    getErrorStats() {
        const stats = {};
        
        this.errors.forEach(error => {
            stats[error.type] = (stats[error.type] || 0) + 1;
        });

        return {
            total: this.errors.length,
            byType: stats,
            lastError: this.errors[0]?.timestamp || null
        };
    }

    clearErrors() {
        this.errors = [];
        localStorage.removeItem('socialKit_errors');
        console.log('🧹 Error log cleared');
        this.notifyCallbacks('cleared');
    }

    // Persistence
    persistErrors() {
        try {
            const recentErrors = this.errors.slice(0, 20); // Keep only 20 most recent
            localStorage.setItem('socialKit_errors', JSON.stringify(recentErrors));
        } catch (error) {
            console.warn('Could not persist errors to localStorage:', error);
        }
    }

    loadPersistedErrors() {
        try {
            const stored = localStorage.getItem('socialKit_errors');
            if (stored) {
                this.errors = JSON.parse(stored);
                console.log(`📚 Loaded ${this.errors.length} persisted errors`);
            }
        } catch (error) {
            console.warn('Could not load persisted errors:', error);
        }
    }

    // Callback system
    onError(callback) {
        this.callbacks.push(callback);
    }

    notifyCallbacks(event, data = null) {
        this.callbacks.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in error handler callback:', error);
            }
        });
    }

    // User-friendly error messages
    getUserFriendlyMessage(error) {
        const messages = {
            scraping: {
                instagram: 'No se pudo obtener datos de Instagram. Usando datos manuales.',
                tiktok: 'No se pudo obtener datos de TikTok. Usando datos manuales.',
                general: 'Problema al obtener datos de redes sociales. Usando datos respaldo.'
            },
            network: 'Problema de conexión a internet. Algunos datos pueden no estar actualizados.',
            data: 'Error procesando los datos. Algunos elementos pueden no mostrarse correctamente.',
            ui: 'Error en la interfaz. Intenta recargar la página.',
            generic: 'Ha ocurrido un error. El sistema continúa funcionando con datos de respaldo.'
        };

        const typeMessages = messages[error.type];
        if (typeMessages) {
            return typeMessages[error.platform] || typeMessages.general || typeMessages;
        }

        return messages.generic;
    }

    // Show user notification
    showUserNotification(error) {
        const message = this.getUserFriendlyMessage(error);
        
        // Try to show in UI if available
        if (window.dashboard && window.dashboard.showNotification) {
            window.dashboard.showNotification(message, 'warning');
        } else {
            // Fallback to console
            console.warn('ℹ️ User Notification:', message);
        }
    }
}

// Create global instance
window.errorHandler = new ErrorHandler();
window.ErrorHandler = ErrorHandler;