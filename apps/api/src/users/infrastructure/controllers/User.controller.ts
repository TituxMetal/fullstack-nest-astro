import { Controller, Get, Patch, Delete, Post, Body, UseGuards } from '@nestjs/common'

import { GetCurrentUser } from '~/auth/infrastructure/decorators/GetCurrentUser.decorator'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import type { AuthenticatedUser } from '~/shared/types'
import type {
  GetUserProfileDto,
  UpdateUserProfileDto,
  CreateUserDto
} from '~/users/application/dtos'
import { UserService } from '~/users/application/services'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetCurrentUser() user: AuthenticatedUser): Promise<GetUserProfileDto> {
    return this.userService.getUserProfile(user.sub)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetCurrentUser() user: AuthenticatedUser,
    @Body() updateDto: UpdateUserProfileDto
  ): Promise<GetUserProfileDto> {
    return this.userService.updateUserProfile(user.sub, updateDto)
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@GetCurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.userService.deleteUserAccount(user.sub)
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Admin endpoint - requires authentication
  async createUser(@Body() createDto: CreateUserDto): Promise<GetUserProfileDto> {
    return this.userService.createUser(createDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Admin endpoint - requires authentication
  async getAllUsers(): Promise<GetUserProfileDto[]> {
    return this.userService.getAllUsers()
  }
}
