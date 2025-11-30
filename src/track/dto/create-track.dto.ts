import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ example: 'Bohemian Rhapsody', description: 'Track name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Artist ID (UUID)',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Album ID (UUID)',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  albumId?: string | null;

  @ApiProperty({ example: 262, description: 'Duration in seconds' })
  @IsNumber()
  duration: number;
}
