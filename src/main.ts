import { NestFactory } from '@nestjs/core';
import { UrlShortenerModule } from './url_shortener/urlShortener.module';

async function bootstrap() {
  const app = await NestFactory.create(UrlShortenerModule);
  await app.listen(3000);
}
bootstrap();
