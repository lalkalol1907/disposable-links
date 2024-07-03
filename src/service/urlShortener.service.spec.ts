import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from '../controller/urlShortener/urlShortener.controller';
import { UrlShortenerService } from './urlShortener.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';

const CACHE_DATA: Record<string, string> = {
  '3e971e540f29480a937f00ca162403a2': 'aboba.com',
};

const addDelimitersToUuid = (uuid: string) =>
  uuid.slice(0, 8) +
  '-' +
  uuid.slice(8, 12) +
  '-' +
  uuid.slice(12, 16) +
  '-' +
  uuid.slice(16, 20) +
  '-' +
  uuid.slice(20, 32);

describe('UrlShortenerController', () => {
  let urlShortenerService: UrlShortenerService;
  let cacheData: Record<string, string> = {
    '3e971e540f29480a937f00ca162403a2': 'aboba.com',
  };
  const cache = {
    get: (key: string) => cacheData[key],
    set: (key: string, value: string) => (cacheData[key] = value),
    del: (key: string) => (cacheData[key] = undefined),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [UrlShortenerService],
    })
      .useMocker((token) => {
        if (token === CACHE_MANAGER) {
          return cache;
        }
      })
      .compile();

    urlShortenerService = app.get<UrlShortenerService>(UrlShortenerService);
  });

  describe('getOriginalUrl', () => {
    afterAll(() => {
      cacheData = { ...CACHE_DATA };
    });

    it('should return "aboba.com"', async () => {
      const result = await urlShortenerService.getOriginalUrl(
        '3e971e540f29480a937f00ca162403a2',
      );

      expect(result).toBe('aboba.com');
    });

    it('should throw NotFoundException"', async () => {
      await expect(
        urlShortenerService.getOriginalUrl('3e971e540f29480a937f00ca162403a2'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createShortenUrl', () => {
    it('should return random uuidv4 without delimiters and create cache record', async () => {
      const result = await urlShortenerService.createShortenUrl('aboba.com');
      expect(isUUID(addDelimitersToUuid(result), '4')).toBe(true);
      expect(cacheData[result]).toBe('aboba.com');
    });
  });
});
