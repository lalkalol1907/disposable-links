import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envValidation from './validation/envValidation';
import { UrlShortenerModule } from './module/urlShortener.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envValidation,
    }),
    UrlShortenerModule,
  ],
})
export class AppModule {}
