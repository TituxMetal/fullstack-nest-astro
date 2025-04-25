import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

import { PrismaService } from '~/prisma'

import { JwtPayload, TokenCookieOptions } from './interfaces'

@Injectable()
export class TokenService {
  private readonly jwtSecret: string
  private readonly jwtExpiration: string
  private readonly cookieName: string
  private readonly isProduction: boolean
  private readonly sessionTtl: number

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')
    this.jwtExpiration = this.configService.get<string>('JWT_EXPIRES_IN', '1d')
    this.cookieName = this.configService.get<string>('AUTH_COOKIE_NAME', 'auth_token')
    this.sessionTtl = this.configService.get<number>('SESSION_TTL', 24 * 60 * 60 * 1000)
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production'
  }

  async generateToken(jwtPayload: JwtPayload) {
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtExpiration
    })

    return token
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret
      })

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return payload
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }

  getCookieOptions(): TokenCookieOptions {
    return {
      name: this.cookieName,
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      maxAge: this.sessionTtl,
      path: '/'
    }
  }

  async setCookie(response: Response, jwtPayload: JwtPayload) {
    const token = await this.generateToken(jwtPayload)
    const options = this.getCookieOptions()

    response.cookie(options.name, token, options)

    return token
  }

  clearCookie(response: Response) {
    const { name, ...options } = this.getCookieOptions()

    response.clearCookie(name, options)
  }

  extractTokenFromCookies(cookies: Record<string, string>) {
    const cookieName = this.cookieName

    return cookies?.[cookieName] || null
  }
}
