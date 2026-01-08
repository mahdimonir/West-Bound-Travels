import Redis from 'ioredis';
import logger from '../utils/logger.js';

// Check if Redis is configured
const isRedisConfigured = process.env.REDIS_HOST && process.env.REDIS_PORT;

let redis: Redis | null = null;

// Only create Redis client if configured
if (isRedisConfigured) {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  // Handle connection events
  redis.on('connect', () => {
    logger.info('✅ Redis client connected');
  });

  redis.on('error', (err) => {
    logger.error(`❌ Redis client error: ${err.message}`);
  });

  redis.on('ready', () => {
    logger.info('✅ Redis client ready - Caching enabled');
  });
} else {
  logger.warn('⚠️  Redis not configured - Running without cache (performance will be slower)');
  logger.warn('⚠️  To enable caching, add REDIS_HOST and REDIS_PORT to .env');
}

// Helper functions with graceful degradation
export const cacheHelpers = {
  /**
   * Get cached data (returns null if Redis not configured)
   */
  async get(key: string) {
    if (!redis) return null;
    
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis get error: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  },

  /**
   * Set cached data with expiration (no-op if Redis not configured)
   */
  async set(key: string, value: any, expirationSeconds: number) {
    if (!redis) return false;
    
    try {
      await redis.setex(key, expirationSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Redis set error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Delete cached data (no-op if Redis not configured)
   */
  async del(key: string | string[]) {
    if (!redis) return false;
    
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) {
          await redis.del(...key);
        }
      } else {
        await redis.del(key);
      }
      return true;
    } catch (error) {
      logger.error(`Redis del error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Delete all keys matching pattern (no-op if Redis not configured)
   */
  async delPattern(pattern: string) {
    if (!redis) return false;
    
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error(`Redis delPattern error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },

  /**
   * Check if key exists (returns false if Redis not configured)
   */
  async exists(key: string) {
    if (!redis) return false;
    
    try {
      return (await redis.exists(key)) === 1;
    } catch (error) {
      logger.error(`Redis exists error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  },
};

export default redis;
