import { NextFunction, Request, Response } from 'express';
import { cacheHelpers } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Cache middleware for GET requests
 * @param duration Cache duration in seconds
 */
export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      // Try to get cached data
      const cachedData = await cacheHelpers.get(key);
      
      if (cachedData) {
        logger.info(`Cache HIT: ${key}`);
        return res.json(cachedData);
      }

      logger.info(`Cache MISS: ${key}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data: any) {
        // Cache the response
        cacheHelpers.set(key, data, duration).catch((err) => {
          logger.error('Failed to cache response:', err);
        });

        // Send the response
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error(`Cache middleware error: ${error instanceof Error ? error.message : String(error)}`);
      // Continue without cache on error
      next();
    }
  };
};

/**
 * Invalidate cache by pattern
 */
export const invalidateCache = async (pattern: string) => {
  try {
    await cacheHelpers.delPattern(pattern);
    logger.info(`Cache invalidated: ${pattern}`);
  } catch (error) {
    logger.error(`Cache invalidation error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Cache keys for different resources
 */
export const CACHE_KEYS = {
  boats: {
    all: 'cache:/api/v1/boats*',
    single: (id: string) => `cache:/api/v1/boats/${id}*`,
  },
  gallery: {
    all: 'cache:/api/v1/gallery*',
  },
  blogs: {
    all: 'cache:/api/v1/blogs*',
    single: (slug: string) => `cache:/api/v1/blogs/${slug}*`,
  },
  destinations: {
    all: 'cache:/api/v1/destinations*',
  },
};

/**
 * Cache durations in seconds
 */
export const CACHE_DURATION = {
  boats: 30 * 60, // 30 minutes
  gallery: 60 * 60, // 1 hour
  blogs: 15 * 60, // 15 minutes
  destinations: 60 * 60, // 1 hour
  availability: 60, // 1 minute
  settings: 60 * 60, // 1 hour
};
