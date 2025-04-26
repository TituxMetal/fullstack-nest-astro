import { Test, type TestingModule } from '@nestjs/testing'
import { type Response } from 'express'

import { TokenService } from '~/token'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController

  const mockResponse = {
    cookie: jest.fn()
  } as unknown as Response

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  }

  const mockTokenService = {
    setCookie: jest.fn(),
    clearCookie: jest.fn()
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    const loginDto = {
      identifier: 'testuser',
      password: 'password123'
    }

    const user = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User'
    }

    const payload = {
      sub: user.id,
      identifier: user.username
    }

    it('should login user and set cookie', async () => {
      mockAuthService.login.mockResolvedValue({ user, payload })

      const result = await controller.login(loginDto, mockResponse)

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto)
      expect(mockTokenService.setCookie).toHaveBeenCalledWith(mockResponse, payload)
      expect(result).toEqual({ user })
    })
  })

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    }

    const user = {
      id: '2',
      email: 'new@example.com',
      username: 'newuser',
      firstName: 'New',
      lastName: 'User'
    }

    const payload = {
      sub: user.id,
      identifier: user.username
    }

    it('should register user and set cookie', async () => {
      mockAuthService.register.mockResolvedValue({ user, payload })

      const result = await controller.register(registerDto, mockResponse)

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto)
      expect(mockTokenService.setCookie).toHaveBeenCalledWith(mockResponse, payload)
      expect(result).toEqual({ user })
    })
  })

  describe('logout', () => {
    it('should clear auth cookie and return success message', () => {
      const expectedResult = { message: 'Logged out successfully' }
      mockAuthService.logout.mockReturnValue(expectedResult)

      const result = controller.logout(mockResponse)

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual(expectedResult)
    })
  })
})
