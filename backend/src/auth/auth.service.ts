import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma/prisma.service'
import { TokenService } from '~/token'
import { UserService } from '~/user'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }]
        }
      })

      if (!user) {
        throw new UnauthorizedException('Invalid credentials')
      }

      const isValidPassword = await argon.verify(user.hash, password)

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials')
      }

      if (user.blocked) {
        throw new UnauthorizedException('User is blocked')
      }

      const payload = { sub: user.id, identifier }

      const token = await this.tokenService.generateToken(payload)

      return {
        user,
        token
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      throw new InternalServerErrorException('An error occurred during authentication')
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, firstName, lastName } = registerDto

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists')
    }

    const user = await this.userService.create({
      password,
      firstName,
      lastName,
      email,
      username
    })

    const payload = {
      sub: user.id,
      identifier: user.username
    }

    const token = await this.tokenService.generateToken(payload)

    return {
      user,
      token
    }
  }
}
