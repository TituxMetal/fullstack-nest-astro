import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { GetCurrentUser } from '~/auth/decorators'
import { JwtAuthGuard } from '~/auth/guards/jwtAuth.guard'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@GetCurrentUser() user: { sub: string }): Promise<User> {
    return this.userService.getProfile(user.sub)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @GetCurrentUser() user: { sub: string },
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(user.sub, updateUserDto)
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@GetCurrentUser() user: { sub: string }): Promise<void> {
    await this.userService.remove(user.sub)
  }
}
