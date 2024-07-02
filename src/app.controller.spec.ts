import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url_shortener/urlShortener.controller';
import { UrlShortenerService } from './url_shortener/urlShortener.service';

describe('AppController', () => {
  let appController: UrlShortenerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [UrlShortenerService],
    }).compile();

    appController = app.get<UrlShortenerController>(UrlShortenerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
