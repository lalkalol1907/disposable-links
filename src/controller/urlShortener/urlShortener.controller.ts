import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UrlShortenerService } from '../../service/urlShortener.service';
import { Request, Response } from 'express';
import { CreateShortenUrlDto } from '../../dto/createShortenUrlDto';

@Controller()
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get('/:url')
  async getOriginal(@Param('url') url: string) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(url);

    return {
      url: originalUrl,
    };
  }

  @Post('create-shorten-url')
  @UsePipes(new ValidationPipe())
  async createLink(@Body() { url }: CreateShortenUrlDto, @Req() req: Request) {
    const shortenedUrl = await this.urlShortenerService.createShortenUrl(url);
    const host = req.get('Host');
    return {
      url: req.protocol + host + '/' + shortenedUrl,
    };
  }
}
