import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ example: 'Freddie Mercury', description: 'Artist name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: false,
    description: 'Whether artist has Grammy award',
  })
  @IsBoolean()
  grammy: boolean;
}
