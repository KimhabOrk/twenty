import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '@nestjs/common/cache/cache.module-definition';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import {
  TwentyORMModuleAsyncOptions,
  TwentyORMOptions,
} from 'src/engine/twenty-orm/interfaces/twenty-orm-options.interface';

import { createTwemtyORMProviders } from 'src/engine/twenty-orm/twenty-orm.providers';
import { TwentyORMCoreModule } from 'src/engine/twenty-orm/twenty-orm-core.module';

@Global()
@Module({})
export class TwentyORMModule extends ConfigurableModuleClass {
  static register(options: TwentyORMOptions): DynamicModule {
    return {
      module: TwentyORMModule,
      imports: [TwentyORMCoreModule.register(options)],
    };
  }

  static forFeature(objects: EntityClassOrSchema[] = []): DynamicModule {
    const providers = createTwemtyORMProviders(objects);

    return {
      module: TwentyORMModule,
      providers: providers,
      exports: providers,
    };
  }

  static registerAsync(
    asyncOptions: TwentyORMModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: TwentyORMModule,
      imports: [TwentyORMCoreModule.registerAsync(asyncOptions)],
    };
  }
}
