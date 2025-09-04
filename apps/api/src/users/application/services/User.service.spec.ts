import { Test } from '@nestjs/testing'

import { CreateUserDto, GetUserProfileDto, UpdateUserProfileDto } from '~/users/application/dtos'
import {
  CreateUserUseCase,
  DeleteUserAccountUseCase,
  GetAllUsersUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase
} from '~/users/application/use-cases'

import { UserService } from './User.service'

describe('UserService', () => {
  let service: UserService
  let mockGetUserProfileUseCase: jest.Mocked<GetUserProfileUseCase>
  let mockUpdateUserProfileUseCase: jest.Mocked<UpdateUserProfileUseCase>
  let mockDeleteUserAccountUseCase: jest.Mocked<DeleteUserAccountUseCase>
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>
  let mockGetAllUsersUseCase: jest.Mocked<GetAllUsersUseCase>

  beforeEach(async () => {
    mockGetUserProfileUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<GetUserProfileUseCase>

    mockUpdateUserProfileUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<UpdateUserProfileUseCase>

    mockDeleteUserAccountUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<DeleteUserAccountUseCase>

    mockCreateUserUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateUserUseCase>

    mockGetAllUsersUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<GetAllUsersUseCase>

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: GetUserProfileUseCase,
          useValue: mockGetUserProfileUseCase
        },
        {
          provide: UpdateUserProfileUseCase,
          useValue: mockUpdateUserProfileUseCase
        },
        {
          provide: DeleteUserAccountUseCase,
          useValue: mockDeleteUserAccountUseCase
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase
        },
        {
          provide: GetAllUsersUseCase,
          useValue: mockGetAllUsersUseCase
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  describe('getUserProfile', () => {
    it('should call getUserProfileUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId

      mockGetUserProfileUseCase.execute.mockResolvedValue(expectedDto)

      const result = await service.getUserProfile(userId)

      expect(mockGetUserProfileUseCase.execute).toHaveBeenCalledWith(userId)
      expect(result).toBe(expectedDto)
    })
  })

  describe('updateUserProfile', () => {
    it('should call updateUserProfileUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'newusername'

      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId
      expectedDto.username = 'newusername'

      mockUpdateUserProfileUseCase.execute.mockResolvedValue(expectedDto)

      const result = await service.updateUserProfile(userId, updateDto)

      expect(mockUpdateUserProfileUseCase.execute).toHaveBeenCalledWith(userId, updateDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('deleteUserAccount', () => {
    it('should call deleteUserAccountUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'

      mockDeleteUserAccountUseCase.execute.mockResolvedValue(undefined)

      await service.deleteUserAccount(userId)

      expect(mockDeleteUserAccountUseCase.execute).toHaveBeenCalledWith(userId)
    })
  })

  describe('createUser', () => {
    it('should call createUserUseCase with correct parameters', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const expectedDto = new GetUserProfileDto()
      expectedDto.email = createDto.email
      expectedDto.username = createDto.username

      mockCreateUserUseCase.execute.mockResolvedValue(expectedDto)

      const result = await service.createUser(createDto)

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('getAllUsers', () => {
    it('should call getAllUsersUseCase', async () => {
      const expectedUsers = [new GetUserProfileDto(), new GetUserProfileDto()]

      mockGetAllUsersUseCase.execute.mockResolvedValue(expectedUsers)

      const result = await service.getAllUsers()

      expect(mockGetAllUsersUseCase.execute).toHaveBeenCalled()
      expect(result).toBe(expectedUsers)
    })
  })
})
