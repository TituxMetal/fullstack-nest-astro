import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express'

type RequestWithCookies = Request & {
  cookies?: Record<string, string>
}

import { AuthUserMapper } from '~/auth/application/mappers'
import { AuthService } from '~/auth/application/services'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    registerData: {
      email: string
      username: string
      password: string
      firstName?: string
      lastName?: string
    }
  ) {
    const registerDto = AuthUserMapper.toRegisterDto(registerData)
    return this.authService.register(registerDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: { emailOrUsername: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    const loginDto = AuthUserMapper.toLoginDto(loginData)
    const result = await this.authService.login(loginDto)

    response.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    return { user: result.user }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: RequestWithCookies, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.auth_token as string | undefined

    await this.authService.logout(token)

    response.clearCookie('auth_token')

    return { success: true }
  }
}
