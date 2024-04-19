import { Module } from '@nestjs/common';
import { CacheServiceProvider } from './providers/abstract';
import { InMemoryCacheProvider } from './providers/InMemory';

@Module({
  providers: [
    {
      provide: CacheServiceProvider,
      // FIXME: not implement for prod
      useClass: InMemoryCacheProvider,
    },
  ],
  exports: [CacheServiceProvider],
})
export class CacheServiceModule {}
