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

import { Serialize } from '~/shared/decorators'
import { TokenService } from '~/token'
import { UserResponseDto } from '~/user/dto'

import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@Serialize(UserResponseDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserResponseDto> {
    const { user, payload } = await this.authService.login(loginDto)

    await this.tokenService.setCookie(response, payload)

    return user
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserResponseDto> {
    const { user, payload } = await this.authService.register(registerDto)

    await this.tokenService.setCookie(response, payload)

    return user
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response)
  }
}
