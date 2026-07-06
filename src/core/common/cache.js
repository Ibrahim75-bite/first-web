class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.defaultTtl = 60 * 1000; // 60 seconds
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key, data, ttlMs = this.defaultTtl) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs
        });
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clearPattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    clearProducts() {
        for (const key of this.cache.keys()) {
            if (
                key.startsWith("products:") || 
                key.startsWith("slug:") || 
                key.startsWith("tags:")
            ) {
                this.cache.delete(key);
            }
        }
    }
}

export const cache = new MemoryCache();
export default cache;
