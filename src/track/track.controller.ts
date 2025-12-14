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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Track')
@ApiBearerAuth('JWT-auth')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new track' })
  @ApiBody({ type: CreateTrackDto })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestMissingFields())
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get tracks list' })
  @ApiResponse(ApiResponses.Success())
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  async findOne(@Param('id', new ParseUUIDPipe('track')) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track information' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateTrackDto })
  @ApiResponse(ApiResponses.Updated('track'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  async update(
    @Param('id', new ParseUUIDPipe('track')) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('track'))
  @ApiResponse(ApiResponses.NotFound('Track'))
  async remove(@Param('id', new ParseUUIDPipe('track')) id: string) {
    await this.trackService.remove(id);
  }
}
