import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty()
  to: string;
  @ApiProperty()
  message: string;
}
