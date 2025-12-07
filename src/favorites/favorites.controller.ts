import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse(ApiResponses.Success())
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add artist to the favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Created('Added successfully'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('artist'))
  @ApiResponse(ApiResponses.UnprocessableEntity('Artist'))
  async addArtist(@Param('id', new ParseUUIDPipe('artist')) id: string) {
    await this.favoritesService.addArtist(id);
    return { message: 'Added successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('artist'))
  @ApiResponse(ApiResponses.NotFound('Artist'))
  async removeArtist(@Param('id', new ParseUUIDPipe('artist')) id: string) {
    await this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add album to the favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Created('Added successfully'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('album'))
  @ApiResponse(ApiResponses.UnprocessableEntity('Album'))
  async addAlbum(@Param('id', new ParseUUIDPipe('album')) id: string) {
    await this.favoritesService.addAlbum(id);
    return { message: 'Added successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('album'))
  @ApiResponse(ApiResponses.NotFound('Album'))
  async removeAlbum(@Param('id', new ParseUUIDPipe('album')) id: string) {
    await this.favoritesService.removeAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add track to the favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Created('Added successfully'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.UnprocessableEntity('Track'))
  async addTrack(@Param('id', new ParseUUIDPipe('track')) id: string) {
    await this.favoritesService.addTrack(id);
    return { message: 'Added successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  async removeTrack(@Param('id', new ParseUUIDPipe('track')) id: string) {
    await this.favoritesService.removeTrack(id);
  }
}
