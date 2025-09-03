import { Injectable } from '@nestjs/common'

import { LoginDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import { InvalidCredentialsException } from '~/auth/domain/exceptions'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { EmailValueObject } from '~/auth/domain/value-objects'

export interface LoginResult {
  token: string
  user: {
    id: string
    email: string
    username: string
  }
}

interface PasswordService {
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>
}

interface JwtService {
  generateToken(payload: { sub: string; email: string; username: string }): string
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResult> {
    const isEmail = this.isEmailFormat(loginDto.emailOrUsername)

    let authUser: AuthUserEntity | null = null

    if (isEmail) {
      const email = new EmailValueObject(loginDto.emailOrUsername)
      authUser = await this.authUserRepository.findByEmail(email)
    } else {
      authUser = await this.authUserRepository.findByUsername(loginDto.emailOrUsername)
    }

    if (!authUser) {
      throw new InvalidCredentialsException('Invalid credentials')
    }

    if (!authUser.isActive()) {
      throw new InvalidCredentialsException('Account is not active')
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      authUser.password.value
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid credentials')
    }

    const token = this.jwtService.generateToken({
      sub: authUser.id,
      email: authUser.email.value,
      username: authUser.username
    })

    return {
      token,
      user: {
        id: authUser.id,
        email: authUser.email.value,
        username: authUser.username
      }
    }
  }

  private isEmailFormat(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(input)
  }
}
