import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlShortenerModule } from '../src/module/urlShortener.module';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UrlShortenerModule, ConfigModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/:url (GET)', () => {
    it('should return 404 Not found', async () => {
      const result = await request(app.getHttpServer()).get('/testempty');

      expect(result.status).toBe(404);
      expect(result.body).toEqual({
        message: 'Could not find url',
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('/create-shorten-url (POST)', () => {
    it('should return 201 and shorten url', async () => {
      const result = await request(app.getHttpServer())
        .post('/create-shorten-url')
        .send({
          url: 'aboba.com',
        });

      expect(result.status).toBe(201);
      expect(result.body.url).toMatch(
        /http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
      );

      const urlSplit = result.body.url.split('/');
      const path = urlSplit[urlSplit.length - 1];

      await request(app.getHttpServer())
        .get('/' + path)
        .expect(200)
        .expect({
          url: 'aboba.com',
        });

      await request(app.getHttpServer())
        .get('/' + path)
        .expect(404)
        .expect({
          message: 'Could not find url',
          error: 'Not Found',
          statusCode: 404,
        });
    });

    it('should return 400 and shorten url', async () => {
      const result = await request(app.getHttpServer()).post(
        '/create-shorten-url',
      );

      expect(result.status).toBe(400);
      expect(result.body).toEqual({
        error: 'Bad Request',
        message: ['url must be a URL address'],
        statusCode: 400,
      });
    });
  });
});
