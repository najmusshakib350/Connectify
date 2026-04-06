import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
  type ThrottlerModuleOptions,
  type ThrottlerStorage,
  getOptionsToken,
  getStorageToken,
} from '@nestjs/throttler';

/**
 * Registers ThrottlerModule and the global ThrottlerGuard.
 * ThrottlerGuard is provided via useFactory with explicit inject tokens so Reflector
 * resolves reliably (useClass APP_GUARD + Reflector in feature modules fails in Nest 11).
 */
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
      },
    ]),
  ],
  providers: [
    {
      provide: Reflector,
      useFactory: () => new Reflector(),
    },
    {
      provide: APP_GUARD,
      useFactory: (
        options: ThrottlerModuleOptions,
        storage: ThrottlerStorage,
        reflector: Reflector,
      ) => new ThrottlerGuard(options, storage, reflector),
      inject: [getOptionsToken(), getStorageToken(), Reflector],
    },
  ],
  exports: [Reflector],
})
export class ThrottlerSetupModule {}
