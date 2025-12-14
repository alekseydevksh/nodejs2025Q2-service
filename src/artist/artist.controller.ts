import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Artist')
@ApiBearerAuth('JWT-auth')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new artist' })
  @ApiBody({ type: CreateArtistDto })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestMissingFields())
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse(ApiResponses.Success())
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single artist by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('artist'))
  @ApiResponse(ApiResponses.NotFound('Artist'))
  async findOne(@Param('id', new ParseUUIDPipe('artist')) id: string) {
    return await this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateArtistDto })
  @ApiResponse(ApiResponses.Updated('artist'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('artist'))
  @ApiResponse(ApiResponses.NotFound('Artist'))
  async update(
    @Param('id', new ParseUUIDPipe('artist')) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('artist'))
  @ApiResponse(ApiResponses.NotFound('Artist'))
  async remove(@Param('id', new ParseUUIDPipe('artist')) id: string) {
    await this.artistService.remove(id);
  }
}
