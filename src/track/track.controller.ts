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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new track' })
  @ApiBody({ type: CreateTrackDto })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestMissingFields())
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get tracks list' })
  @ApiResponse(ApiResponses.Success())
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  findOne(@Param('id', new ParseUUIDPipe('track')) id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track information' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateTrackDto })
  @ApiResponse(ApiResponses.Updated('track'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  update(
    @Param('id', new ParseUUIDPipe('track')) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  remove(@Param('id', new ParseUUIDPipe('track')) id: string) {
    this.trackService.remove(id);
  }
}
