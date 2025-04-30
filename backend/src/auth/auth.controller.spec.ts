import { Test, type TestingModule } from '@nestjs/testing'
import { type CookieOptions, type Response } from 'express'

import { ConfigService } from '~/config'
import { TokenService } from '~/token'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

interface TestResponse extends Response {
  cookie: (name: string, val: string, options?: CookieOptions) => this
  clearCookie: (name: string, options?: CookieOptions) => this
}

describe('AuthController', () => {
  let controller: AuthController

  const mockResponse: TestResponse = {
    cookie: jest.fn((name: string, val: string, options?: CookieOptions) => mockResponse),
    clearCookie: jest.fn((name: string, options?: CookieOptions) => mockResponse)
  } as unknown as TestResponse

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn()
  }

  const mockTokenService = {
    generateToken: jest.fn()
  }

  const mockConfigService = {
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h'
    },
    getCookieOptions: jest.fn().mockReturnValue({
      name: 'auth',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    const loginDto: LoginDto = {
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

    it('should login user and set cookie', async () => {
      const token = 'test-token'
      mockAuthService.login.mockResolvedValue({ user, token })

      const result = await controller.login(loginDto, mockResponse)

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto)
      expect(mockConfigService.getCookieOptions).toHaveBeenCalled()
      expect(mockResponse.cookie).toHaveBeenCalledWith('auth', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      expect(result).toEqual(user)
    })
  })

  describe('register', () => {
    const registerDto: RegisterDto = {
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

    it('should register user and set cookie', async () => {
      const token = 'test-token'
      mockAuthService.register.mockResolvedValue({ user, token })

      const result = await controller.register(registerDto, mockResponse)

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto)
      expect(mockConfigService.getCookieOptions).toHaveBeenCalled()
      expect(mockResponse.cookie).toHaveBeenCalledWith('auth', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      expect(result).toEqual(user)
    })
  })

  describe('logout', () => {
    it('should clear auth cookie and return success message', () => {
      const result = controller.logout(mockResponse)

      expect(mockConfigService.getCookieOptions).toHaveBeenCalled()
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      expect(result).toEqual({ message: 'Logged out successfully' })
    })
  })
})
