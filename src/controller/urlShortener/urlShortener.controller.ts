import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UrlShortenerService } from '../../service/urlShortener.service';
import { Request } from 'express';
import { CreateShortenUrlDto } from '../../dto/createShortenUrl.dto';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetOriginalOkResponse } from './responses/getOriginalOk.response';
import { CreateShortenUrlResponse } from './responses/createShortenUrl.response';

@Controller()
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get('/:url')
  @ApiParam({ name: 'url', description: 'Short url' })
  @ApiOperation({ description: '', summary: '' })
  @ApiOkResponse({
    description: '',
    type: GetOriginalOkResponse,
  })
  async getOriginal(
    @Param('url')
    url: string,
  ) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(url);

    return {
      url: originalUrl,
    };
  }

  @Post('create-shorten-url')
  @ApiOkResponse({
    description: '',
    type: CreateShortenUrlResponse,
  })
  @UsePipes(new ValidationPipe())
  async createShortenLink(
    @Body() { url }: CreateShortenUrlDto,
    @Req() req: Request,
  ) {
    const shortenedUrl = await this.urlShortenerService.createShortenUrl(url);
    const host = req.get('Host');
    const protocol = req.protocol.includes('://')
      ? req.protocol
      : req.protocol + '://';
    return {
      url: protocol + host + '/' + shortenedUrl,
    };
  }
}
