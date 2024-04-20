import { InMemoryCacheProvider } from './InMemory';
import { CacheServiceProvider } from './abstract';
import { AxiosInstance } from 'axios';

const cache: CacheServiceProvider = new InMemoryCacheProvider();

describe('MemoryCacheProvider', () => {
  describe('getCacheService', () => {
    it('should get / set / del', async () => {
      const fooCache = cache.getCacheService<string>('FOO');
      const barCache = cache.getCacheService<string>('BAR');

      {
        const cached = await fooCache.get('keyOne');
        expect(cached).toStrictEqual(null);
      }

      await fooCache.set('keyOne', 'valueOne');

      {
        const cached = await fooCache.get('keyOne');
        expect(cached).toStrictEqual('valueOne');

        const shouldNotBeCached = await barCache.get('keyOne');
        expect(shouldNotBeCached).toStrictEqual(null);
      }

      await fooCache.set('keyOne', 'newValueOne');

      {
        const cached = await fooCache.get('keyOne');
        expect(cached).toStrictEqual('newValueOne');
      }
      {
        const cached = await fooCache.get('keyTwo');
        expect(cached).toStrictEqual(null);
      }

      await fooCache.del('keyOne');
      {
        const cached = await fooCache.get('keyOne');
        expect(cached).toStrictEqual(null);
      }
    });

    it('cache should expires accordingly based on configured ttl', async () => {
      // purposely using negative value, apparently the code checking the "expected expired" within same ms
      const shortLive = cache.getCacheService<string>('SHORT_LIVE', -1);
      const longLive = cache.getCacheService<string>('LONG_LIVE', 100_000);

      await shortLive.set('key', 'value');
      await longLive.set('key', 'value');

      const expired = await shortLive.get('key');
      expect(expired).toStrictEqual(null);

      const cached = await longLive.get('key');
      expect(cached).toStrictEqual('value');
    });
  });

  describe('cachedAxiosGetClient', () => {
    it('should cache query response by base URL + URL + all query parameters', async () => {
      const mock = {
        defaults: {
          baseURL: 'baseURLOne',
        },
        get: async (
          url: string,
          { params }: { params: Record<'a' | 'b', string> },
        ) => {
          return {
            data: [url, params.a, params.b, Date.now()].join(','),
          };
        },
      } as any as AxiosInstance;

      const cachedMock = cache.cachedAxiosGetClient(mock);

      const first = await cachedMock.get('urlOne', {
        params: {
          a: 'aFilter',
          b: 'bFilter',
        },
      });

      const cached = await cachedMock.get('urlOne', {
        params: {
          a: 'aFilter',
          b: 'bFilter',
        },
      });
      expect(cached.data).toStrictEqual(first.data);

      const diffUrl = await cachedMock.get('urlTwo', {
        params: {
          a: 'aFilter',
          b: 'bFilter',
        },
      });
      expect(diffUrl.data).not.toStrictEqual(first.data);

      const diffFilterA = await cachedMock.get('urlOne', {
        params: {
          a: 'newAFilter',
          b: 'bFilter',
        },
      });
      expect(diffFilterA.data).not.toStrictEqual(first.data);

      const diffFilterB = await cachedMock.get('urlOne', {
        params: {
          a: 'aFilter',
          b: 'newBFilter',
        },
      });
      expect(diffFilterB.data).not.toStrictEqual(first.data);

      mock.defaults.baseURL = `changedUrl+${Math.floor(Math.random() * 1e6)}`;
      const differentUrl = cache.cachedAxiosGetClient(mock);

      const shouldNotBeCached = await differentUrl.get('urlOne', {
        params: {
          a: 'aFilter',
          b: 'bFilter',
        },
      });
      expect(shouldNotBeCached.data).not.toStrictEqual(first.data);
    });
  });
});
