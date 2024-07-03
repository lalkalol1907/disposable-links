import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenUrlResponse {
  @ApiProperty()
  url: string;
}
