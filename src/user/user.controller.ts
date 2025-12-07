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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';
import { ApiResponses } from '../common/swagger/api-responses';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse(ApiResponses.Success())
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single user by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Success())
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('user'))
  @ApiResponse(ApiResponses.NotFoundUser())
  async findOne(@Param('id', new ParseUUIDPipe('user')) id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse(ApiResponses.Created('The user has been created.'))
  @ApiResponse(ApiResponses.BadRequestMissingFields())
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: "Update a user's password" })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse(ApiResponses.Updated('user'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('user'))
  @ApiResponse(ApiResponses.ForbiddenWrongPassword())
  @ApiResponse(ApiResponses.NotFoundUser())
  async update(
    @Param('id', new ParseUUIDPipe('user')) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse(ApiResponses.Deleted('The user has been deleted'))
  @ApiResponse(ApiResponses.BadRequestInvalidUuid('user'))
  @ApiResponse(ApiResponses.NotFoundUser())
  async remove(@Param('id', new ParseUUIDPipe('user')) id: string) {
    await this.userService.remove(id);
  }
}
