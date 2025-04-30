import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon from 'argon2'

import { TokenService } from '~/token'
import type { JwtPayload } from '~/token/interfaces'
import { UserService } from '~/user'
import { UserNotFoundException } from '~/user/exceptions'

import { LoginDto, RegisterDto } from './dto'
import { AuthUser } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  async login(loginDto: LoginDto): Promise<AuthUser> {
    const { identifier, password } = loginDto

    try {
      const user = await this.userService.findByEmailOrUsername(identifier)

      const isValidPassword = await argon.verify(user.hash, password)

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials')
      }

      if (user.blocked) {
        throw new UnauthorizedException('User is blocked')
      }

      const payload: JwtPayload = {
        sub: user.id,
        identifier: user.username
      }

      const token = await this.tokenService.generateToken(payload)

      return { user, token }
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException('Invalid credentials')
      }

      throw error
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthUser> {
    const { email, username, password, firstName, lastName } = registerDto

    try {
      const user = await this.userService.create({
        password,
        firstName,
        lastName,
        email,
        username
      })

      const payload: JwtPayload = {
        sub: user.id,
        identifier: user.username
      }

      const token = await this.tokenService.generateToken(payload)

      return { user, token }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User already exists')
        }
      }

      throw error
    }
  }
}
