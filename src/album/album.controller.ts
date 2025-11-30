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
} from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new album' })
  @ApiBody({ type: CreateAlbumDto })
  @ApiResponse(ApiResponses.Created('Album is created'))
  @ApiResponse(ApiResponses.BadRequestMissingFields())
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get albums list' })
  @ApiResponse(ApiResponses.Success())
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single album by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('album'))
  @ApiResponse(ApiResponses.NotFound('Album'))
  findOne(@Param('id', new ParseUUIDPipe('album')) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album information' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateAlbumDto })
  @ApiResponse(ApiResponses.Updated('album'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('album'))
  @ApiResponse(ApiResponses.NotFound('Album'))
  update(
    @Param('id', new ParseUUIDPipe('album')) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('album'))
  @ApiResponse(ApiResponses.NotFound('Album'))
  remove(@Param('id', new ParseUUIDPipe('album')) id: string) {
    this.albumService.remove(id);
  }
}
