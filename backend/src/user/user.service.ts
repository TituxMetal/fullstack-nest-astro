import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'

import { PrismaService } from '~/prisma'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserNotFoundException } from './exceptions/user-not-found.exception'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto
    const hash = await argon2.hash(password)

    return this.prisma.user.create({
      data: {
        ...rest,
        hash
      }
    })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new UserNotFoundException(id)
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserNotFoundException(id)
      }
      throw error
    }
  }
}
