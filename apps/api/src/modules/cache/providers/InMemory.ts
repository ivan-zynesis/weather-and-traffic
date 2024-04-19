import { CacheService, CacheServiceProvider } from './abstract';
import { Injectable } from '@nestjs/common';

/**
 * Naive implementation for test case use purpose only.
 * Should implement a persistent (shareable) cache service provider before go prod
 */
export class InMemoryCache<Data> implements CacheService<Data> {
  private readonly cached: Record<string, Data>;
  private readonly cacheWriteTime: Record<string, number>;

  constructor(private readonly ttlInMs: number) {
    this.cached = {};
    this.cacheWriteTime = {};
  }

  async del(key: string): Promise<void> {
    delete this.cached[key];
  }

  async get(key: string): Promise<Data | null> {
    const cachedValue = this.cached[key];
    if (!cachedValue) {
      return null;
    }

    const expiry = (this.cacheWriteTime[key] ?? 0) + this.ttlInMs;
    if (Date.now() > expiry) {
      return null;
    }

    return cachedValue;
  }

  async set(key: string, data: Data): Promise<void> {
    this.cached[key] = data;
    this.cacheWriteTime[key] = Date.now();
  }
}

const inMemoryCaches: Record<string, InMemoryCache<any>> = {};

@Injectable()
export class InMemoryCacheProvider extends CacheServiceProvider {
  getCacheService<Data>(
    topic: string,
    ttlInMs = 600_000 /* default 10 minutes */,
  ): InMemoryCache<Data> {
    if (!inMemoryCaches[topic]) {
      // ttl cannot be changed within one setup for same topic
      inMemoryCaches[topic] = new InMemoryCache(ttlInMs);
    }
    return inMemoryCaches[topic];
  }
}
