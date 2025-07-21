class RateLimiter {
    constructor(options = {}) {
        this.requests = new Map();
        this.defaultDelay = options.defaultDelay || 1000;
        this.maxRetries = options.maxRetries || 3;
        this.backoffMultiplier = options.backoffMultiplier || 2;
    }

    async limit(key, customDelay = null) {
        const delay = customDelay || this.defaultDelay;
        const now = Date.now();
        const lastRequest = this.requests.get(key) || 0;
        const timeSinceLastRequest = now - lastRequest;

        if (timeSinceLastRequest < delay) {
            const waitTime = delay - timeSinceLastRequest;
            console.log(`⏳ Rate limiting ${key}: waiting ${waitTime}ms`);
            await this.sleep(waitTime);
        }

        this.requests.set(key, Date.now());
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async withRetry(fn, key, retries = this.maxRetries) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.limit(key);
                return await fn();
            } catch (error) {
                console.warn(`Attempt ${attempt} failed for ${key}:`, error.message);
                
                if (attempt === retries) {
                    throw error;
                }

                const backoffDelay = this.defaultDelay * Math.pow(this.backoffMultiplier, attempt - 1);
                await this.sleep(backoffDelay);
            }
        }
    }

    getStatus() {
        return {
            tracked: Array.from(this.requests.entries()).map(([key, lastRequest]) => ({
                key,
                lastRequest: new Date(lastRequest).toISOString(),
                timeSinceLastRequest: Date.now() - lastRequest
            }))
        };
    }

    clear() {
        this.requests.clear();
        console.log('🧹 Rate limiter cleared');
    }
}

window.RateLimiter = RateLimiter;