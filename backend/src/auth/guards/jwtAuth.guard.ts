import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { IS_PUBLIC_KEY } from '~/auth/decorators'
import { TokenService } from '~/token'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublicRoute) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.tokenService.verifyToken(token)
      request['user'] = payload

      return true
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  private extractToken(request: Request): string | undefined {
    // First try to extract from cookies
    const cookieToken = this.tokenService.extractTokenFromCookies(request.cookies)
    if (cookieToken) {
      return cookieToken
    }

    // Fall back to authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
