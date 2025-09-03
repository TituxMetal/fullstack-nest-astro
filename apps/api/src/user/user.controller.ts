import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { GetCurrentUser } from '~/auth/infrastructure/decorators'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import { Serialize } from '~/shared/decorators'

import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto'
import { UserService } from './user.service'

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@Serialize(UserResponseDto)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll()
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@GetCurrentUser() user: { sub: string }): Promise<UserResponseDto> {
    return this.userService.getProfile(user.sub)
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @GetCurrentUser() user: { sub: string },
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(user.sub, updateUserDto)
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@GetCurrentUser() user: { sub: string }): Promise<void> {
    return this.userService.remove(user.sub)
  }
}
