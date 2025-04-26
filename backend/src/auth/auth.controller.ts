import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { TokenService } from '~/token'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { user, payload } = await this.authService.login(loginDto)

    await this.tokenService.setCookie(response, payload)

    return { user }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const { user, payload } = await this.authService.register(registerDto)

    await this.tokenService.setCookie(response, payload)

    return { user }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response)
  }
}
