import config from "../../config/index.js";

/**
 * Abstract Base Cache Provider Interface (ICacheProvider - ARCH-06)
 */
export class ICacheProvider {
    get(key) { throw new Error("Method 'get()' must be implemented."); }
    set(key, data, ttlMs) { throw new Error("Method 'set()' must be implemented."); }
    delete(key) { throw new Error("Method 'delete()' must be implemented."); }
    clearPattern(pattern) { throw new Error("Method 'clearPattern()' must be implemented."); }
    clearProducts() { throw new Error("Method 'clearProducts()' must be implemented."); }
}

/**
 * In-Memory Cache Provider implementation for single-node development & testing.
 */
export class MemoryCacheProvider extends ICacheProvider {
    constructor(maxSize = 2000) {
        super();
        this.cache = new Map();
        this.defaultTtl = 60 * 1000; // 60 seconds
        this.maxSize = maxSize;
    }

    purgeExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
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
        // Enforce 30-day memory bounds via LRU eviction & expired sweeps
        if (this.cache.size >= this.maxSize) {
            this.purgeExpired();
            if (this.cache.size >= this.maxSize) {
                const oldestKey = this.cache.keys().next().value;
                if (oldestKey) this.cache.delete(oldestKey);
            }
        }
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

/**
 * Redis Cache Provider for production multi-node horizontal scaling.
 * Pluggable with automatic in-memory fallback if Redis is unavailable.
 */
export class RedisCacheProvider extends ICacheProvider {
    constructor(options = {}) {
        super();
        this.fallback = new MemoryCacheProvider();
        this.redisClient = options.redisClient || null;
        this.defaultTtlSec = 60;
    }

    async get(key) {
        if (!this.redisClient || !this.redisClient.isOpen) {
            return this.fallback.get(key);
        }
        try {
            const raw = await this.redisClient.get(key);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return this.fallback.get(key);
        }
    }

    async set(key, data, ttlMs = 60000) {
        if (!this.redisClient || !this.redisClient.isOpen) {
            return this.fallback.set(key, data, ttlMs);
        }
        try {
            const ttlSec = Math.ceil(ttlMs / 1000);
            await this.redisClient.set(key, JSON.stringify(data), { EX: ttlSec });
        } catch (err) {
            this.fallback.set(key, data, ttlMs);
        }
    }

    async delete(key) {
        if (!this.redisClient || !this.redisClient.isOpen) {
            return this.fallback.delete(key);
        }
        try {
            await this.redisClient.del(key);
        } catch (err) {
            this.fallback.delete(key);
        }
    }

    async clearPattern(pattern) {
        this.fallback.clearPattern(pattern);
        if (this.redisClient && this.redisClient.isOpen) {
            try {
                const keys = await this.redisClient.keys(`*${pattern}*`);
                if (keys.length > 0) await this.redisClient.del(keys);
            } catch (err) {
                // Handled gracefully via fallback
            }
        }
    }

    async clearProducts() {
        await this.clearPattern("products:");
        await this.clearPattern("slug:");
        await this.clearPattern("tags:");
    }
}

// Factory function to create cache provider based on configuration
export function createCacheProvider(type = "memory", options = {}) {
    if (type === "redis") {
        return new RedisCacheProvider(options);
    }
    return new MemoryCacheProvider();
}

export const cache = createCacheProvider("memory");
export default cache;
