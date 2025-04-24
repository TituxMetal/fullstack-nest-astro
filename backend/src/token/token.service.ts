import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '~/prisma'

import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class TokenService {
  private readonly jwtSecret: string
  private readonly jwtExpiration: string

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')
    this.jwtExpiration = this.configService.get<string>('JWT_EXPIRES_IN')
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
}
