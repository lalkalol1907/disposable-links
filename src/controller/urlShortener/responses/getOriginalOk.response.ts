import { ApiProperty } from '@nestjs/swagger';

export class GetOriginalOkResponse {
  @ApiProperty()
  url: string;
}
