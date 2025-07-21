class CORSProxy {
    constructor() {
        this.proxies = [
            'https://api.allorigins.win/get?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxyIndex = 0;
        this.failedProxies = new Set();
    }

    getCurrentProxy() {
        return this.proxies[this.currentProxyIndex];
    }

    switchProxy() {
        this.failedProxies.add(this.currentProxyIndex);
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        
        if (this.failedProxies.size >= this.proxies.length) {
            console.warn('⚠️ All CORS proxies have failed');
            this.failedProxies.clear(); // Reset and try again
        }
        
        console.log(`🔄 Switched to proxy: ${this.getCurrentProxy()}`);
    }

    buildProxyUrl(targetUrl) {
        const proxy = this.getCurrentProxy();
        
        if (proxy.includes('allorigins.win')) {
            return `${proxy}${encodeURIComponent(targetUrl)}`;
        } else {
            return `${proxy}${targetUrl}`;
        }
    }

    async fetch(url, options = {}) {
        const maxProxyAttempts = this.proxies.length;
        
        for (let attempt = 0; attempt < maxProxyAttempts; attempt++) {
            try {
                const proxyUrl = this.buildProxyUrl(url);
                
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        ...options.headers
                    },
                    mode: 'cors',
                    ...options
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                let data;
                if (this.getCurrentProxy().includes('allorigins.win')) {
                    const json = await response.json();
                    data = json.contents;
                } else {
                    data = await response.text();
                }

                console.log(`✅ CORS proxy request successful via ${this.getCurrentProxy()}`);
                return data;

            } catch (error) {
                console.warn(`❌ CORS proxy failed (${this.getCurrentProxy()}):`, error.message);
                
                if (attempt < maxProxyAttempts - 1) {
                    this.switchProxy();
                    await this.sleep(1000); // Wait before trying next proxy
                } else {
                    throw new Error(`All CORS proxies failed. Last error: ${error.message}`);
                }
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStatus() {
        return {
            currentProxy: this.getCurrentProxy(),
            currentIndex: this.currentProxyIndex,
            failedProxies: Array.from(this.failedProxies),
            availableProxies: this.proxies
        };
    }

    reset() {
        this.currentProxyIndex = 0;
        this.failedProxies.clear();
        console.log('🔄 CORS proxy reset to defaults');
    }
}

window.CORSProxy = CORSProxy;