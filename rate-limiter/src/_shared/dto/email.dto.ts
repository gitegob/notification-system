import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class EmailDto {
  @ApiProperty()
  @IsPhoneNumber(null, {
    message: 'Phone number must be in the format +25078xxxxxxx',
  })
  to: string;
  @ApiProperty()
  @IsString()
  message: string;
}
