import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';

@Injectable()
export class UrlShortenerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private generateRandomString = () => v4().replaceAll('-', '');

  async getOriginalUrl(shortenUrl: string): Promise<string> {
    console.log(await this.cacheManager.store.keys());
    const originalUrl = await this.cacheManager.get<string>(shortenUrl);
    if (!originalUrl) {
      throw new NotFoundException('Could not find url');
    }
    await this.cacheManager.del(shortenUrl);
    return originalUrl;
  }

  async createShortenUrl(originalUrl: string): Promise<string> {
    const preparedUrl = originalUrl.split('//')[1] ?? originalUrl;

    const shortenedUrl = this.generateRandomString();
    await this.cacheManager.set(shortenedUrl, preparedUrl);
    return shortenedUrl;
  }
}
