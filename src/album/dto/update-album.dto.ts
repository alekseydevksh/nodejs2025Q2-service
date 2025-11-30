import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiProperty({ example: 'Innuendo', description: 'Album name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1991, description: 'Album release year' })
  @IsNumber()
  year: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Artist ID (UUID)',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
