import { Injectable } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon2 from 'argon2'

import { PrismaService } from '~/prisma'

import { CreateUserDto, UpdateUserDto } from './dto'
import { UserEntity } from './entities'
import { UserNotFoundException } from './exceptions'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hash = await argon2.hash(createUserDto.password)
    const { password, ...userData } = createUserDto

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        hash
      }
    })

    return user
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany()
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new UserNotFoundException(id)
    }

    return user
  }

  async findByEmailOrUsername(identifier: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    })

    if (!user) {
      throw new UserNotFoundException(identifier)
    }

    return user
  }

  async getProfile(id: string): Promise<UserEntity> {
    return this.findOne(id)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto
      })

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserNotFoundException(id)
      }

      throw error
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserNotFoundException(id)
      }

      throw error
    }
  }
}
