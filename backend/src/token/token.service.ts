import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ConfigService } from '~/config/config.service'
import { PrismaService } from '~/prisma'

import { JwtPayload } from './interfaces'

@Injectable()
export class TokenService {
  private readonly jwtSecret: string
  private readonly jwtExpiration: string

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {
    this.jwtSecret = this.configService.jwt.secret
    this.jwtExpiration = this.configService.jwt.expiresIn
  }

  async generateToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtExpiration
    })
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
}
