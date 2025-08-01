import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Response } from 'express'

import { ConfigService } from '~/config/config.service'
import { Serialize } from '~/shared/decorators'
import { UserResponseDto } from '~/user/dto'

import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@Serialize(UserResponseDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserResponseDto> {
    const { user, token } = await this.authService.login(loginDto)

    const { name, ...options } = this.configService.getCookieOptions()

    response.cookie(name, token, options)

    return user
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserResponseDto> {
    const { user, token } = await this.authService.register(registerDto)

    const { name, ...options } = this.configService.getCookieOptions()

    response.cookie(name, token, options)

    return user
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    const { name, ...options } = this.configService.getCookieOptions()

    response.clearCookie(name, options)

    return { message: 'Logged out successfully' }
  }
}
