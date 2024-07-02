import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UrlShortenerService } from './urlShortener.service';
import { Request, Response } from 'express';
import QueryBool from '../decorators/QueryBool';

@Controller()
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get('/:url')
  @UsePipes(new ValidationPipe({ transform: true }))
  async redirectToOriginal(
    @Param('url') url: string,
    @Res() res: Response,
    @QueryBool({
      field: 'redirect',
      defaultValue: true,
    })
    redirect?: boolean,
  ) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(url);

    if (redirect) {
      res.redirect('http://' + originalUrl);
      return;
    }

    res.json({
      url: originalUrl,
    });
  }

  @Post('create-shorten-url')
  async createLink(@Body() { url }: { url: string }, @Req() req: Request) {
    const shortenedUrl = await this.urlShortenerService.createShortenUrl(url);
    const host = req.get('Host');
    return {
      url: host + '/' + shortenedUrl,
    };
  }
}
