import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenUrlDto {
  @ApiProperty({
    description: 'url',
  })
  @IsUrl()
  url: string;
}
