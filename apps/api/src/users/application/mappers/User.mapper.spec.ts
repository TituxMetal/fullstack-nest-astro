import { GetUserProfileDto, UpdateUserProfileDto, CreateUserDto } from '~/users/application/dtos'
import { UserEntity } from '~/users/domain/entities'
import {
  UserIdValueObject,
  UsernameValueObject,
  NameValueObject
} from '~/users/domain/value-objects'

import { UserMapper } from './User.mapper'

describe('UserMapper', () => {
  describe('toGetUserProfileDto', () => {
    it('should map UserEntity to GetUserProfileDto with all fields', () => {
      const userEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true,
        false,
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-02T00:00:00Z')
      )

      const result = UserMapper.toGetUserProfileDto(userEntity)

      expect(result).toBeInstanceOf(GetUserProfileDto)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.email).toBe('john@example.com')
      expect(result.username).toBe('johndoe')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.confirmed).toBe(true)
      expect(result.blocked).toBe(false)
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-02T00:00:00Z'))
    })

    it('should map UserEntity to GetUserProfileDto with undefined names', () => {
      const userEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        undefined,
        undefined,
        true,
        false,
        new Date(),
        new Date()
      )

      const result = UserMapper.toGetUserProfileDto(userEntity)

      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })
  })

  describe('fromUpdateUserProfileDto', () => {
    it('should create updated UserEntity from UpdateUserProfileDto', () => {
      const existingEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true,
        false,
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-01T00:00:00Z')
      )

      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'janedoe'
      updateDto.firstName = 'Jane'
      updateDto.lastName = 'Smith'

      const result = UserMapper.fromUpdateUserProfileDto(updateDto, existingEntity)

      expect(result).toBeInstanceOf(UserEntity)
      expect(result.id).toBe(existingEntity.id)
      expect(result.email).toBe(existingEntity.email)
      expect(result.username.value).toBe('janedoe')
      expect(result.firstName?.value).toBe('Jane')
      expect(result.lastName?.value).toBe('Smith')
      expect(result.confirmed).toBe(existingEntity.confirmed)
      expect(result.blocked).toBe(existingEntity.blocked)
      expect(result.createdAt).toBe(existingEntity.createdAt)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should handle partial updates preserving existing values', () => {
      const existingEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true,
        false,
        new Date(),
        new Date()
      )

      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'janedoe'

      const result = UserMapper.fromUpdateUserProfileDto(updateDto, existingEntity)

      expect(result.username.value).toBe('janedoe')
      expect(result.firstName).toBe(existingEntity.firstName)
      expect(result.lastName).toBe(existingEntity.lastName)
    })

    it('should handle clearing names with empty strings', () => {
      const existingEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true,
        false,
        new Date(),
        new Date()
      )

      const updateDto = new UpdateUserProfileDto()
      updateDto.firstName = ''
      updateDto.lastName = ''

      const result = UserMapper.fromUpdateUserProfileDto(updateDto, existingEntity)

      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })
  })

  describe('fromCreateUserDto', () => {
    it('should create UserEntity from CreateUserDto with all fields', () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'
      createDto.firstName = 'John'
      createDto.lastName = 'Doe'

      const result = UserMapper.fromCreateUserDto(createDto)

      expect(result).toBeInstanceOf(UserEntity)
      expect(result.id).toBeInstanceOf(UserIdValueObject)
      expect(result.email).toBe('john@example.com')
      expect(result.username.value).toBe('johndoe')
      expect(result.firstName?.value).toBe('John')
      expect(result.lastName?.value).toBe('Doe')
      expect(result.confirmed).toBe(true)
      expect(result.blocked).toBe(false)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should create UserEntity from CreateUserDto without optional names', () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const result = UserMapper.fromCreateUserDto(createDto)

      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })
  })
})
