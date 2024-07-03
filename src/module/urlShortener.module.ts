import { Module } from '@nestjs/common';
import { UrlShortenerController } from '../controller/urlShortener/urlShortener.controller';
import { UrlShortenerService } from '../service/urlShortener.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
