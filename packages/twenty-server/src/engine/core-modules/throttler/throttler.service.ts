import { Injectable } from '@nestjs/common';

import {
  ThrottlerException,
  ThrottlerExceptionCode,
} from 'src/engine/core-modules/throttler/throttler.exception';
import { CacheStorageService } from 'src/engine/integrations/cache-storage/cache-storage.service';
import { InjectCacheStorage } from 'src/engine/integrations/cache-storage/decorators/cache-storage.decorator';
import { CacheStorageNamespace } from 'src/engine/integrations/cache-storage/types/cache-storage-namespace.enum';

@Injectable()
export class ThrottlerService {
  constructor(
    @InjectCacheStorage(CacheStorageNamespace.EngineWorkspace)
    private readonly cacheStorage: CacheStorageService,
  ) {}

  async throttle(key: string, limit: number, ttl: number): Promise<void> {
    const currentCount = (await this.cacheStorage.get<number>(key)) ?? 0;

    if (currentCount && currentCount >= limit) {
      throw new ThrottlerException(
        'Too many requests',
        ThrottlerExceptionCode.TOO_MANY_REQUESTS,
      );
    }

    if (currentCount) {
      await this.cacheStorage.set(key, currentCount + 1, ttl);
    } else {
      await this.cacheStorage.set(key, 1, ttl);
    }
  }
}
