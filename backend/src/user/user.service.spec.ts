import { Test, type TestingModule } from '@nestjs/testing'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'

import { PrismaService } from '~/prisma'

import { type User } from './entities/user.entity'
import { UserNotFoundException } from './exceptions/user-not-found.exception'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let prismaService: PrismaService

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    hash: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    confirmed: true,
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser'
      }

      const mockHash = '$argon2id$v=19$m=65536,t=3,p=4$mockHash'
      jest.spyOn(argon2, 'hash').mockResolvedValue(mockHash)

      const spy = jest.spyOn(prismaService.user, 'create')
      spy.mockResolvedValue(mockUser)

      const result = await service.create(createUserDto)

      expect(result).toEqual(mockUser)
      expect(spy).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          username: createUserDto.username,
          hash: mockHash
        }
      })
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser]

      const spy = jest.spyOn(prismaService.user, 'findMany')
      spy.mockResolvedValue(users)

      const result = await service.findAll()

      expect(result).toEqual(users)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique')
      spy.mockResolvedValue(mockUser)

      const result = await service.findOne('1')

      expect(result).toEqual(mockUser)
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique')
      spy.mockResolvedValue(null)

      await expect(service.findOne('1')).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        firstName: 'Updated'
      }

      const spy = jest.spyOn(prismaService.user, 'update')
      spy.mockResolvedValue({
        ...mockUser,
        ...updateUserDto
      })

      const result = await service.update('1', updateUserDto)

      expect(result).toEqual({
        ...mockUser,
        ...updateUserDto
      })
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const updateUserDto = {
        firstName: 'Updated'
      }

      const spy = jest.spyOn(prismaService.user, 'update')
      spy.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '1.0.0'
        })
      )

      await expect(service.update('1', updateUserDto)).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      const spy = jest.spyOn(prismaService.user, 'delete')
      spy.mockResolvedValue(mockUser)

      await service.remove('1')

      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const spy = jest.spyOn(prismaService.user, 'delete')
      spy.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '1.0.0'
        })
      )

      await expect(service.remove('1')).rejects.toThrow(UserNotFoundException)
    })
  })
})
