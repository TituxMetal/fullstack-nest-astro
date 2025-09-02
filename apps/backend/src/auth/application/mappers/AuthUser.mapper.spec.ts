import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

import { AuthUserMapper } from './AuthUser.mapper'

describe('AuthUserMapper', () => {
  describe('toLoginDto', () => {
    it('should convert data to LoginDto', () => {
      const data = {
        emailOrUsername: 'user@example.com',
        password: 'password123'
      }

      const result = AuthUserMapper.toLoginDto(data)

      expect(result).toBeInstanceOf(LoginDto)
      expect(result.emailOrUsername).toBe('user@example.com')
      expect(result.password).toBe('password123')
    })

    it('should handle username as identifier', () => {
      const data = {
        emailOrUsername: 'username',
        password: 'password123'
      }

      const result = AuthUserMapper.toLoginDto(data)

      expect(result).toBeInstanceOf(LoginDto)
      expect(result.emailOrUsername).toBe('username')
      expect(result.password).toBe('password123')
    })
  })

  describe('toRegisterDto', () => {
    it('should convert data to RegisterDto with required fields', () => {
      const data = {
        email: 'user@example.com',
        username: 'username',
        password: 'password123'
      }

      const result = AuthUserMapper.toRegisterDto(data)

      expect(result).toBeInstanceOf(RegisterDto)
      expect(result.email).toBe('user@example.com')
      expect(result.username).toBe('username')
      expect(result.password).toBe('password123')
      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })

    it('should convert data to RegisterDto with optional fields', () => {
      const data = {
        email: 'user@example.com',
        username: 'username',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      }

      const result = AuthUserMapper.toRegisterDto(data)

      expect(result).toBeInstanceOf(RegisterDto)
      expect(result.email).toBe('user@example.com')
      expect(result.username).toBe('username')
      expect(result.password).toBe('password123')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
    })
  })

  describe('toResponseDto', () => {
    it('should convert AuthUserEntity to response dto', () => {
      const email = new EmailValueObject('user@example.com')
      const password = new PasswordValueObject('hashedPassword')
      const createdAt = new Date('2023-01-01')
      const authUser = new AuthUserEntity(
        'user-id',
        email,
        'username',
        password,
        true,
        false,
        createdAt
      )

      const result = AuthUserMapper.toResponseDto(authUser)

      expect(result).toEqual({
        id: 'user-id',
        email: 'user@example.com',
        username: 'username',
        confirmed: true,
        blocked: false,
        createdAt
      })
    })

    it('should handle unconfirmed blocked user', () => {
      const email = new EmailValueObject('blocked@example.com')
      const password = new PasswordValueObject('hashedPassword')
      const createdAt = new Date('2023-01-01')
      const authUser = new AuthUserEntity(
        'blocked-id',
        email,
        'blockeduser',
        password,
        false,
        true,
        createdAt
      )

      const result = AuthUserMapper.toResponseDto(authUser)

      expect(result).toEqual({
        id: 'blocked-id',
        email: 'blocked@example.com',
        username: 'blockeduser',
        confirmed: false,
        blocked: true,
        createdAt
      })
    })
  })
})
