import { Injectable } from '@nestjs/common'

import { RegisterDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

export interface RegisterResult {
  user: {
    id: string
    email: string
    username: string
    confirmed: boolean
  }
}

interface PasswordService {
  hash(plainPassword: string): Promise<string>
}

interface IdGenerator {
  generate(): string
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordService: PasswordService,
    private readonly idGenerator: IdGenerator
  ) {}

  async execute(registerDto: RegisterDto): Promise<RegisterResult> {
    const email = new EmailValueObject(registerDto.email)

    const existingUserByEmail = await this.authUserRepository.findByEmail(email)
    if (existingUserByEmail) {
      throw new Error('Email already exists')
    }

    const existingUserByUsername = await this.authUserRepository.findByUsername(
      registerDto.username
    )
    if (existingUserByUsername) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await this.passwordService.hash(registerDto.password)
    const password = new PasswordValueObject(hashedPassword)

    const userId = this.idGenerator.generate()
    const authUser = new AuthUserEntity(
      userId,
      email,
      registerDto.username,
      password,
      true, // Set to true for testing - users are confirmed by default
      false,
      new Date()
    )

    const savedUser = await this.authUserRepository.save(authUser)

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email.value,
        username: savedUser.username,
        confirmed: savedUser.confirmed
      }
    }
  }
}
