import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';

export interface CacheService<Data> {
  get(key: string): Promise<Data | null>;
  set(key: string, data: Data): Promise<void>;
  del(key: string): Promise<void>;
}

@Injectable()
export abstract class CacheServiceProvider {
  abstract getCacheService<Data>(
    topic: string,
    ttlInMs?: number,
  ): CacheService<Data>;

  cachedAxiosGetClient<A extends AxiosInstance>(
    axiosInstance: A,
  ): Pick<A, 'get'> {
    const cacheService = this.getCacheService(axiosInstance.defaults.baseURL);

    const encodeCacheKey = (url: string, params: any) =>
      Object.keys(params ?? {})
        .sort()
        .reduce(
          (appended, paramKey) =>
            `${appended}/param:${paramKey}:${params[paramKey]}`,
          `url:${url}`,
        );

    return {
      get: async (url, config) => {
        const cacheKey = encodeCacheKey(url, config.params);
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        return axiosInstance.get(url, config);
      },
    } as Pick<A, 'get'>;
  }
}
